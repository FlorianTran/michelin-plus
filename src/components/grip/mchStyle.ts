// Shared helper: inject a <style> block exactly once (for hover/active states
// that inline styles can't express). Used by every Michelin+ Grip component.
export function mchStyle(id: string, css: string): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
