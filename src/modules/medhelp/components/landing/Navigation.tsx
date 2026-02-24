'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navLinks } from '../../constants/landing';
import { colors } from '../../constants/theme';
import { ProfileDropdown } from '@/src/modules/auth/components/ProfileDropdown';
import { useAuth } from '@/src/modules/auth/hooks/useAuth';

export function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-30 px-6 py-4"
    >
      <div
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border px-5 py-3 shadow-lg"
        style={{
          background: 'rgba(10, 22, 40, 0.55)',
          borderColor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Link href="#" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/70 via-purple-500/70 to-pink-500/70 shadow-lg shadow-cyan-400/30">
            <ShieldCheck className="h-5 w-5 text-white" />
          </span>
          <div className="leading-tight">
            <p className="text-sm text-slate-300">MedHelp-AI</p>
            <p className="text-base font-semibold text-white">Clinical Copilot</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-slate-200 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <Button
              size="sm"
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white shadow-[0_8px_30px_rgba(77,212,232,0.35)] hover:scale-[1.01] hover:shadow-[0_10px_35px_rgba(236,72,153,0.35)]"
              style={{ border: `1px solid ${colors.glassBorder}` }}
              asChild
            >
              <Link href="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
