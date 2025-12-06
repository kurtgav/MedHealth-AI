"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";
import { analyzePlan } from "../services/aiClient";
import { useIntakeFlow } from "../hooks/useIntakeFlow";
import { PlanDashboard } from "./PlanDashboard";
import { IntakeForm } from "./IntakeForm";
import { AIResponse } from "../types";

const steps = ["Intake", "AI analysis", "Doctor review"];

const stats = [
  { label: "AI-powered interactions", value: "83M+", accent: "from-sky-500 to-cyan-400" },
  { label: "Client retention", value: "94%", accent: "from-emerald-500 to-lime-400" },
  { label: "Deployment speed", value: "80% faster", accent: "from-violet-500 to-indigo-400" },
  { label: "Admin cost reduction", value: "45%", accent: "from-amber-500 to-orange-400" },
];

const trustLogos = [
  "St. Luke's Medical Center",
  "Makati Medical Center",
  "The Medical City",
  "PhilHealth-aligned flows",
];

export function ClinicalAssistantPage() {
  const { intake, setIntake, loadSample, step, setStep } = useIntakeFlow();
  const [plan, setPlan] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzePlan({ intake });
      setPlan(result);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
          <div className="animate-[pulse_18s_ease-in-out_infinite] blur-[120px] bg-gradient-to-r from-sky-300/50 via-cyan-200/40 to-indigo-200/40 absolute -top-32 left-[-10%] h-80 w-80 rounded-full" />
          <div className="animate-[pulse_16s_ease-in-out_infinite] blur-[120px] bg-gradient-to-r from-emerald-200/40 via-teal-200/35 to-blue-200/35 absolute top-24 right-[-12%] h-96 w-96 rounded-full" />
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:py-16">
          <header className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Philippine-based agentic AI planner
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.25)]" />
              </motion.div>
              <motion.h1
                className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Build safety-checked treatment plans with a KeyReply-inspired experience.
              </motion.h1>
              <motion.p
                className="text-lg text-slate-600"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Intake → AI analysis → doctor review. Built for Philippine healthcare teams,
                with risk-first layout, JSON schema output, and an animated narrative tuned for
                desktops, laptops, and mobile phones.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Badge className="bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200">Drug interaction checks</Badge>
                <Badge className="bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">Contraindications surfaced</Badge>
                <Badge className="bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200">JSON schema output</Badge>
              </motion.div>
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                <Button size="lg" onClick={handleAnalyze} disabled={loading}>
                  {loading ? "Running AI safety check..." : "Generate plan now"}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    loadSample("high");
                    setStep(0);
                  }}
                >
                  Load high-risk demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    loadSample("low");
                    setStep(0);
                  }}
                >
                  Load lower-risk demo
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-cyan-200/50 to-blue-300/50 blur-2xl" />
              <div className="absolute -left-8 bottom-6 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-200/40 to-sky-300/40 blur-2xl" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">Mission Brief</p>
                  <Badge className="bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200">Clinical safety</Badge>
                </div>
                <p className="text-base leading-relaxed text-slate-700">
                  Encode safety rules, return structured JSON, flag interactions and contraindications
                  before any recommendation. Designed to keep clinicians in control.
                </p>
                <Separator className="bg-slate-200" />
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                  <div>
                    <p className="text-xs uppercase text-slate-500">Flow</p>
                    <p className="font-semibold">Intake → Analysis → Review</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">LLM</p>
                    <p className="font-semibold">Claude schema mode</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">Output</p>
                    <p className="font-semibold">Plan, risk, issues JSON</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">Safety</p>
                    <p className="font-semibold">Interactions + contraindications</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </header>

          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, idx) => (
              <motion.div
                key={item.label}
                className="space-y-2 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
              >
                <div
                  className={`inline-flex rounded-full bg-gradient-to-r ${item.accent} px-3 py-1 text-sm font-semibold text-white shadow`}
                >
                  {item.value}
                </div>
                <p className="text-sm text-slate-700">{item.label}</p>
              </motion.div>
            ))}
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-cyan-700">Trusted by teams</p>
              <Separator className="flex-1 bg-slate-200" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {trustLogos.map((logo) => (
                <motion.div
                  key={logo}
                  className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  {logo}
                </motion.div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            {steps.map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    idx <= step ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {idx + 1}
                </div>
                <p className={`font-semibold ${idx <= step ? "text-slate-900" : "text-slate-500"}`}>
                  {label}
                </p>
                {idx < steps.length - 1 ? (
                  <div className="mx-3 h-px w-10 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
                ) : null}
              </div>
            ))}
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => loadSample("high")}>
                Demo high-risk
              </Button>
              <Button size="sm" variant="outline" onClick={() => loadSample("low")}>
                Demo lower-risk
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <IntakeForm
              intake={intake}
              onChange={(next) => {
                setIntake(next);
                setStep(0);
              }}
              onAnalyze={handleAnalyze}
              loading={loading}
              onLoadSample={(variant) => {
                loadSample(variant);
                setStep(0);
              }}
            />
            <PlanDashboard plan={plan} intake={intake} loading={loading} error={error} />
          </div>

          <motion.section
            className="grid gap-6 lg:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-slate-200 bg-white text-slate-900 shadow-xl">
              <CardContent className="space-y-3 p-6">
                <Badge className="bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">Safety-first</Badge>
                <h3 className="text-xl font-semibold text-slate-900">Risk-first orchestration</h3>
                <p className="text-sm text-slate-700">
                  Interactions, contraindications, and dosing issues are surfaced before any medication
                  is promoted—mirroring best-in-class clinical AI UX patterns.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white text-slate-900 shadow-xl">
              <CardContent className="space-y-3 p-6">
                <Badge className="bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200">Structured</Badge>
                <h3 className="text-xl font-semibold text-slate-900">Schema-locked JSON</h3>
                <p className="text-sm text-slate-700">
                  System prompt enforces a JSON schema with risk scores, flagged issues, and alternatives—
                  ready for audit logging or downstream EHR drop-ins.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white text-slate-900 shadow-xl">
              <CardContent className="space-y-3 p-6">
                <Badge className="bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200">Agentic</Badge>
                <h3 className="text-xl font-semibold text-slate-900">Agentic guardrails</h3>
                <p className="text-sm text-slate-700">
                  Modeled after KeyReply’s agentic AI philosophy: proactive checks, human-in-the-loop
                  review, and multi-step guidance through intake → analysis → approval.
                </p>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

