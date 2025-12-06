import { jsPDF } from "jspdf";

import { TreatmentPlanBundle } from "../types";
import { IntakePatient } from "../types/medhealth";

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth = 180, lineHeight = 8) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach((line, idx) => doc.text(line, x, y + idx * lineHeight));
  return y + lines.length * lineHeight;
}

export async function exportPlanToPdf(plan: TreatmentPlanBundle, patient: IntakePatient) {
  const doc = new jsPDF();
  let y = 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("MedHealth AI - Treatment Plan", 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  y = addWrappedText(
    doc,
    `Patient: ${patient.name || "Unknown"} | Age: ${patient.age ?? "-"} | Sex: ${patient.sex ?? "-"} | BP: ${
      patient.blood_pressure ?? "-"
    }`,
    14,
    y,
  );
  y = addWrappedText(doc, `Primary complaint: ${patient.primary_complaint ?? "Not provided"}`, 14, y + 2);
  y = addWrappedText(
    doc,
    `Risk: ${plan.safetyAssessment.riskLevel.toUpperCase()} | Score: ${plan.safetyAssessment.overallRiskScore}`,
    14,
    y + 2,
  );

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Flagged Issues", 14, y);
  doc.setFont("helvetica", "normal");
  y += 6;
  plan.safetyAssessment.flaggedIssues.slice(0, 8).forEach((issue) => {
    y = addWrappedText(
      doc,
      `- [${issue.severity.toUpperCase()}] ${issue.type}: ${issue.description}${
        issue.recommendation ? ` (Rec: ${issue.recommendation})` : ""
      }`,
      14,
      y,
    );
  });

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Medications", 14, y);
  doc.setFont("helvetica", "normal");
  y += 6;
  plan.treatmentPlan.recommendedMedications.slice(0, 8).forEach((med) => {
    y = addWrappedText(
      doc,
      `- ${med.drugName} (${med.genericName ?? med.drugName}) ${med.dosage} | ${med.frequency} | ${med.route} | ${
        med.duration
      } | Indication: ${med.indication}`,
      14,
      y,
    );
  });

  if (plan.treatmentPlan.nonPharmacological.length) {
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Non-pharmacological", 14, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    plan.treatmentPlan.nonPharmacological.slice(0, 6).forEach((item) => {
      y = addWrappedText(doc, `- ${item.intervention}: ${item.description} (${item.frequency})`, 14, y);
    });
  }

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Follow-up", 14, y);
  doc.setFont("helvetica", "normal");
  y = addWrappedText(
    doc,
    `Timeframe: ${plan.treatmentPlan.followUp.timeframe}. Tests: ${plan.treatmentPlan.followUp.tests.join(
      "; ",
    )}. Monitoring: ${plan.treatmentPlan.followUp.monitoring.join("; ")}`,
    14,
    y + 6,
  );

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Rationale", 14, y);
  doc.setFont("helvetica", "normal");
  y = addWrappedText(doc, plan.rationale.primaryRecommendation, 14, y + 6);

  doc.save(`medhealth-plan-${patient.id || "patient"}.pdf`);
}
