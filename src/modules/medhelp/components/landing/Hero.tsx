'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { landingCopy } from '../../constants/landing';
import { gradients, shadows } from '../../constants/theme';
import { LightTrails } from '../animations/LightTrails';

const HeroVisualization = dynamic(() => import('./HeroVisualization').then((mod) => mod.HeroVisualization), {
  ssr: false,
  loading: () => (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1e2f4f] to-[#2a0f3a] opacity-80" />
    </div>
  ),
});

const textVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 pb-16 pt-32 text-white md:pt-36"
      style={{ background: gradients.hero }}
    >
      <LightTrails />
      <div className="absolute inset-0 opacity-35" style={{ background: gradients.background }} aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <motion.div initial="hidden" animate="visible" variants={textVariants} custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Care
            </span>
          </motion.div>
          <motion.h1
            className="text-4xl font-semibold leading-tight md:text-5xl"
            initial="hidden"
            animate="visible"
            variants={textVariants}
            custom={1}
          >
            {landingCopy.heroTitle}
          </motion.h1>
          <motion.p
            className="max-w-xl text-lg text-cyan-50/85 md:text-xl"
            initial="hidden"
            animate="visible"
            variants={textVariants}
            custom={2}
          >
            {landingCopy.heroSubtitle}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={textVariants}
            custom={3}
          >
            <Button
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-base text-white shadow-[0_15px_45px_rgba(77,212,232,0.35)] hover:shadow-[0_18px_55px_rgba(236,72,153,0.35)] md:px-7 md:py-3"
              asChild
            >
              <Link href="#intake">
                {landingCopy.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Link
              href="#dashboard"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-white/30 bg-white/10 text-white shadow-inner backdrop-blur hover:bg-white/20'
              )}
            >
              {landingCopy.secondaryCta}
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={textVariants}
            custom={4}
          >
            {[
              { label: 'Safety rules enforced', value: '4+' },
              { label: 'Particle count', value: '200+' },
              { label: 'Response target', value: '<10s' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                style={{ boxShadow: shadows.card }}
              >
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="text-cyan-50/75">{item.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-cyan-50/80 shadow-inner backdrop-blur"
            initial="hidden"
            animate="visible"
            variants={textVariants}
            custom={5}
          >
            <ShieldAlert className="h-5 w-5 text-pink-300" />
            Conservative by design: we always elevate risk when uncertain and surface contraindications first.
          </motion.div>
        </div>

        <div className="relative flex-1">
          <HeroVisualization />
          <div className="absolute inset-0 -z-10 blur-[120px]" style={{ background: gradients.cardBorder, opacity: 0.4 }} />
        </div>
      </div>
    </section>
  );
}
