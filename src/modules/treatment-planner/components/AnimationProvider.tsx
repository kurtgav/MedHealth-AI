'use client';

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { type PropsWithChildren } from "react";

import { pageFade } from "../animations/variants";

export function AnimationProvider({ children }: PropsWithChildren) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

interface PageTransitionProps extends PropsWithChildren {
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageFade}
        className={cn("min-h-screen", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
