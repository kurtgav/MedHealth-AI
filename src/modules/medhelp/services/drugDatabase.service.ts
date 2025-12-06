import { drugInteractionDatabase } from '../data/drugInteractions';
import { AIResponse, DrugInteraction, Medication, ValidationResult } from '../types';

const normalize = (name: string) => name.trim().toLowerCase();

function findInteraction(drugA: string, drugB: string, database: DrugInteraction[]) {
  const a = normalize(drugA);
  const b = normalize(drugB);
  return database.find(
    (entry) =>
      (normalize(entry.drug1) === a && normalize(entry.drug2) === b) ||
      (normalize(entry.drug1) === b && normalize(entry.drug2) === a)
  );
}

export function getKnownInteractions(): DrugInteraction[] {
  return drugInteractionDatabase;
}

export function validateInteractions(
  aiOutput: AIResponse,
  medications: Medication[],
  database: DrugInteraction[] = drugInteractionDatabase
): ValidationResult {
  const missedInteractions: DrugInteraction[] = [];
  const matchedInteractions: DrugInteraction[] = [];

  for (let i = 0; i < medications.length; i += 1) {
    for (let j = i + 1; j < medications.length; j += 1) {
      const first = medications[i];
      const second = medications[j];
      if (!first?.name || !second?.name) continue;
      const known = findInteraction(first.name, second.name, database);
      if (!known) continue;

      const aiFlagged = aiOutput.safetyAssessment.flaggedIssues.some((issue) => {
        const affected = issue.affectedDrugs.map(normalize);
        return affected.includes(normalize(first.name)) && affected.includes(normalize(second.name));
      });

      if (aiFlagged) {
        matchedInteractions.push(known);
      } else {
        missedInteractions.push(known);
      }
    }
  }

  return { missedInteractions, matchedInteractions };
}
