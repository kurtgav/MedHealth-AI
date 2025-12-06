'use client';

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { commonAllergies, commonConditions } from '../../constants/medicalOptions';
import { PatientIntakeForm } from '../../constants/intakeSchema';

function CommaInput({
  label,
  value,
  onChange,
  placeholder,
  suggestions,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const tokens = event.target.value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      onChange(tokens);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        list={suggestions ? `${label}-options` : undefined}
        defaultValue={value.join(', ')}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {suggestions ? (
        <datalist id={`${label}-options`}>
          {suggestions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
      <p className="text-xs text-slate-400">Comma-separated; pick from suggestions or add your own.</p>
    </div>
  );
}

export function MedicalHistoryStep() {
  const { watch, setValue } = useFormContext<PatientIntakeForm>();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CommaInput
        label="Conditions"
        value={watch('history.conditions') || []}
        onChange={(next) => setValue('history.conditions', next, { shouldDirty: true })}
        placeholder="Diabetes, Hypertension..."
        suggestions={commonConditions}
      />
      <CommaInput
        label="Allergies"
        value={watch('history.allergies') || []}
        onChange={(next) => setValue('history.allergies', next, { shouldDirty: true })}
        placeholder="Penicillin, Sulfa..."
        suggestions={commonAllergies}
      />
      <CommaInput
        label="Past surgeries"
        value={watch('history.surgeries') || []}
        onChange={(next) => setValue('history.surgeries', next, { shouldDirty: true })}
        placeholder="Appendectomy 2018..."
      />
      <CommaInput
        label="Family history"
        value={watch('history.familyHistory') || []}
        onChange={(next) => setValue('history.familyHistory', next, { shouldDirty: true })}
        placeholder="Heart disease, Stroke..."
      />
    </div>
  );
}
