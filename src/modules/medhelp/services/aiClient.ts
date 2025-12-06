import { AIAnalysisRequest, AIResponse } from '../types';

const API_ROUTE = '/api/medhelp/analyze';

export async function analyzePatient(payload: AIAnalysisRequest): Promise<AIResponse> {
  const res = await fetch(API_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI request failed: ${res.status} ${text}`);
  }

  return (await res.json()) as AIResponse;
}
