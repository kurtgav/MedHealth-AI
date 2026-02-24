'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { colors } from '@/src/modules/medhelp/constants/theme';

export function NewSubmissionButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/#intake')}
      className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white shadow-[0_8px_30px_rgba(77,212,232,0.35)] hover:scale-[1.01] hover:shadow-[0_10px_35px_rgba(236,72,153,0.35)]"
      style={{ border: `1px solid ${colors.glassBorder}` }}
    >
      <Plus className="mr-2 h-4 w-4" />
      New Submission
    </Button>
  );
}



