'use client';
import React from 'react';

/**
 * Page-level scroll-reveal: adds `.in` to every `.mch-reveal` as it enters the
 * viewport. Drop once into a server-rendered page that uses bare `.mch-reveal`
 * elements (those don't self-reveal like the <Reveal> wrapper does). Honors
 * prefers-reduced-motion by revealing everything immediately.
 */
export function RevealOnScroll() {
  React.useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.mch-reveal'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      reveals.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
