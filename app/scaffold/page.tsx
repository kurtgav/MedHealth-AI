"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import sampleHigh from "@/src/data/sample_patients/patient_high_risk.json";
import sampleOutput from "@/src/data/sample_outputs/output_high_risk_example.json";

type TreatmentRecommendation = {
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  indication?: string;
  monitoring?: string[];
  alternative_options?: string[];
  confidence: number;
};

type MedHealthOutput = {
  patient_id: string;
  timestamp: string;
  treatment_plan: { recommendations: TreatmentRecommendation[]; non_pharmacologic?: string[] };
  risk_level: "Low" | "Medium" | "High";
  flagged_issues: { type: string; description: string; severity: "Major" | "Moderate" | "Minor"; evidence: string }[];
  rationale: string;
  confidence_score: number;
  raw_model_output?: string;
};

const riskClass: Record<string, string> = {
  High: "bg-red-600",
  Medium: "bg-amber-500",
  Low: "bg-emerald-600",
};

function RiskBadge({ level }: { level: MedHealthOutput["risk_level"] }) {
  return (
    <div className={`px-4 py-2 rounded-2xl text-white font-semibold ${riskClass[level] || "bg-gray-500"}`}>
      {level}
    </div>
  );
}

export default function ScaffoldPage() {
  const [intake, setIntake] = useState(sampleHigh);
  const [result, setResult] = useState<MedHealthOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
      });
      const json = await resp.json();
      if (!resp.ok) {
        setError(json.error || "LLM error");
      } else {
        setResult(json.data as MedHealthOutput);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">MedHealth AI — Intake & Analysis (Scaffold)</h1>
          <p className="text-sm text-slate-600">
            Demo scaffold using the MedHealth schema, sample patient, and /api/llm validator.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Intake (sample)</h2>
              <button
                className="rounded px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                onClick={() => {
                  setIntake(sampleHigh);
                  setResult(null);
                }}
              >
                Reset sample
              </button>
            </div>
            <pre className="mt-2 max-h-[340px] overflow-auto rounded bg-slate-100 p-2 text-xs text-slate-800">
              {JSON.stringify(intake, null, 2)}
            </pre>
            <div className="mt-3 flex gap-2">
              <button
                className="rounded bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700 disabled:opacity-60"
                onClick={runAnalysis}
                disabled={loading}
              >
                {loading ? "Running..." : "Run analysis"}
              </button>
              <button
                className="rounded border px-4 py-2 text-slate-700 hover:bg-slate-50"
                onClick={() => setResult(sampleOutput as MedHealthOutput)}
              >
                Load sample output
              </button>
            </div>
            {error ? <div className="mt-3 text-sm text-red-600">Error: {error}</div> : null}
          </section>

          <section className="rounded-2xl bg-white p-4 shadow">
            <h2 className="font-semibold text-slate-900">Results</h2>
            {!result ? (
              <div className="mt-2 text-sm text-slate-500">No analysis yet. Run the LLM to see structured output.</div>
            ) : (
              <div className="mt-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Patient {result.patient_id}</h3>
                    <p className="text-xs text-slate-500">{result.timestamp}</p>
                  </div>
                  <RiskBadge level={result.risk_level} />
                </div>

                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <h4 className="font-medium text-slate-900">Top flags</h4>
                  <ul className="mt-2 space-y-2">
                    {result.flagged_issues.map((f, i) => (
                      <li
                        key={i}
                        className={`rounded border-l-4 p-2 text-sm ${
                          f.severity === "Major"
                            ? "border-red-500 bg-red-50"
                            : f.severity === "Moderate"
                              ? "border-amber-500 bg-amber-50"
                              : "border-emerald-400 bg-emerald-50"
                        }`}
                      >
                        <div className="font-semibold text-slate-900">
                          {f.type} — {f.severity}
                        </div>
                        <div className="text-slate-700">{f.description}</div>
                        <div className="text-xs text-slate-500 mt-1">Evidence: {f.evidence}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded border border-slate-200 bg-white p-3 shadow-sm">
                  <h4 className="font-medium text-slate-900">Treatment Plan</h4>
                  <div className="mt-2 space-y-3">
                    {result.treatment_plan.recommendations.map((r, i) => (
                      <div key={i} className="rounded border border-slate-200 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {r.medication} <span className="text-xs text-slate-500">{r.dose}</span>
                            </div>
                            {r.indication ? (
                              <div className="text-sm text-slate-600">{r.indication}</div>
                            ) : null}
                            <div className="text-xs text-slate-500">
                              {r.route} · {r.frequency} · {r.duration}
                            </div>
                          </div>
                          <div className="text-sm text-slate-700">Confidence: {r.confidence}%</div>
                        </div>
                        {r.monitoring?.length ? (
                          <div className="mt-2 text-xs text-slate-600">Monitoring: {r.monitoring.join(", ")}</div>
                        ) : null}
                        {r.alternative_options?.length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {r.alternative_options.map((alt) => (
                              <span key={alt} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                                {alt}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {result.treatment_plan.non_pharmacologic?.length ? (
                    <div className="mt-3 text-sm text-slate-700">
                      <span className="font-semibold">Non-pharmacologic: </span>
                      {result.treatment_plan.non_pharmacologic.join("; ")}
                    </div>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="rounded border px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="rounded bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </motion.button>
                </div>

                <details className="rounded bg-slate-50 p-3 text-sm">
                  <summary className="font-medium text-slate-900">Rationale & raw model output</summary>
                  <div className="mt-2 space-y-2">
                    <p className="text-slate-700">{result.rationale}</p>
                    {result.raw_model_output ? (
                      <pre className="rounded border border-slate-200 bg-white p-2 text-xs text-slate-800">
                        {result.raw_model_output}
                      </pre>
                    ) : null}
                  </div>
                </details>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-6 text-xs text-slate-500">
          Demo scaffold — replace API key and system prompt in <code>/app/api/llm/route.ts</code>
        </footer>
      </div>
    </div>
  );
}

