import { AIResponse, PatientIntake } from "../types";

export const buildMockPlan = (intake: PatientIntake): AIResponse => {
  const primaryIssue =
    intake.medications.find((med) =>
      med.name.toLowerCase().includes("nitroglycerin")
    ) && intake.complaint.toLowerCase().includes("erectile");

  if (primaryIssue) {
    return {
      riskScore: "high",
      summary:
        "Avoid PDE5 inhibitors due to nitrate use; optimize cardiac workup and consider safer options.",
      issues: [
        {
          type: "interaction",
          severity: "high",
          message:
            "PDE5 inhibitors (e.g., sildenafil) are contraindicated with nitrates like nitroglycerin",
          detail: "Risk of profound hypotension and syncope.",
        },
        {
          type: "dosage",
          severity: "medium",
          message: "Blood pressure elevated; optimize HTN management before ED meds",
          detail: "Recent BP 146/92 with CAD history.",
        },
      ],
      recommendations: [
        {
          medication: "Cardiology referral",
          dosage: "Schedule stress testing",
          frequency: "ASAP",
          duration: "Within 2 weeks",
          rationale:
            "Evaluate ischemia before addressing ED; aligns with ACC/AHA guidance for chest discomfort.",
          riskLevel: "medium",
          confidence: 0.74,
          alternatives: ["If stable, consider supervised PDE5 trial after clearance"],
        },
        {
          medication: "Tadalafil",
          dosage: "5 mg",
          frequency: "Once daily",
          duration: "14 days trial post-clearance",
          rationale:
            "Only if cardiology clears; lowest dose with monitoring to reduce hypotension risk.",
          riskLevel: "high",
          confidence: 0.42,
          alternatives: [
            "Vacuum erection device",
            "Counseling and lifestyle optimization",
          ],
        },
      ],
      alternatives: [
        "Vacuum erection device as non-pharmacologic option",
        "Address cardiovascular risk factors first (BP, lipids, exercise)",
      ],
      rawModelText:
        "Mock response used because no API key was detected. Replace with live LLM for production.",
    };
  }

  return {
    riskScore: "low",
    summary:
      "Topical minoxidil appropriate; monitor thyroid control and shed education provided.",
    issues: [
      {
        type: "dosage",
        severity: "low",
        message: "Ensure stable TSH on levothyroxine before attributing hair loss",
        detail: "TSH recheck recommended in 6-8 weeks.",
      },
    ],
    recommendations: [
      {
        medication: "Topical minoxidil 5%",
        dosage: "1 mL",
        frequency: "Twice daily",
        duration: "3-6 months",
        rationale: "First-line for androgenic alopecia with good safety profile.",
        riskLevel: "low",
        confidence: 0.83,
        alternatives: ["Low-level laser therapy", "Oral minoxidil microdose"],
      },
    ],
    alternatives: [
      "If inadequate response, consider oral minoxidil 0.625-1.25 mg daily with BP monitoring",
    ],
    rawModelText:
      "Mock response used because no API key was detected. Replace with live LLM for production.",
  };
};

