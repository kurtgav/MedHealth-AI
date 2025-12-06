import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { NextResponse } from "next/server";

import sampleOutput from "@/src/data/sample_outputs/output_high_risk_example.json";
import { validateMedHealthOutput } from "@/src/lib/validateOutput";
import { SYSTEM_MEDHEALTH_PROMPT } from "@/src/prompts/system_medhealth";

const ANTHROPIC_MODEL = "claude-3-5-sonnet-20241022";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export async function POST(req: Request) {
  try {
    const intake = await req.json();

    if (!intake) {
      return NextResponse.json({ error: "Missing intake payload" }, { status: 400 });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Fallback to sample output if no API key is configured.
    if (!anthropicKey && !openaiKey) {
      const validated = validateMedHealthOutput(sampleOutput);
      return NextResponse.json({ ok: true, data: validated, source: "sample" });
    }

    const userPrompt = `Analyze the following patient intake JSON and return JSON exactly matching the MedHealth schema. Intake: ${JSON.stringify(
      intake
    )}`;

    // Prefer OpenAI if key provided, else Anthropic.
    if (openaiKey) {
      const parsed = await fetchOpenAI({
        apiKey: openaiKey,
        model: OPENAI_MODEL,
        system: SYSTEM_MEDHEALTH_PROMPT,
        userPrompt,
      });
      const { data, warning } = safeValidateOrFallback(parsed);
      return NextResponse.json({ ok: true, data, source: warning ? "openai-fallback" : "openai", warning });
    }

    if (anthropicKey) {
      const parsed = await fetchAnthropic({
        apiKey: anthropicKey,
        model: ANTHROPIC_MODEL,
        system: SYSTEM_MEDHEALTH_PROMPT,
        userPrompt,
      });
      const { data, warning } = safeValidateOrFallback(parsed);
      return NextResponse.json({ ok: true, data, source: warning ? "anthropic-fallback" : "anthropic", warning });
    }
  } catch (error) {
    console.error("LLM route error", error);
    return NextResponse.json(
      { error: (error as Error).message, details: (error as Error & { details?: unknown }).details || null },
      { status: 500 }
    );
  }
}

async function fetchAnthropic(params: { apiKey: string; model: string; system: string; userPrompt: string }) {
  const client = new Anthropic({ apiKey: params.apiKey });

  const message = await client.messages.create({
    model: params.model,
    max_tokens: 1500,
    temperature: 0.2,
    system: params.system,
    messages: [{ role: "user", content: [{ type: "text", text: params.userPrompt }] }],
  });

  const content = message.content[0];
  const rawText = content?.type === "text" ? content.text : "";

  const match = rawText.match(/```json([\s\S]*?)```/i);
  const jsonText = match ? match[1].trim() : rawText.trim();

  return safeParseJson(jsonText, rawText);
}

async function fetchOpenAI(params: { apiKey: string; model: string; system: string; userPrompt: string }) {
  const openai = new OpenAI({ apiKey: params.apiKey });
  const completion = await openai.chat.completions.create({
    model: params.model,
    temperature: 0.2,
    // Allow model to produce JSON freely; Ajv will enforce schema.
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.userPrompt },
    ],
  });

  const rawText = completion.choices[0]?.message?.content || "";
  const match = rawText.match(/```json([\s\S]*?)```/i);
  const jsonText = match ? match[1].trim() : rawText.trim();

  return safeParseJson(jsonText, rawText);
}

function safeParseJson(jsonText: string, rawText: string): unknown {
  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error(`Failed to parse JSON from model: ${rawText.slice(0, 400)}`);
  }
}

function safeValidateOrFallback(parsed: unknown): { data: unknown; warning?: string } {
  try {
    const validated = validateMedHealthOutput(parsed);
    return { data: validated };
  } catch (err) {
    // Surface the model response even if it is slightly off-schema so the UI can render best-effort data.
    const warning = (err as Error).message;
    return { data: parsed ?? sampleOutput, warning };
  }
}

