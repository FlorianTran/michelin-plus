'use client';

import React from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

/** Scroll-reveal wrapper: adds `.mch-reveal` and toggles `.in` on viewport entry. */
export function Reveal({ children, className = '' }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.classList.add('in');
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
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = `mch-reveal${className ? ' ' + className : ''}`;
  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}
