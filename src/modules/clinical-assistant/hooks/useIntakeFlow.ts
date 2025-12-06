import { useMemo, useState } from "react";
import { highRiskSample, lowerRiskSample } from "../constants/samples";
import { PatientIntake } from "../types";

const blankIntake: PatientIntake = {
  name: "",
  sex: "male",
  complaint: "",
  conditions: [],
  allergies: [],
  medications: [
    { name: "", dosage: "", frequency: "", route: "", indication: "" },
  ],
  lifestyle: {
    smokingStatus: "never",
    alcoholUse: "none",
    exerciseFrequency: "moderate",
  },
  metrics: {
    age: 40,
    weightKg: 70,
    heightCm: 170,
    bmi: 24,
    bloodPressure: "120/80",
  },
  notes: "",
};

type IntakeFlowHook = {
  intake: PatientIntake;
  setIntake: (next: PatientIntake) => void;
  loadSample: (variant: "high" | "low") => void;
  step: number;
  setStep: (step: number) => void;
};

export function useIntakeFlow(): IntakeFlowHook {
  const [intake, setIntake] = useState<PatientIntake>(blankIntake);
  const [step, setStep] = useState(0);

  const loadSample = (variant: "high" | "low") => {
    setIntake(variant === "high" ? highRiskSample : lowerRiskSample);
  };

  return useMemo(
    () => ({
      intake,
      setIntake,
      loadSample,
      step,
      setStep,
    }),
    [intake, step]
  );
}

