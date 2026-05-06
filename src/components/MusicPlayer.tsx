import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Download, RotateCcw } from 'lucide-react';
import { type Lang, t } from '../i18n';

interface MusicPlayerProps {
  audioUrl: string;
  onReset: () => void;
  lang: Lang;
}

export function MusicPlayer({ audioUrl, onReset, lang }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      await audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  }, [duration]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800
                     text-white flex items-center justify-center shadow-md
                     transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div
            onClick={handleSeek}
            className="relative h-2 bg-gray-100 rounded-full cursor-pointer group"
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-forest-500 to-forest-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-forest-600 rounded-full shadow-sm
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="flex items-end justify-center gap-1 mt-4 h-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="waveform-bar w-1 bg-gradient-to-t from-forest-500 to-forest-300 rounded-full"
              style={{
                height: '100%',
                animationDelay: `${i * 0.08}s`,
                animationDuration: `${0.8 + Math.random() * 0.8}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-5">
        <a
          href={audioUrl}
          download="gotjawal-ambient.mp3"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                     bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium
                     rounded-full shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          {t(lang, 'download')}
        </a>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-5 py-3
                     bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium
                     rounded-full border border-gray-200 shadow-sm
                     transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          {t(lang, 'newGenerate')}
        </button>
      </div>
    </div>
  );
}
