/**
 * Horizontal Scroll Controller
 * Converts vertical scroll to horizontal scroll within a section
 *
 * Features:
 * - Smooth horizontal scrolling on vertical scroll
 * - Touch/swipe support on mobile
 * - Keyboard navigation
 * - Progress indicator
 * - Respects prefers-reduced-motion
 */

interface HorizontalScrollOptions {
  containerSelector: string;
  trackSelector: string;
  progressSelector?: string;
  // Number of viewport widths to scroll horizontally per viewport height scrolled vertically
  scrollRatio?: number;
  // Enable keyboard navigation
  enableKeyboard?: boolean;
}

interface HorizontalScrollState {
  isActive: boolean;
  progress: number;
  touchStartX: number;
  touchStartY: number;
}

const state: HorizontalScrollState = {
  isActive: false,
  progress: 0,
  touchStartX: 0,
  touchStartY: 0
};

export function initHorizontalScroll(options: HorizontalScrollOptions): () => void {
  const {
    containerSelector,
    trackSelector,
    progressSelector,
    scrollRatio = 1,
    enableKeyboard = true
  } = options;

  const container = document.querySelector<HTMLElement>(containerSelector);
  const track = document.querySelector<HTMLElement>(trackSelector);
  const progressEl = progressSelector ? document.querySelector<HTMLElement>(progressSelector) : null;

  if (!container || !track) {
    console.warn('[HorizontalScroll] Container or track not found');
    return () => {};
  }

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // On reduced motion, just show as horizontal scrollable
    container.style.overflowX = 'auto';
    return () => {};
  }

  // Calculate dimensions
  const updateDimensions = () => {
    const trackWidth = track.scrollWidth;
    const containerWidth = container.clientWidth;
    const scrollableDistance = trackWidth - containerWidth;

    return { trackWidth, containerWidth, scrollableDistance };
  };

  let dimensions = updateDimensions();
  let ticking = false;

  // Update horizontal position based on vertical scroll
  const updateHorizontalScroll = () => {
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate how much the container has scrolled through the viewport
    // 0 = container just entered from bottom
    // 1 = container is about to exit top
    const scrollStart = viewportHeight;
    const scrollEnd = -rect.height;
    const scrollRange = scrollStart - scrollEnd;

    const progress = Math.max(0, Math.min(1, (scrollStart - rect.top) / scrollRange));
    state.progress = progress;

    // Apply horizontal transform
    const translateX = -progress * dimensions.scrollableDistance;
    track.style.transform = `translateX(${translateX}px)`;

    // Update progress indicator
    if (progressEl) {
      progressEl.style.setProperty('--scroll-progress', progress.toString());
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHorizontalScroll);
      ticking = true;
    }
  };

  // Handle resize
  const onResize = () => {
    dimensions = updateDimensions();
    updateHorizontalScroll();
  };

  // Keyboard navigation
  const onKeyDown = (e: KeyboardEvent) => {
    if (!enableKeyboard) return;

    // Only handle when container is in view
    const rect = container.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    const scrollAmount = 200;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  // Touch handling for mobile
  const onTouchStart = (e: TouchEvent) => {
    state.touchStartX = e.touches[0].clientX;
    state.touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    const deltaX = state.touchStartX - touchX;
    const deltaY = state.touchStartY - touchY;

    // If horizontal swipe is dominant, convert to vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      window.scrollBy({ top: deltaX * 0.5, behavior: 'auto' });
      state.touchStartX = touchX;
    }
  };

  // Initialize
  updateHorizontalScroll();

  // Event listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  if (enableKeyboard) {
    window.addEventListener('keydown', onKeyDown);
  }

  container.addEventListener('touchstart', onTouchStart, { passive: true });
  container.addEventListener('touchmove', onTouchMove, { passive: false });

  // Cleanup
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('keydown', onKeyDown);
    container.removeEventListener('touchstart', onTouchStart);
    container.removeEventListener('touchmove', onTouchMove);
  };
}

/**
 * Simple horizontal scroll container (mobile-friendly alternative)
 * No scroll jacking, just smooth horizontal scroll with snap
 */
export function initSimpleHorizontalScroll(containerSelector: string): () => void {
  const container = document.querySelector<HTMLElement>(containerSelector);
  if (!container) return () => {};

  // Enable CSS scroll snap
  container.style.scrollSnapType = 'x mandatory';
  container.style.overflowX = 'auto';
  container.style.webkitOverflowScrolling = 'touch';

  // Hide scrollbar but keep functionality
  container.style.scrollbarWidth = 'none';
  (container.style as any).msOverflowStyle = 'none';

  // Add scroll indicator buttons if needed
  const scrollLeft = () => {
    const itemWidth = container.firstElementChild?.clientWidth || 300;
    container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const itemWidth = container.firstElementChild?.clientWidth || 300;
    container.scrollBy({ left: itemWidth, behavior: 'smooth' });
  };

  // Expose methods
  (container as any).__scrollLeft = scrollLeft;
  (container as any).__scrollRight = scrollRight;

  return () => {
    delete (container as any).__scrollLeft;
    delete (container as any).__scrollRight;
  };
}
