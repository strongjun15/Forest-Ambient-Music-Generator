import { useState, useCallback, useRef, useEffect } from 'react';
import { TreePine } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ProcessingState, type ProcessingStep } from './components/ProcessingState';
import { MusicPlayer } from './components/MusicPlayer';
import { HsvDisplay } from './components/HsvDisplay';
import { LanguageSelector } from './components/LanguageSelector';
import { AboutPage } from './components/AboutPage';
import { analyzeImage, loadImageFromSrc } from './utils/imageAnalysis';
import { type Lang, t } from './i18n';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const REPLICATE_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/generate-music`;

const POLL_INTERVAL_MS = 3000;

type TabView = 'generate' | 'about';

function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [activeTab, setActiveTab] = useState<TabView>('generate');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [hsv, setHsv] = useState<{ h: number; s: number; v: number } | null>(null);
  const [edgeDensity, setEdgeDensity] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const stopProgress = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const startProgressSimulation = useCallback(() => {
    setProgress(5);
    let current = 5;
    progressRef.current = setInterval(() => {
      current += Math.random() * 3 + 0.5;
      if (current >= 90) {
        current = 90;
        if (progressRef.current) {
          clearInterval(progressRef.current);
          progressRef.current = null;
        }
      }
      setProgress(Math.round(current));
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
      stopProgress();
    };
  }, [stopPolling, stopProgress]);

  const handleImageSelect = useCallback((_file: File, preview: string) => {
    setImagePreview(preview);
    setProcessingStep('idle');
    setAudioUrl(null);
    setGeneratedPrompt('');
    setError('');
    setHsv(null);
    setEdgeDensity(null);
    setProgress(0);
    stopPolling();
    stopProgress();
  }, [stopPolling, stopProgress]);

  const handleSampleSelect = useCallback((url: string) => {
    setImagePreview(url);
    setProcessingStep('idle');
    setAudioUrl(null);
    setGeneratedPrompt('');
    setError('');
    setHsv(null);
    setEdgeDensity(null);
    setProgress(0);
    stopPolling();
    stopProgress();
  }, [stopPolling, stopProgress]);

  const handleClearImage = useCallback(() => {
    setImagePreview(null);
    setProcessingStep('idle');
    setAudioUrl(null);
    setGeneratedPrompt('');
    setError('');
    setHsv(null);
    setEdgeDensity(null);
    setProgress(0);
    stopPolling();
    stopProgress();
  }, [stopPolling, stopProgress]);

  const pollPrediction = useCallback((predictionId: string) => {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'X-Replicate-Token': REPLICATE_TOKEN,
    };

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `${EDGE_FUNCTION_URL}/status?id=${predictionId}`,
          { headers }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Polling error (${res.status})`);
        }

        const data = await res.json();

        if (data.status === 'succeeded') {
          stopPolling();
          stopProgress();
          setProgress(100);
          const url = typeof data.output === 'string' ? data.output : data.output;
          setAudioUrl(url);
          setProcessingStep('complete');
        } else if (data.status === 'failed' || data.status === 'canceled') {
          stopPolling();
          stopProgress();
          setProcessingStep('error');
          setError(data.error || 'Music generation failed');
        }
      } catch (err) {
        stopPolling();
        stopProgress();
        setProcessingStep('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }, POLL_INTERVAL_MS);
  }, [stopPolling, stopProgress]);

  const handleGenerate = useCallback(async () => {
    if (!imagePreview) return;

    try {
      setProcessingStep('analyzing');
      setError('');
      setProgress(0);

      const img = await loadImageFromSrc(imagePreview);
      const result = analyzeImage(img);
      setGeneratedPrompt(result.prompt);
      setHsv(result.hsv);
      setEdgeDensity(result.edgeDensity);

      setProcessingStep('generating');
      startProgressSimulation();

      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-Replicate-Token': REPLICATE_TOKEN,
        },
        body: JSON.stringify({ prompt: result.prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const { id } = await response.json();
      pollPrediction(id);
    } catch (err) {
      stopProgress();
      setProcessingStep('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [imagePreview, pollPrediction, startProgressSimulation, stopProgress]);

  const handleReset = useCallback(() => {
    stopPolling();
    stopProgress();
    setImagePreview(null);
    setProcessingStep('idle');
    setAudioUrl(null);
    setGeneratedPrompt('');
    setError('');
    setHsv(null);
    setEdgeDensity(null);
    setProgress(0);
  }, [stopPolling, stopProgress]);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 sm:pt-6 pointer-events-none">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Tab Navigation */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50">
              <TreePine className="w-4 h-4 text-forest-700" />
              <span className="text-sm font-medium text-forest-900 tracking-tight">
                {t(lang, 'navTitle')}
              </span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 p-1">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  activeTab === 'generate'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Music Generate
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  activeTab === 'about'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </button>
            </div>
          </div>

          {/* Right: Language Selector */}
          <div className="pointer-events-auto">
            <LanguageSelector current={lang} onChange={setLang} />
          </div>
        </div>
      </div>

      {/* Page Content */}
      {activeTab === 'generate' ? (
        <>
          {/* Hero Illustration Area */}
          <div className="relative w-full h-[45vh] sm:h-[50vh] overflow-hidden">
            <img
              src="https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
              alt="Forest illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
          </div>

          {/* Main Content */}
          <div className="relative max-w-2xl mx-auto px-6 -mt-16 pb-20">
            <div className="text-center mb-12 fade-in-up">
              <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                {t(lang, 'heroTitle1')}
              </h1>
              <h2 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mt-1">
                {t(lang, 'heroTitle2')}
              </h2>
              <p className="mt-6 text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                {t(lang, 'heroDesc')}
              </p>
            </div>

            <div className="space-y-6 fade-in-up-delay">
              <ImageUpload
                onImageSelect={handleImageSelect}
                onSampleSelect={handleSampleSelect}
                preview={imagePreview}
                onClear={handleClearImage}
                lang={lang}
              />

              {imagePreview && processingStep === 'idle' && !audioUrl && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleGenerate}
                    className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium
                               rounded-full shadow-md transition-all duration-200
                               hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t(lang, 'generateBtn')}
                  </button>
                  <button
                    onClick={handleClearImage}
                    className="px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium
                               rounded-full border border-gray-200 shadow-sm
                               transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                  >
                    {t(lang, 'resetSelectBtn')}
                  </button>
                </div>
              )}

              {hsv && edgeDensity !== null && (processingStep === 'generating' || processingStep === 'complete') && (
                <HsvDisplay h={hsv.h} s={hsv.s} v={hsv.v} edgeDensity={edgeDensity} lang={lang} />
              )}

              <ProcessingState
                step={processingStep}
                prompt={generatedPrompt}
                error={error}
                lang={lang}
                progress={progress}
              />

              {audioUrl && processingStep === 'complete' && (
                <MusicPlayer audioUrl={audioUrl} onReset={handleReset} lang={lang} />
              )}
            </div>

            <footer className="mt-20 text-center">
              <p className="text-xs text-gray-400 tracking-wide">
                {t(lang, 'footer')}
              </p>
            </footer>
          </div>
        </>
      ) : (
        <AboutPage lang={lang} />
      )}
    </div>
  );
}

export default App;
