'use client';

import { useMemo, useState } from 'react';

export function useStepController(totalSteps: number) {
  const [step, setStep] = useState(0);

  const progress = useMemo(() => {
    if (totalSteps <= 1) return 100;
    return Math.round(((step + 1) / totalSteps) * 100);
  }, [step, totalSteps]);

  const next = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  return { step, setStep, progress, next, back };
}
