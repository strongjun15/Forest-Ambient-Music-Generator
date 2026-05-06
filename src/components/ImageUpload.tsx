import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { type Lang, t } from '../i18n';

const SAMPLE_PHOTOS = [
  '/IMG_3704.jpeg',
  '/IMG_3706.jpeg',
  '/IMG_3711.jpeg',
  '/IMG_3715.jpeg',
  '/IMG_3724.jpeg',
];

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onSampleSelect: (url: string) => void;
  preview: string | null;
  onClear: () => void;
  lang: Lang;
}

export function ImageUpload({ onImageSelect, onSampleSelect, preview, onClear, lang }: ImageUploadProps) {
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
    <div className="space-y-6">
      {/* Upload area */}
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`
          relative flex flex-col items-center justify-center w-full h-56 sm:h-64
          border-2 border-dashed rounded-3xl cursor-pointer
          transition-all duration-300 ease-out
          ${isDragging
            ? 'border-forest-500 bg-forest-100 scale-[1.02] shadow-lg'
            : isHovering
              ? 'border-forest-400 bg-forest-50 shadow-md'
              : 'border-gray-200 bg-gray-50/30'
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
              p-4 rounded-full border
              transition-all duration-500 ease-out
              ${isHovering || isDragging
                ? 'bg-forest-100 border-forest-200 shadow-lg'
                : 'bg-white border-gray-100 shadow-sm'
              }
            `}
            style={{
              transform: isDragging ? 'scale(1.4)' : isHovering ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 0.5s ease-out, background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
            }}
          >
            {isDragging ? (
              <ImageIcon className="w-7 h-7 text-forest-600 transition-all duration-300" />
            ) : (
              <Upload className={`w-7 h-7 transition-all duration-500 ${isHovering ? 'text-forest-600' : 'text-gray-400'}`} />
            )}
          </div>
          <div className="text-center">
            <p className={`text-sm font-medium transition-colors duration-300 ${isHovering || isDragging ? 'text-forest-800' : 'text-gray-700'}`}>
              {isDragging ? t(lang, 'uploadDrop') : t(lang, 'uploadLabel')}
            </p>
            <p className={`mt-1.5 text-xs transition-colors duration-300 ${isHovering ? 'text-forest-500' : 'text-gray-400'}`}>
              {t(lang, 'uploadHint')}
            </p>
          </div>
        </div>
      </label>

      {/* OR Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 tracking-widest">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Sample photos */}
      <div>
        <p className="text-sm text-gray-500 text-center mb-4">
          {t(lang, 'samplePhotosHint')}
        </p>
        <div className="grid grid-cols-5 gap-3">
          {SAMPLE_PHOTOS.map((url, i) => (
            <SamplePhotoCard key={i} url={url} onClick={() => onSampleSelect(url)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SamplePhotoCard({ url, onClick }: { url: string; onClick: () => void }) {
  const [hovering, setHovering] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100
                 transition-all duration-300 ease-out
                 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:ring-offset-2"
      style={{
        transform: hovering ? 'scale(1.08)' : 'scale(1)',
        boxShadow: hovering ? '0 10px 25px -5px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <img
        src={url}
        alt="Sample Gotjawal forest"
        className="w-full h-full object-cover transition-all duration-500"
        style={{ filter: hovering ? 'brightness(1.08) saturate(1.1)' : 'brightness(1)' }}
      />
      {hovering && (
        <div className="absolute inset-0 bg-forest-600/10 transition-opacity duration-300" />
      )}
    </button>
  );
}
