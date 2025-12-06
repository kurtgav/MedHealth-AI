import { AIRequestPayload, AIResponse } from "../types";
import { buildMockPlan } from "./mockPlan";

const API_ROUTE = "/api/clinical-assistant/analyze";

export async function analyzePlan(payload: AIRequestPayload): Promise<AIResponse> {
  try {
    const res = await fetch(API_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    const data = (await res.json()) as AIResponse;
    return data;
  } catch (error) {
    console.warn("AI request failed, using mock response", error);
    return buildMockPlan(payload.intake);
  }
}

