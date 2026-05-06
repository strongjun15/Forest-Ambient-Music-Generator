import { type Lang, t } from '../i18n';

interface HsvDisplayProps {
  h: number;
  s: number;
  v: number;
  edgeDensity: number;
  lang: Lang;
}

function getEdgeDensityLabel(density: number, lang: Lang): string {
  const labels = {
    en: density < 5 ? 'Low' : density < 15 ? 'Medium' : 'High',
    ko: density < 5 ? '낮음' : density < 15 ? '보통' : '높음',
    ja: density < 5 ? '低い' : density < 15 ? '中程度' : '高い',
    zh: density < 5 ? '低' : density < 15 ? '中' : '高',
  };
  return labels[lang];
}

function getEdgeDensityColor(density: number): string {
  if (density < 5) return 'from-emerald-100 to-emerald-200';
  if (density < 15) return 'from-amber-100 to-amber-200';
  return 'from-rose-100 to-rose-200';
}

function getEdgeDensityIconColor(density: number): string {
  if (density < 5) return 'text-emerald-600';
  if (density < 15) return 'text-amber-600';
  return 'text-rose-600';
}

export function HsvDisplay({ h, s, v, edgeDensity, lang }: HsvDisplayProps) {
  const densityLabel = getEdgeDensityLabel(edgeDensity, lang);
  const densityGradient = getEdgeDensityColor(edgeDensity);
  const densityIconColor = getEdgeDensityIconColor(edgeDensity);

  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 space-y-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t(lang, 'hsvTitle')}</p>

      {/* HSV Row */}
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

      {/* Edge Density Section */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{t(lang, 'edgeDensityTitle')}</p>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${densityGradient} flex items-center justify-center shadow-sm`}>
            <svg className={`w-6 h-6 ${densityIconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-800">{edgeDensity}%</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                edgeDensity < 5 ? 'bg-emerald-100 text-emerald-700' :
                edgeDensity < 15 ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                {densityLabel}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${
                  edgeDensity < 5 ? 'from-emerald-400 to-emerald-500' :
                  edgeDensity < 15 ? 'from-amber-400 to-amber-500' :
                  'from-rose-400 to-rose-500'
                } transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(edgeDensity * 3, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{t(lang, 'edgeDensityDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
