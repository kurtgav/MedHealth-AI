'use client';

import { useMemo } from 'react';
import { useFormContext, UseFieldArrayReturn, useWatch } from 'react-hook-form';
import { AlertTriangle, Plus, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { medicationFrequencies } from '../../constants/medicalOptions';
import { PatientIntakeForm } from '../../constants/intakeSchema';

interface MedicationsStepProps {
  medicationsArray: UseFieldArrayReturn<PatientIntakeForm, 'medications'>;
}

export function MedicationsStep({ medicationsArray }: MedicationsStepProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PatientIntakeForm>();

  const medications = useWatch({ control, name: 'medications', defaultValue: [] });
  const historyConditions = useWatch({ control, name: 'history.conditions', defaultValue: [] });

  const warnings = useMemo(() => {
    const names = medications.map((m) => m.name.toLowerCase());
    const hasWarfarin = names.some((n) => n.includes('warfarin'));
    const hasNSAID = names.some((n) => ['ibuprofen', 'naproxen', 'diclofenac'].some((drug) => n.includes(drug)));
    const hasBetaBlocker = names.some((n) => ['lol'].some((suffix) => n.endsWith(suffix)));
    const hasAsthma = historyConditions.some((c) => c.toLowerCase().includes('asthma'));

    const list: string[] = [];
    if (hasWarfarin && hasNSAID) {
      list.push('Potential CRITICAL: NSAIDs + Warfarin may increase bleeding risk. Consider acetaminophen and monitor INR.');
    }
    if (hasBetaBlocker && hasAsthma) {
      list.push('HIGH: Beta-blockers can trigger bronchospasm in asthma. Consider cardioselective alternatives.');
    }
    return list;
  }, [medications, historyConditions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-200">Add each medication with dosage, frequency, and duration.</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-cyan-200"
          onClick={() => medicationsArray.append({ name: '', dosage: '', frequency: '', duration: '' })}
        >
          <Plus className="h-4 w-4" />
          Add medication
        </Button>
      </div>

      <div className="space-y-4">
        {medicationsArray.fields.map((field, index) => (
          <div key={field.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Drug name</Label>
                <Input placeholder="e.g., Warfarin" {...register(`medications.${index}.name` as const)} />
                {errors.medications?.[index]?.name ? (
                  <p className="text-xs text-red-400">{errors.medications[index]?.name?.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Input placeholder="5mg" {...register(`medications.${index}.dosage` as const)} />
                {errors.medications?.[index]?.dosage ? (
                  <p className="text-xs text-red-400">{errors.medications[index]?.dosage?.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Input list="frequency-options" placeholder="once daily" {...register(`medications.${index}.frequency` as const)} />
                {errors.medications?.[index]?.frequency ? (
                  <p className="text-xs text-red-400">{errors.medications[index]?.frequency?.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input placeholder="6 months" {...register(`medications.${index}.duration` as const)} />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              {medicationsArray.fields.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-red-300"
                  onClick={() => medicationsArray.remove(index)}
                  aria-label="Remove medication"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <datalist id="frequency-options">
        {medicationFrequencies.map((freq) => (
          <option key={freq} value={freq} />
        ))}
      </datalist>

      {warnings.length ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-100">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Real-time safety hints
          </div>
          <ul className="space-y-1 text-sm">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
