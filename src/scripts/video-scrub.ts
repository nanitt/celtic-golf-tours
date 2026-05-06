/**
 * Video Scrub Controller
 * Scroll-linked video playback for cinematic hero sections
 *
 * Features:
 * - Scroll position maps to video timeline
 * - Smooth scrubbing with RAF
 * - Respects prefers-reduced-motion
 * - Fallback to static poster when needed
 */

interface VideoScrubOptions {
  videoSelector: string;
  containerSelector: string;
  // How much scroll distance maps to full video duration
  // 1.0 = one viewport height = full video
  scrollMultiplier?: number;
}

export function initVideoScrub(options: VideoScrubOptions): () => void {
  const { videoSelector, containerSelector, scrollMultiplier = 1.5 } = options;

  const video = document.querySelector<HTMLVideoElement>(videoSelector);
  const container = document.querySelector<HTMLElement>(containerSelector);

  if (!video || !container) {
    console.warn('[VideoScrub] Video or container not found');
    return () => {};
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show first frame and don't scrub
    video.pause();
    video.currentTime = 0;
    return () => {};
  }

  // Disable default autoplay/loop for scrub mode
  video.autoplay = false;
  video.loop = false;
  video.muted = true;

  // Wait for video metadata
  const handleLoadedMetadata = () => {
    video.currentTime = 0;
  };

  if (video.readyState >= 1) {
    handleLoadedMetadata();
  } else {
    video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
  }

  let ticking = false;
  let lastScrollY = 0;

  const updateVideoTime = () => {
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;

    // Calculate scroll progress through the hero section
    // 0 = hero just entered viewport from bottom
    // 1 = hero has scrolled off the top
    const scrollStart = viewportHeight; // When top of hero is at bottom of viewport
    const scrollEnd = -containerHeight; // When bottom of hero is at top of viewport
    const scrollRange = scrollStart - scrollEnd;

    // How far we've scrolled through the range
    const scrollProgress = (scrollStart - containerTop) / scrollRange;

    // Clamp between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

    // Map to video duration
    if (video.duration && !isNaN(video.duration)) {
      const targetTime = clampedProgress * video.duration * scrollMultiplier;
      const clampedTime = Math.min(targetTime, video.duration);

      // Only update if significantly different (performance optimization)
      if (Math.abs(video.currentTime - clampedTime) > 0.05) {
        video.currentTime = clampedTime;
      }
    }

    ticking = false;
  };

  const onScroll = () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateVideoTime);
      ticking = true;
    }
  };

  // Initial update
  updateVideoTime();

  // Listen for scroll
  window.addEventListener('scroll', onScroll, { passive: true });

  // Handle resize
  const onResize = () => {
    updateVideoTime();
  };
  window.addEventListener('resize', onResize, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}

/**
 * Scroll Progress Indicator
 * Shows visual progress through the hero section
 */
export function initScrollProgress(options: {
  indicatorSelector: string;
  containerSelector: string;
}): () => void {
  const { indicatorSelector, containerSelector } = options;

  const indicator = document.querySelector<HTMLElement>(indicatorSelector);
  const container = document.querySelector<HTMLElement>(containerSelector);

  if (!indicator || !container) {
    return () => {};
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    indicator.style.display = 'none';
    return () => {};
  }

  let ticking = false;

  const updateProgress = () => {
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;

    const scrollProgress = Math.max(0, Math.min(1, -containerTop / (containerHeight - viewportHeight)));

    indicator.style.setProperty('--scroll-progress', scrollProgress.toString());

    // Hide when fully scrolled past
    indicator.style.opacity = scrollProgress < 0.95 ? '1' : '0';

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  };

  updateProgress();
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}
