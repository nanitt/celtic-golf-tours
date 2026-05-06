import { motion } from 'framer-motion';

interface Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showTrustBar?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function HeroContent({ kicker, title, subtitle, ctaText, ctaLink, showTrustBar }: Props) {
  return (
    <motion.div
      className="text-center px-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Kicker */}
      {kicker && (
        <motion.div variants={itemVariants} className="mb-8">
          <p
            className="text-sm font-medium tracking-[0.4em] uppercase cinematic-text-shadow"
            style={{ color: 'rgba(245, 245, 241, 0.7)' }}
          >
            {kicker}
          </p>
        </motion.div>
      )}

      {/* Main Title */}
      <motion.h1
        variants={itemVariants}
        className="mb-8 leading-[1.1] tracking-tight cinematic-title"
        style={{
          fontFamily: 'var(--font-heading-display)',
          fontSize: 'clamp(2.75rem, 7vw, 5rem)',
          color: '#F5F5F1'
        }}
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-2xl mb-14 max-w-3xl mx-auto font-light tracking-wide leading-relaxed cinematic-text-shadow"
          style={{ color: 'rgba(245, 245, 241, 0.8)' }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* CTA Button */}
      {ctaText && (
        <motion.div variants={itemVariants}>
          <a
            href={ctaLink}
            className="luxury-cta inline-flex items-center gap-3 px-12 py-5 text-base font-medium tracking-wide rounded-sm"
            data-cursor-hover="cta"
          >
            <span>{ctaText}</span>
            <svg
              className="luxury-cta-arrow w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      )}

      {/* Trust bar */}
      {showTrustBar && (
        <motion.div variants={itemVariants} className="mt-8">
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: 'rgba(245, 245, 241, 0.45)' }}
          >
            4.9★ &nbsp;&middot;&nbsp; 500+ Golfers &nbsp;&middot;&nbsp; 150+ Tours
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
