import OpenAI from 'openai';
import { NextResponse } from 'next/server';

import { medhelpSystemPrompt } from '@/src/modules/medhelp/constants/prompt';
import { AIAnalysisRequest, AIResponse } from '@/src/modules/medhelp/types';

const model = 'gpt-4.1';

export async function POST(req: Request) {
  const body = (await req.json()) as AIAnalysisRequest;

  if (!body?.patientData) {
    return NextResponse.json({ error: 'Missing patientData payload' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not set' }, { status: 500 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: medhelpSystemPrompt },
        { role: 'user', content: JSON.stringify(body) },
      ],
    });

    const messageContent = completion.choices[0]?.message?.content;
    if (!messageContent) {
      return NextResponse.json({ error: 'Empty model response' }, { status: 502 });
    }

    const parsed = JSON.parse(messageContent) as AIResponse;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('OpenAI analysis failed', error);
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
