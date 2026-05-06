import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { type Lang, t } from '../i18n';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview: string | null;
  onClear: () => void;
  lang: Lang;
}

export function ImageUpload({ onImageSelect, preview, onClear, lang }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (preview) {
    return (
      <div className="relative group">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 transition-transform duration-300 hover:scale-[1.01]">
          <img
            src={preview}
            alt="Uploaded landscape"
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>
        <button
          onClick={onClear}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg
                     opacity-0 group-hover:opacity-100 transition-all duration-200
                     hover:bg-white hover:scale-110 active:scale-95"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        relative flex flex-col items-center justify-center w-full h-64 sm:h-72
        border-2 border-dashed rounded-3xl cursor-pointer
        transition-all duration-300 ease-out
        ${isDragging
          ? 'border-forest-500 bg-forest-50/50 scale-[1.02]'
          : 'border-gray-200 bg-gray-50/30 hover:border-gray-300 hover:bg-gray-50/60'
        }
      `}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className={`
        flex flex-col items-center gap-4
        transition-all duration-500 ease-out
        ${isDragging ? 'scale-110' : ''}
      `}>
        <div
          className={`
            p-4 rounded-full bg-white shadow-sm border border-gray-100
            transition-all duration-500 ease-out
            ${isHovering && !isDragging ? 'scale-125 shadow-md' : 'scale-100'}
          `}
        >
          {isDragging ? (
            <ImageIcon className="w-7 h-7 text-forest-600 transition-all duration-300" />
          ) : (
            <Upload className={`w-7 h-7 transition-all duration-500 ${isHovering ? 'text-forest-600' : 'text-gray-400'}`} />
          )}
        </div>
        <div className="text-center">
          <p className={`text-sm font-medium transition-colors duration-300 ${isHovering ? 'text-gray-900' : 'text-gray-700'}`}>
            {isDragging ? t(lang, 'uploadDrop') : t(lang, 'uploadLabel')}
          </p>
          <p className="mt-1.5 text-xs text-gray-400">
            {t(lang, 'uploadHint')}
          </p>
        </div>
      </div>
    </label>
  );
}
