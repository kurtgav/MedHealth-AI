import { LucideIcon, Activity, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight?: string;
}

export const landingCopy = {
  heroTitle: 'A Smarter Way to Health Insights',
  heroSubtitle:
    'AI-powered clinical decision support that blends safety-first analysis with immersive visualizations, built for clinicians who need clarity and speed.',
  primaryCta: 'Start Intake',
  secondaryCta: 'View Dashboard',
};

export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Intake', href: '#intake' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Safety', href: '#safety' },
];

export const features: FeatureItem[] = [
  {
    title: 'Clinical-grade Safety',
    description: 'Realtime checks for contraindications, allergies, and dosing risks with conservative defaults.',
    icon: ShieldCheck,
    highlight: 'CRITICAL/High risk surfaces instantly',
  },
  {
    title: 'AI Treatment Planner',
    description: 'Structured GPT-4 guidance with auditable rationale, alternatives, and monitoring steps.',
    icon: Cpu,
    highlight: 'JSON-first responses',
  },
  {
    title: 'Dynamic Intake Wizard',
    description: 'Animated, validated, multi-step capture with live BMI, interaction hints, and draft saving.',
    icon: Activity,
    highlight: '5-step guided flow',
  },
  {
    title: 'Immersive UI',
    description: 'Glassmorphism, gradients, and micro-interactions at 60fps using Framer Motion + R3F.',
    icon: Sparkles,
    highlight: 'Particles + parallax',
  },
];
