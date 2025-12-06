'use client';

import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { lifestyleOptions } from '../../constants/medicalOptions';
import { PatientIntakeForm } from '../../constants/intakeSchema';

export function LifestyleStep() {
  const { register, formState: { errors } } = useFormContext<PatientIntakeForm>();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="smoking">Smoking status</Label>
        <Input id="smoking" list="smoking-options" placeholder="never" {...register('lifestyle.smoking')} />
        <datalist id="smoking-options">
          {lifestyleOptions.smoking.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="packYears">Pack years (if applicable)</Label>
        <Input id="packYears" type="number" step="0.1" {...register('lifestyle.packYears', { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="alcoholPerWeek">Alcohol (drinks/week)</Label>
        <Input id="alcoholPerWeek" type="number" {...register('lifestyle.alcoholPerWeek', { valueAsNumber: true })} />
        {errors.lifestyle?.alcoholPerWeek ? (
          <p className="text-xs text-red-400">{errors.lifestyle.alcoholPerWeek.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="exerciseDaysPerWeek">Exercise (days/week)</Label>
        <Input
          id="exerciseDaysPerWeek"
          type="number"
          min={0}
          max={7}
          {...register('lifestyle.exerciseDaysPerWeek', { valueAsNumber: true })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exerciseIntensity">Exercise intensity</Label>
        <Input
          id="exerciseIntensity"
          list="intensity-options"
          placeholder="moderate"
          {...register('lifestyle.exerciseIntensity')}
        />
        <datalist id="intensity-options">
          {lifestyleOptions.exerciseIntensity.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dietType">Diet type</Label>
        <Input id="dietType" list="diet-options" placeholder="Mediterranean" {...register('lifestyle.dietType')} />
        <datalist id="diet-options">
          {lifestyleOptions.dietTypes.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sleepHours">Sleep (hours/night)</Label>
        <Input id="sleepHours" type="number" step="0.5" {...register('lifestyle.sleepHours', { valueAsNumber: true })} />
        {errors.lifestyle?.sleepHours ? (
          <p className="text-xs text-red-400">{errors.lifestyle.sleepHours.message}</p>
        ) : null}
      </div>
    </div>
  );
}
