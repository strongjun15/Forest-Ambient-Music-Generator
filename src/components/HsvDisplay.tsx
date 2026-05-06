import { type Lang, t } from '../i18n';

interface HsvDisplayProps {
  h: number;
  s: number;
  v: number;
  lang: Lang;
}

export function HsvDisplay({ h, s, v, lang }: HsvDisplayProps) {
  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
      <p className="text-xs font-medium text-gray-500 mb-3">{t(lang, 'hsvTitle')}</p>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div
            className="w-10 h-10 mx-auto rounded-full border-2 border-white shadow-md mb-2"
            style={{ background: `hsl(${h}, 70%, 50%)` }}
          />
          <p className="text-xs text-gray-500">{t(lang, 'hue')}</p>
          <p className="text-sm font-semibold text-gray-800">{h}°</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-white shadow-md mb-2 flex items-center justify-center bg-white">
            <div
              className="w-6 h-6 rounded-full"
              style={{ background: `hsl(${h}, ${s}%, 50%)` }}
            />
          </div>
          <p className="text-xs text-gray-500">{t(lang, 'saturation')}</p>
          <p className="text-sm font-semibold text-gray-800">{s}%</p>
        </div>
        <div className="text-center">
          <div
            className="w-10 h-10 mx-auto rounded-full border-2 border-white shadow-md mb-2"
            style={{ background: `hsl(0, 0%, ${v}%)` }}
          />
          <p className="text-xs text-gray-500">{t(lang, 'value')}</p>
          <p className="text-sm font-semibold text-gray-800">{v}%</p>
        </div>
      </div>
    </div>
  );
}
