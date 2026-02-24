'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '../types';
import { User, Stethoscope } from 'lucide-react';
import { colors } from '@/src/modules/medhelp/constants/theme';

interface RoleSelectionStepProps {
  onSelectRole: (role: UserRole) => void;
  isLoading?: boolean;
}

export function RoleSelectionStep({ onSelectRole, isLoading }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Choose Your Role</h2>
        <p className="mt-2 text-sm text-slate-300">
          Select how you'll be using MedHelp-AI
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`cursor-pointer border-2 transition-all ${
            selectedRole === UserRole.PATIENT
              ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
          onClick={() => setSelectedRole(UserRole.PATIENT)}
        >
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
              <User className="h-6 w-6 text-cyan-400" />
            </div>
            <CardTitle className="text-white">Patient</CardTitle>
            <CardDescription className="text-slate-300">
              Submit medical intake forms and track your treatment plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Create and manage submissions</li>
              <li>• View treatment recommendations</li>
              <li>• Track submission status</li>
            </ul>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-all ${
            selectedRole === UserRole.DOCTOR
              ? 'border-purple-400 bg-purple-400/10 shadow-lg shadow-purple-400/20'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
          onClick={() => setSelectedRole(UserRole.DOCTOR)}
        >
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20">
              <Stethoscope className="h-6 w-6 text-purple-400" />
            </div>
            <CardTitle className="text-white">Doctor</CardTitle>
            <CardDescription className="text-slate-300">
              Review patient submissions and provide clinical insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Review all patient submissions</li>
              <li>• Add notes and update status</li>
              <li>• Access comprehensive dashboard</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={() => selectedRole && onSelectRole(selectedRole)}
        disabled={!selectedRole || isLoading}
        className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white shadow-[0_8px_30px_rgba(77,212,232,0.35)] hover:scale-[1.01] hover:shadow-[0_10px_35px_rgba(236,72,153,0.35)]"
        style={{ border: `1px solid ${colors.glassBorder}` }}
      >
        {isLoading ? 'Setting up your account...' : 'Continue'}
      </Button>
    </div>
  );
}



