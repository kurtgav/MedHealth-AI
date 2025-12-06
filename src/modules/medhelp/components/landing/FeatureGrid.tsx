'use client';

import { motion, type Variants } from 'framer-motion';

import { features } from '../../constants/landing';
import { gradients } from '../../constants/theme';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function FeatureGrid() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#0a1628] px-6 py-16 text-white">
      <div className="absolute inset-0" style={{ background: gradients.background, opacity: 0.75 }} aria-hidden />
      <div className="relative mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Why MedHelp-AI</p>
            <h2 className="mt-2 text-3xl font-semibold">Built for clinicians, with safety first</h2>
          </div>
          <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-cyan-100 md:block">
            Animations, gradients, and clinical controls tuned for focus.
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={idx}
            >
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
                <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
              </div>
              <div className="relative flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <feature.icon className="h-6 w-6 text-cyan-100" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    {feature.highlight ? (
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-cyan-100">{feature.highlight}</span>
                    ) : null}
                  </div>
                  <p className="text-sm text-cyan-50/80">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
