export const commonConditions = [
  'Hypertension',
  'Diabetes',
  'Atrial Fibrillation',
  'Heart Disease',
  'Asthma',
  'COPD',
  'Chronic Kidney Disease',
  'Depression',
  'Anxiety',
  'Osteoarthritis',
  'Hyperlipidemia',
];

export const commonAllergies = [
  'Penicillin',
  'Sulfa drugs',
  'NSAIDs',
  'Peanuts',
  'Shellfish',
  'Latex',
];

export const medicationFrequencies = [
  'once daily',
  'twice daily',
  'three times daily',
  'weekly',
  'as needed',
];

export const lifestyleOptions = {
  smoking: ['never', 'former', 'current'] as const,
  exerciseIntensity: ['low', 'moderate', 'high'] as const,
  dietTypes: ['Mediterranean', 'DASH', 'Low-carb', 'Plant-forward', 'Other'],
};
