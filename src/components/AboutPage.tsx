import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { type Lang, t } from '../i18n';

interface AboutPageProps {
  lang: Lang;
}

export function AboutPage({ lang }: AboutPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [6, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 0.4, 0.9, 1]);

  const heroText = t(lang, 'aboutHeroText');

  return (
    <div className="bg-white">
      {/* Sticky scroll animation section */}
      <div ref={containerRef} className="h-[300vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
          />
          <div className="absolute inset-0 bg-black/30" />

          {/* Animated text */}
          <motion.div
            style={{ scale, opacity }}
            className="relative z-10 text-center px-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight whitespace-pre-line">
              {heroText}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Content sections */}
      <div className="relative z-10 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-24 space-y-24">
          {/* Section 1 */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-snug">
              {t(lang, 'aboutSection1Title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {t(lang, 'aboutSection1Body')}
            </p>
          </motion.section>

          {/* Section 2 */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-snug">
              {t(lang, 'aboutSection2Title')}
            </h2>
            {t(lang, 'aboutSection2Body') && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t(lang, 'aboutSection2Body')}
              </p>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
