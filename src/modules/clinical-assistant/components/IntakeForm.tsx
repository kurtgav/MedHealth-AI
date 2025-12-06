import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PatientIntake } from "../types";

type IntakeFormProps = {
  intake: PatientIntake;
  onChange: (next: PatientIntake) => void;
  onAnalyze: () => void;
  loading?: boolean;
  onLoadSample: (variant: "high" | "low") => void;
};

const lifestyleOptions = {
  smokingStatus: [
    { label: "Never", value: "never" },
    { label: "Former", value: "former" },
    { label: "Current", value: "current" },
  ],
  alcoholUse: [
    { label: "None", value: "none" },
    { label: "Social", value: "social" },
    { label: "Regular", value: "regular" },
  ],
  exerciseFrequency: [
    { label: "None", value: "none" },
    { label: "Light", value: "light" },
    { label: "Moderate", value: "moderate" },
    { label: "Intense", value: "intense" },
  ],
};

export function IntakeForm({
  intake,
  onChange,
  onAnalyze,
  loading,
  onLoadSample,
}: IntakeFormProps) {
  const updateMed = (
    index: number,
    field: "name" | "dosage" | "frequency" | "route" | "indication",
    value: string
  ) => {
    const next = { ...intake };
    next.medications = next.medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    onChange(next);
  };

  const addMedicationRow = () => {
    onChange({
      ...intake,
      medications: [
        ...intake.medications,
        { name: "", dosage: "", frequency: "", route: "", indication: "" },
      ],
    });
  };

  const removeMedicationRow = (index: number) => {
    const next = intake.medications.filter((_, i) => i !== index);
    onChange({ ...intake, medications: next.length ? next : [{ name: "", dosage: "", frequency: "", route: "", indication: "" }] });
  };

  const updateArrayField = (key: "conditions" | "allergies", value: string) => {
    const cleaned = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    onChange({ ...intake, [key]: cleaned });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-white/90 to-sky-50/70 shadow-xl ring-1 ring-slate-200">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Badge className="bg-sky-600 text-white">Intake</Badge>
          <CardTitle className="text-2xl font-semibold text-slate-900">
            Patient intake & safety checks
          </CardTitle>
        </div>
        <p className="text-sm text-slate-600">
          Capture the essentials quickly. You can also load a demo patient to see
          the safety engine flag risks.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onLoadSample("high")}
          >
            Load high-risk demo
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onLoadSample("low")}
          >
            Load lower-risk demo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Patient name</Label>
            <Input
              id="name"
              value={intake.name}
              placeholder="Jordan Miller"
              onChange={(e) => onChange({ ...intake, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Input
              id="sex"
              value={intake.sex}
              placeholder="male / female / other"
              onChange={(e) =>
                onChange({
                  ...intake,
                  sex: e.target.value as PatientIntake["sex"],
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={intake.metrics.age}
              onChange={(e) =>
                onChange({
                  ...intake,
                  metrics: { ...intake.metrics, age: Number(e.target.value) },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bp">Blood pressure</Label>
            <Input
              id="bp"
              value={intake.metrics.bloodPressure}
              placeholder="120/80"
              onChange={(e) =>
                onChange({
                  ...intake,
                  metrics: {
                    ...intake.metrics,
                    bloodPressure: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={intake.metrics.weightKg}
              onChange={(e) =>
                onChange({
                  ...intake,
                  metrics: { ...intake.metrics, weightKg: Number(e.target.value) },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bmi">BMI</Label>
            <Input
              id="bmi"
              type="number"
              value={intake.metrics.bmi ?? ""}
              placeholder="28.4"
              onChange={(e) =>
                onChange({
                  ...intake,
                  metrics: { ...intake.metrics, bmi: Number(e.target.value) },
                })
              }
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Medical history (comma separated)</Label>
            <Textarea
              value={intake.conditions.join(", ")}
              placeholder="Hypertension, CAD, hyperlipidemia"
              onChange={(e) => updateArrayField("conditions", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Allergies (comma separated)</Label>
            <Textarea
              value={intake.allergies.join(", ")}
              placeholder="Penicillin, Sulfa"
              onChange={(e) => updateArrayField("allergies", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Current medications</Label>
              <p className="text-sm text-slate-500">
                Include name, dose, frequency, and indication.
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addMedicationRow}>
              Add medication
            </Button>
          </div>
          <div className="space-y-3">
            {intake.medications.map((med, index) => (
              <Card key={index} className="border-dashed">
                <CardContent className="grid gap-3 pt-4 md:grid-cols-5">
                  <Input
                    placeholder="Name"
                    value={med.name}
                    onChange={(e) => updateMed(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => updateMed(index, "dosage", e.target.value)}
                  />
                  <Input
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) => updateMed(index, "frequency", e.target.value)}
                  />
                  <Input
                    placeholder="Route"
                    value={med.route ?? ""}
                    onChange={(e) => updateMed(index, "route", e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Indication"
                      value={med.indication ?? ""}
                      onChange={(e) => updateMed(index, "indication", e.target.value)}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeMedicationRow(index)}
                      aria-label="Remove medication"
                    >
                      ×
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Smoking</Label>
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              value={intake.lifestyle.smokingStatus}
              onChange={(e) =>
                onChange({
                  ...intake,
                  lifestyle: {
                    ...intake.lifestyle,
                    smokingStatus: e.target.value as PatientIntake["lifestyle"]["smokingStatus"],
                  },
                })
              }
            >
              {lifestyleOptions.smokingStatus.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Alcohol</Label>
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              value={intake.lifestyle.alcoholUse}
              onChange={(e) =>
                onChange({
                  ...intake,
                  lifestyle: {
                    ...intake.lifestyle,
                    alcoholUse: e.target.value as PatientIntake["lifestyle"]["alcoholUse"],
                  },
                })
              }
            >
              {lifestyleOptions.alcoholUse.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Exercise</Label>
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              value={intake.lifestyle.exerciseFrequency}
              onChange={(e) =>
                onChange({
                  ...intake,
                  lifestyle: {
                    ...intake.lifestyle,
                    exerciseFrequency: e.target.value as PatientIntake["lifestyle"]["exerciseFrequency"],
                  },
                })
              }
            >
              {lifestyleOptions.exerciseFrequency.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Primary complaint</Label>
          <Textarea
            value={intake.complaint}
            placeholder="Chest discomfort; requesting erectile dysfunction meds"
            onChange={(e) => onChange({ ...intake, complaint: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Clinical notes (optional)</Label>
          <Textarea
            value={intake.notes ?? ""}
            placeholder="Recent stress test pending, mild exertional chest pain..."
            onChange={(e) => onChange({ ...intake, notes: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button size="lg" onClick={onAnalyze} disabled={loading}>
            {loading ? "Running AI safety check..." : "Generate treatment plan"}
          </Button>
          <p className="text-xs text-slate-500">
            We use a structured JSON schema and medical safety rules to flag risks before
            recommendations are shown.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

