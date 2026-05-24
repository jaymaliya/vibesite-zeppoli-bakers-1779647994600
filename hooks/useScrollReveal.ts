"use client";
import { useEffect, useRef } from "react";

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-hidden");
          entry.target.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold }
    );

    el.classList.add("is-hidden");
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}