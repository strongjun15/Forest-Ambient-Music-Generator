import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGES, type Lang } from '../i18n';

interface LanguageSelectorProps {
  current: Lang;
  onChange: (lang: Lang) => void;
}

export function LanguageSelector({ current, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = LANGUAGES.find(l => l.code === current)?.label ?? 'English';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700
                   bg-white/80 backdrop-blur-md rounded-full border border-gray-200/60 shadow-sm
                   hover:bg-white hover:shadow-md transition-all duration-200"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{currentLabel}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50
                        animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                ${lang.code === current
                  ? 'bg-gray-50 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
