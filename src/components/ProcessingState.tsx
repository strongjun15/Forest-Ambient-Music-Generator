import { Loader2 } from 'lucide-react';
import { type Lang, t } from '../i18n';

export type ProcessingStep = 'analyzing' | 'generating' | 'complete' | 'idle' | 'error';

interface ProcessingStateProps {
  step: ProcessingStep;
  prompt?: string;
  error?: string;
  lang: Lang;
  progress: number;
}

export function ProcessingState({ step, prompt, error, lang, progress }: ProcessingStateProps) {
  if (step === 'idle') return null;

  const titles: Record<ProcessingStep, string> = {
    idle: '',
    analyzing: t(lang, 'analyzing'),
    generating: t(lang, 'generating'),
    complete: t(lang, 'complete'),
    error: t(lang, 'errorTitle'),
  };

  const subtitles: Record<ProcessingStep, string> = {
    idle: '',
    analyzing: t(lang, 'analyzingSub'),
    generating: t(lang, 'generatingSub'),
    complete: t(lang, 'completeSub'),
    error: t(lang, 'errorSub'),
  };

  const title = titles[step];
  const subtitle = subtitles[step];

  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {(step === 'analyzing' || step === 'generating') && (
          <div className="flex-shrink-0 mt-0.5">
            <Loader2 className="w-5 h-5 text-forest-600 animate-spin" />
          </div>
        )}
        {step === 'complete' && (
          <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-forest-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {step === 'error' && (
          <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <XIcon className="w-3 h-3 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {step === 'error' ? error || subtitle : subtitle}
          </p>
          {prompt && step !== 'idle' && (
            <div className="mt-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-medium text-gray-600 mb-1">{t(lang, 'promptLabel')}</p>
              <p className="text-xs text-gray-500 leading-relaxed italic">"{prompt}"</p>
            </div>
          )}
        </div>
      </div>

      {(step === 'analyzing' || step === 'generating') && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">{t(lang, 'progress')}</span>
            <span className="text-xs font-semibold text-forest-700">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest-400 to-forest-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
