import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { type Lang, t } from '../i18n';

interface AboutPageProps {
  lang: Lang;
}

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function AboutPage({ lang }: AboutPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.7, 1], [6, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.7, 1], [0, 0.4, 1, 1, 1]);

  const heroText = t(lang, 'aboutHeroText');

  return (
    <div className="bg-white">
      {/* Sticky scroll animation section */}
      <div ref={containerRef} className="h-[400vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
          />
          <div className="absolute inset-0 bg-black/30" />

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
        <div className="max-w-3xl mx-auto px-6 py-24 space-y-32">
          {/* Section 1 */}
          <section>
            <motion.h2
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 leading-snug"
            >
              {t(lang, 'aboutSection1Title')}
            </motion.h2>

            {/* Image card */}
            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-gray-50 rounded-3xl p-3 sm:p-4 shadow-xl">
                <img
                  src="/스크린샷_2026-05-07_오후_8.18.20.png"
                  alt="Ambient music listening"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
            </motion.div>

            <motion.p
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 leading-relaxed"
            >
              {t(lang, 'aboutSection1Body')}
            </motion.p>
          </section>

          {/* Section 2 */}
          <section>
            <motion.h2
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 leading-snug"
            >
              {t(lang, 'aboutSection2Title')}
            </motion.h2>

            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              className="space-y-6"
            >
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t(lang, 'aboutSection2Intro')}
              </p>
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed italic border-l-4 border-gray-200 pl-4">
                {t(lang, 'aboutSection2Note')}
              </p>
            </motion.div>

            {/* HSV Analysis */}
            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="mt-10 bg-gray-50 rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {t(lang, 'aboutSection2HsvTitle')}
              </h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{t(lang, 'aboutSection2Hue')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{t(lang, 'aboutSection2Saturation')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{t(lang, 'aboutSection2Value')}</span>
                </li>
              </ul>
            </motion.div>

            {/* Edge Detection */}
            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className="mt-6 bg-gray-50 rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {t(lang, 'aboutSection2EdgeTitle')}
              </h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  <span>{t(lang, 'aboutSection2Edge1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  <span>{t(lang, 'aboutSection2Edge2')}</span>
                </li>
              </ul>
            </motion.div>
          </section>

          {/* GitHub CTA */}
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex justify-center pt-8 pb-12"
          >
            <a
              href="https://github.com/strongjun15/Forest-Ambient-Music-Generator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-sm font-medium
                         rounded-full shadow-lg transition-all duration-200
                         hover:bg-gray-700 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
            >
              <Github className="w-5 h-5" />
              Github Repository
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
