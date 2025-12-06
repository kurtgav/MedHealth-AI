import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/src/modules/clinical-assistant/constants/prompt";
import { treatmentPlanSchema } from "@/src/modules/clinical-assistant/constants/schema";
import { AIRequestPayload } from "@/src/modules/clinical-assistant/types";
import { buildMockPlan } from "@/src/modules/clinical-assistant/services/mockPlan";

export async function POST(req: Request) {
  const body = (await req.json()) as AIRequestPayload;

  if (!body?.intake) {
    return NextResponse.json({ error: "Missing intake payload" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    // Fall back to mock structured output when no key is present.
    return NextResponse.json(buildMockPlan(body.intake));
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Patient intake JSON (keep concise but thorough):\n${JSON.stringify(
                body.intake,
                null,
                2
              )}`,
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "TreatmentPlan",
          schema: treatmentPlanSchema,
        },
      },
    });

    const content = message.content[0];
    const text = content.type === "text" ? content.text : "";
    let parsed: unknown = null;

    try {
      parsed = text ? JSON.parse(text) : null;
    } catch (parseError) {
      console.error("Failed to parse model JSON", parseError, text);
    }

    if (!parsed) {
      return NextResponse.json(buildMockPlan(body.intake));
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Anthropic error", error);
    return NextResponse.json(buildMockPlan(body.intake));
  }
}

