"use client";

import { useEffect, useRef } from "react";
import GlitchText from "@/components/kokonutui/glitch-text";

/** Glitch text that bursts each time the light band of the hero line sweep passes under it. */
export function SweepGlitch({ text, className }: { text: string; className?: string }) {
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      // The visible main layer (wide on laptop and up, traces on phone/tablet) and its light band.
      const layer = [...document.querySelectorAll<HTMLElement>(".hero-layer[data-sweep-main]")].find(
        (l) => l.getClientRects().length > 0,
      );
      const anim = layer?.querySelector(".hero-sweep")?.getAnimations()[0];
      const el = wrap.current;
      if (!layer || !el || !anim || anim.currentTime == null) {
        // No sweep (reduced motion, or not started yet): check again later.
        timer = setTimeout(schedule, 2000);
        return;
      }
      const duration = Number(anim.effect?.getTiming().duration);
      // The band is 0.24W wide and its left edge goes from -0.24W to W, so its centre is at
      // (1.24p - 0.12)W at progress p. Solve for the word's centre.
      const box = layer.getBoundingClientRect();
      const word = el.getBoundingClientRect();
      const x = (word.left + word.width / 2 - box.left) / box.width;
      const target = (duration * (x + 0.12)) / 1.24;
      const now = Number(anim.currentTime) % duration;
      let delay = (((target - now) % duration) + duration) % duration;
      if (delay < 50) delay += duration;
      timer = setTimeout(() => {
        el.firstElementChild?.dispatchEvent(new Event("glitch"));
        schedule();
      }, delay);
    };

    schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <span ref={wrap}>
      <GlitchText text={text} trigger="event" intensity="medium" className={className} />
    </span>
  );
}
