export const treatmentPlanSchema = {
  type: "object",
  properties: {
    riskScore: { type: "string", enum: ["low", "medium", "high"] },
    summary: { type: "string" },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["interaction", "contraindication", "dosage", "allergy", "other"],
          },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          message: { type: "string" },
          detail: { type: "string" },
        },
        required: ["type", "severity", "message"],
      },
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          medication: { type: "string" },
          dosage: { type: "string" },
          frequency: { type: "string" },
          duration: { type: "string" },
          rationale: { type: "string" },
          riskLevel: { type: "string", enum: ["low", "medium", "high"] },
          confidence: { type: "number" },
          alternatives: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "medication",
          "dosage",
          "frequency",
          "rationale",
          "riskLevel",
          "confidence",
        ],
      },
    },
    alternatives: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["riskScore", "summary", "issues", "recommendations"],
};

