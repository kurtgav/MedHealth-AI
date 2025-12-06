import { DrugInteraction } from '../types';

export const drugInteractionDatabase: DrugInteraction[] = [
  {
    drug1: 'Warfarin',
    drug2: 'Ibuprofen',
    severity: 'major',
    description: 'NSAIDs can increase bleeding risk when combined with warfarin.',
    mechanism: 'Combined antiplatelet effect and GI mucosal injury leading to bleeding.',
    clinicalEffects: ['Major bleeding', 'Elevated INR', 'GI hemorrhage'],
    management: 'Avoid combo; prefer acetaminophen; if necessary, monitor INR closely and limit NSAID duration.',
  },
  {
    drug1: 'Warfarin',
    drug2: 'Naproxen',
    severity: 'major',
    description: 'NSAIDs elevate bleeding risk in patients on warfarin.',
    mechanism: 'Synergistic anticoagulation and platelet inhibition.',
    clinicalEffects: ['Bleeding', 'Bruising', 'Elevated INR'],
    management: 'Avoid if possible; monitor INR; consider gastroprotection.',
  },
  {
    drug1: 'Propranolol',
    drug2: 'Albuterol',
    severity: 'moderate',
    description: 'Non-selective beta-blockers may blunt bronchodilator response.',
    mechanism: 'Beta-2 receptor blockade in airways.',
    clinicalEffects: ['Reduced albuterol effect', 'Bronchospasm risk'],
    management: 'Prefer cardioselective beta-blocker or alternate class in asthma/COPD.',
  },
  {
    drug1: 'Sertraline',
    drug2: 'Ibuprofen',
    severity: 'moderate',
    description: 'SSRIs with NSAIDs raise GI bleed risk.',
    mechanism: 'Platelet serotonin depletion plus NSAID gastric injury.',
    clinicalEffects: ['GI bleeding', 'Easy bruising'],
    management: 'Consider PPI prophylaxis, monitor for bleeding, limit NSAID duration.',
  },
];
