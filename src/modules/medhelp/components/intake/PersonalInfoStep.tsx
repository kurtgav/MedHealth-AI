'use client';

import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientIntakeForm } from '../../constants/intakeSchema';

export function PersonalInfoStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PatientIntakeForm>();

  const bmi = watch('personal.bmi') ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" placeholder="Jane Doe" {...register('personal.fullName')} />
        {errors.personal?.fullName ? (
          <p className="text-sm text-red-400">{errors.personal.fullName.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input id="age" type="number" min={0} max={120} {...register('personal.age', { valueAsNumber: true })} />
        {errors.personal?.age ? <p className="text-sm text-red-400">{errors.personal.age.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="weightKg">Weight (kg)</Label>
        <Input id="weightKg" type="number" step="0.1" {...register('personal.weightKg', { valueAsNumber: true })} />
        {errors.personal?.weightKg ? <p className="text-sm text-red-400">{errors.personal.weightKg.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="heightCm">Height (cm)</Label>
        <Input id="heightCm" type="number" step="0.1" {...register('personal.heightCm', { valueAsNumber: true })} />
        {errors.personal?.heightCm ? <p className="text-sm text-red-400">{errors.personal.heightCm.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label>BMI (auto)</Label>
        <Input value={bmi ? bmi.toFixed(1) : ''} readOnly />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Input id="gender" placeholder="female / male / other" {...register('personal.gender')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bloodPressure">Blood Pressure</Label>
        <Input id="bloodPressure" placeholder="120/80" {...register('personal.bloodPressure')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="heartRate">Heart Rate</Label>
        <Input id="heartRate" type="number" {...register('personal.heartRate', { valueAsNumber: true })} />
        {errors.personal?.heartRate ? <p className="text-sm text-red-400">{errors.personal.heartRate.message}</p> : null}
      </div>
    </div>
  );
}
