import { useCallback, useMemo, useState } from "react";

import samplePatient from "@/src/data/sample_patients/patient_high_risk.json";
import sampleOutput from "@/src/data/sample_outputs/output_high_risk_example.json";

import { transformMedHealthOutput } from "../utils/transform";
import { IntakePatient, MedHealthOutput } from "../types/medhealth";
import { TreatmentPlanBundle } from "../types";

type AuditEntry = {
  timestamp: string;
  action: "analysis_started" | "analysis_succeeded" | "analysis_failed" | "issue_overridden" | "issue_accepted";
  patientId: string;
  detail?: string;
};

type PlannerState = {
  patient: IntakePatient;
  setPatient: (next: IntakePatient) => void;
  updatePatient: (partial: Partial<IntakePatient>) => void;
  plan: TreatmentPlanBundle | null;
  loading: boolean;
  error: string | null;
  validationError: string | null;
  circuitOpenUntil: number | null;
  runAnalysis: () => Promise<void>;
  loadSample: () => void;
  auditLog: AuditEntry[];
  recordAudit: (entry: Omit<AuditEntry, "timestamp" | "patientId"> & { detail?: string }) => void;
};

export function usePlannerState(): PlannerState {
  const [patient, setPatient] = useState<IntakePatient>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("medhealth-intake");
      if (stored) {
        try {
          return JSON.parse(stored) as IntakePatient;
        } catch {
          // fall through
        }
      }
    }
    return samplePatient as IntakePatient;
  });

  const [plan, setPlan] = useState<TreatmentPlanBundle | null>(() => {
    try {
      return transformMedHealthOutput(sampleOutput as MedHealthOutput);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [, setFailureCount] = useState(0);
  const [circuitOpenUntil, setCircuitOpenUntil] = useState<number | null>(null);

  const updatePatient = useCallback((partial: Partial<IntakePatient>) => {
    setPatient((prev) => ({ ...prev, ...partial }));
  }, []);

  const loadSample = useCallback(() => {
    setPatient(samplePatient as IntakePatient);
    setPlan(transformMedHealthOutput(sampleOutput as MedHealthOutput));
    setError(null);
    setValidationError(null);
  }, []);

  const recordAudit: PlannerState["recordAudit"] = useCallback(
    (entry) => {
      setAuditLog((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          patientId: patient.id,
          ...entry,
        },
      ]);
    },
    [patient.id],
  );

  const validatePatient = useCallback((payload: IntakePatient) => {
    if (!payload.name || !payload.sex || !payload.age) {
      return "Name, sex, and age are required.";
    }
    if (!payload.primary_complaint) {
      return "Primary complaint is required.";
    }
    if (!payload.current_medications?.length) {
      return "At least one current medication is required to check interactions.";
    }
    return null;
  }, []);

  const fetchWithRetry = useCallback(
    async (payload: IntakePatient, retries = 2, delay = 600) => {
      let lastError: unknown;
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const resp = await fetch("/api/llm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = await resp.json();
          if (!resp.ok) {
            throw new Error(json.error || "LLM error");
          }
          return json;
        } catch (err) {
          lastError = err;
          if (attempt < retries) {
            const backoff = delay * Math.pow(2, attempt);
            await new Promise((res) => setTimeout(res, backoff));
            continue;
          }
        }
      }
      throw lastError ?? new Error("Unknown LLM error");
    },
    [],
  );

  const runAnalysis = useCallback(async () => {
    const now = Date.now();
    if (circuitOpenUntil && now < circuitOpenUntil) {
      setError("LLM temporarily paused due to repeated failures. Please retry shortly.");
      return;
    }

    setLoading(true);
    setError(null);
    setValidationError(null);
    recordAudit({ action: "analysis_started" });
    try {
      const validationMsg = validatePatient(patient);
      if (validationMsg) {
        setValidationError(validationMsg);
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("medhealth-intake", JSON.stringify(patient));
      }

      const json = await fetchWithRetry(patient);
      const payload = (json.data ?? json) as MedHealthOutput;
      const normalized = transformMedHealthOutput(payload);
      setPlan(normalized);
      setFailureCount(0);
      setCircuitOpenUntil(null);
      recordAudit({ action: "analysis_succeeded", detail: `source=${json.source ?? "api"}` });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const isValidation = message.toLowerCase().includes("invalid llm output");
      if (isValidation) {
        setValidationError(message);
      } else {
        setError(message);
      }

      setFailureCount((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          setCircuitOpenUntil(Date.now() + 30_000);
        }
        return next;
      });

      recordAudit({ action: "analysis_failed", detail: message });
      // Graceful fallback to sample output so UI remains usable
      try {
        setPlan(transformMedHealthOutput(sampleOutput as MedHealthOutput));
      } catch {
        // ignore if fallback fails
      }
    } finally {
      setLoading(false);
    }
  }, [patient, fetchWithRetry, recordAudit, validatePatient, circuitOpenUntil]);

  return useMemo(
    () => ({
      patient,
      setPatient,
      updatePatient,
      plan,
      loading,
      error,
      validationError,
      circuitOpenUntil,
      runAnalysis,
      loadSample,
      auditLog,
      recordAudit,
    }),
    [
      patient,
      plan,
      loading,
      error,
      validationError,
      circuitOpenUntil,
      runAnalysis,
      loadSample,
      auditLog,
      recordAudit,
      updatePatient,
    ],
  );
}
