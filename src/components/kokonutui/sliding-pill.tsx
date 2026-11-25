"use client";

/**
 * The sliding indicator from Kokonut UI "Swipe Tabs" (smooth-tab, MIT, @kokonut-labs):
 * one cyan pill that springs from the old tab to the new one. Rendered inside the active
 * tab; motion's shared layout animation moves it, so it is there from the first paint.
 */

import { motion, useReducedMotion } from "motion/react";

const SPRING = { type: "spring", stiffness: 420, damping: 38 } as const;

export function SlidingPill({ id }: { id: string }) {
  const reduced = useReducedMotion();
  return <motion.span aria-hidden="true" layoutId={id} className="sliding-pill" transition={reduced ? { duration: 0 } : SPRING} />;
}
