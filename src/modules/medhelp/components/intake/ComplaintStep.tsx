'use client';

import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PatientIntakeForm } from '../../constants/intakeSchema';

export function ComplaintStep() {
  const { register, watch } = useFormContext<PatientIntakeForm>();
  const severity = watch('complaint.severity') ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="primary">Chief complaint</Label>
        <Input id="primary" placeholder="Severe knee pain" {...register('complaint.primary')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input id="duration" placeholder="2 weeks" {...register('complaint.duration')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="severity">Severity (1-10)</Label>
        <input
          id="severity"
          type="range"
          min={1}
          max={10}
          {...register('complaint.severity', { valueAsNumber: true })}
          className="w-full accent-cyan-400"
        />
        <p className="text-sm text-slate-300">Current severity: {severity}</p>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="treatmentsTried">Treatments already tried</Label>
        <Textarea
          id="treatmentsTried"
          rows={3}
          placeholder="Rest, ice, NSAIDs..."
          className="text-white placeholder:text-slate-300"
          {...register('complaint.treatmentsTried')}
        />
      </div>
    </div>
  );
}
