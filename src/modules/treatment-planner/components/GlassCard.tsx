'use client';

import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "framer-motion";
import { type PropsWithChildren } from "react";

interface GlassCardProps extends MotionProps {
  className?: string;
}

export function GlassCard({ children, className, ...motionProps }: PropsWithChildren<GlassCardProps>) {
  return (
    <motion.div
      {...motionProps}
      className={cn(
        "glass-surface glass-outline card-elevated rounded-2xl p-6 text-sm md:p-8",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
