/**
 * Scroll-reveal system using IntersectionObserver
 * Adds .revealed class to [data-reveal] elements when they enter viewport
 */

function initScrollReveal(): void {
  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Make all elements visible immediately
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.classList.add('revealed');
    });
    return;
  }

  const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');

  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('revealed');
          // Disconnect after reveal (one-time animation)
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: '0px 0px -50px 0px', // Slight offset from bottom
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}
