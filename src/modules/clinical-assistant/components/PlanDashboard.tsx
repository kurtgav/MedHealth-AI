import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { riskToColor, riskToLabel } from "../utils/risk";
import { AIResponse, PatientIntake, TreatmentRecommendation } from "../types";

type PlanDashboardProps = {
  plan: AIResponse | null;
  intake: PatientIntake;
  loading?: boolean;
  error?: string | null;
};

const riskScoreToPercent = (risk: "low" | "medium" | "high") => {
  if (risk === "low") return 28;
  if (risk === "medium") return 62;
  return 92;
};

const IssueList = ({ plan }: { plan: AIResponse | null }) => {
  if (!plan || plan.issues.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
        No flagged contraindications or interactions yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {plan.issues.map((issue, idx) => (
        <div
          key={`${issue.message}-${idx}`}
          className="rounded-lg border border-slate-200 bg-white/70 p-3"
        >
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-white",
                issue.severity === "high" && "bg-rose-600",
                issue.severity === "medium" && "bg-amber-600",
                issue.severity === "low" && "bg-emerald-600"
              )}
            >
              {issue.type} · {issue.severity}
            </Badge>
            <p className="text-sm font-semibold text-slate-800">{issue.message}</p>
          </div>
          {issue.detail ? (
            <p className="mt-1 text-sm text-slate-600">{issue.detail}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
};

const RecommendationCard = ({
  rec,
  index,
}: {
  rec: TreatmentRecommendation;
  index: number;
}) => (
  <Card className="border-0 bg-white/80 shadow-sm ring-1 ring-slate-200">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center justify-between text-base">
        <span className="font-semibold text-slate-900">
          {index + 1}. {rec.medication}
        </span>
        <Badge
          className={cn(
            "text-white",
            rec.riskLevel === "low" && "bg-emerald-600",
            rec.riskLevel === "medium" && "bg-amber-600",
            rec.riskLevel === "high" && "bg-rose-600"
          )}
        >
          {rec.riskLevel} risk
        </Badge>
      </CardTitle>
      <p className="text-sm text-slate-600">{rec.rationale}</p>
    </CardHeader>
    <CardContent className="grid gap-3 md:grid-cols-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Dosage</p>
        <p className="font-medium text-slate-900">{rec.dosage}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Frequency</p>
        <p className="font-medium text-slate-900">{rec.frequency}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Confidence</p>
        <p className="font-medium text-slate-900">
          {(rec.confidence * 100).toFixed(0)}%
        </p>
      </div>
      {rec.alternatives?.length ? (
        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Alternatives
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {rec.alternatives.map((alt) => (
              <Badge key={alt} variant="secondary">
                {alt}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </CardContent>
  </Card>
);

export function PlanDashboard({ plan, intake, loading, error }: PlanDashboardProps) {
  if (error) {
    return (
      <Card className="border-0 bg-rose-50 shadow-lg ring-1 ring-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-800">We hit an issue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-rose-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500 text-white">Doctor view</Badge>
            <p className="text-sm text-slate-200">
              Shows the AI plan, safety risk score, and flagged issues first.
            </p>
          </div>
          <CardTitle className="text-2xl font-semibold">
            AI-powered treatment plan for {intake.name || "patient"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800/60 p-4 ring-1 ring-white/10">
            <p className="text-sm text-slate-300">Risk level</p>
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md",
                plan
                  ? `bg-gradient-to-r ${riskToColor[plan.riskScore]}`
                  : "bg-slate-700"
              )}
            >
              {plan ? riskToLabel[plan.riskScore] : "Pending"}
            </div>
            <Progress
              value={plan ? riskScoreToPercent(plan.riskScore) : 10}
              className="mt-3 h-2 bg-slate-700"
            />
            <p className="mt-2 text-xs text-slate-300">
              Safety-first: interactions, contraindications, and dose concerns are
              surfaced before meds.
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-4 ring-1 ring-white/10 md:col-span-2">
            <p className="text-sm text-slate-300">Summary</p>
            <p className="mt-2 text-base font-semibold leading-relaxed text-white">
              {plan
                ? plan.summary
                : "Run the AI analysis to see a structured treatment plan with risks flagged."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
              <Badge variant="secondary" className="bg-white/10 text-slate-100">
                Intake → AI analysis → Doctor review
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-slate-100">
                JSON schema validated
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-slate-100">
                Risk-first ordering
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white shadow-xl ring-1 ring-slate-200">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500 text-white">Flagged issues</Badge>
            <p className="text-sm text-slate-600">
              Contraindications, interactions, and dosing risks are listed first.
            </p>
          </div>
          <CardTitle className="text-xl text-slate-900">
            Safety checks for {intake.complaint || "primary complaint"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-600">Running safety checks...</p>
          ) : (
            <IssueList plan={plan} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-0 bg-white shadow-xl ring-1 ring-slate-200 lg:col-span-2">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white">Recommended plan</Badge>
              <p className="text-sm text-slate-600">
                Dosing, frequency, and rationale—plus alternatives when risk is present.
              </p>
            </div>
            <CardTitle className="text-xl text-slate-900">Treatment plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan?.recommendations?.length ? (
              plan.recommendations.map((rec, idx) => (
                <RecommendationCard key={rec.medication + idx} rec={rec} index={idx} />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No recommendations yet. Run the analysis to populate the plan.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-slate-50 shadow-xl ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Structured output</CardTitle>
            <p className="text-sm text-slate-600">
              JSON schema-aligned payload ready for audit logging or EHR drop-in.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-slate-900 text-xs text-slate-100 shadow-inner">
              <pre className="overflow-x-auto p-4">
                {plan
                  ? JSON.stringify(plan, null, 2)
                  : '{ "riskScore": "...", "issues": [], "recommendations": [] }'}
              </pre>
            </div>
            {plan?.alternatives?.length ? (
              <div className="space-y-2">
                <Separator />
                <p className="text-sm font-semibold text-slate-900">Alternatives</p>
                <div className="flex flex-wrap gap-2">
                  {plan.alternatives.map((alt) => (
                    <Badge key={alt} variant="outline">
                      {alt}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

