import React, { useState } from 'react';
import { AirQualitySummary, AccessibilitySettings } from '../types';
import { translations } from '../data/translations';
import { playSpeech, stopSpeech, isSpeaking } from '../utils/speech';
import { Volume2, VolumeX, AlertTriangle, ShieldCheck, Flame, Info, CheckCircle2 } from 'lucide-react';

interface AirQualityBannerProps {
  airQuality: AirQualitySummary;
  settings: AccessibilitySettings;
  locationLabel?: string;
  dataSource?: string;
}

export const AirQualityBanner: React.FC<AirQualityBannerProps> = ({
  airQuality,
  settings,
  locationLabel = 'Lokasi pengguna',
  dataSource = 'Open-Meteo Air Quality API',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = translations[settings.language] || translations.id;

  const handleAudioToggle = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      const warningText =
        airQuality.warningNotice[settings.language] || airQuality.warningNotice.id;
      const fullSpeechText = `${t.earlyWarningActive}. ${t.airQualityTitle}: ${airQuality.overallIspu}, ${t.airUnhealthy}. ${t.dominantPollutant}: ${airQuality.dominantPollutant}. ${warningText}`;

      const started = playSpeech(
        fullSpeechText,
        settings.language,
        () => setIsPlaying(true),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );

      if (!started) {
        setIsPlaying(false);
      }
    }
  };

  const isHighContrast = settings.contrastMode === 'high-contrast';
  const aqi = Math.max(0, Number(airQuality.overallIspu) || 0);
  const category = aqi <= 50
    ? { label: 'BAIK', badge: 'bg-emerald-600 text-white', icon: 'text-emerald-600', panel: 'bg-emerald-50/70 border-emerald-200' }
    : aqi <= 100
    ? { label: 'SEDANG', badge: 'bg-amber-400 text-slate-950', icon: 'text-amber-600', panel: 'bg-amber-50/70 border-amber-200' }
    : aqi <= 150
    ? { label: 'TIDAK SEHAT BAGI KELOMPOK SENSITIF', badge: 'bg-orange-500 text-white', icon: 'text-orange-600', panel: 'bg-orange-50/70 border-orange-200' }
    : aqi <= 200
    ? { label: 'TIDAK SEHAT', badge: 'bg-red-600 text-white', icon: 'text-red-600', panel: 'bg-red-50/70 border-red-200' }
    : aqi <= 300
    ? { label: 'SANGAT TIDAK SEHAT', badge: 'bg-purple-700 text-white', icon: 'text-purple-600', panel: 'bg-purple-50/70 border-purple-200' }
    : { label: 'BERBAHAYA', badge: 'bg-red-950 text-white', icon: 'text-red-950', panel: 'bg-red-100/70 border-red-300' };

  // Category color mapping
  const getBadgeStyle = () => {
    if (isHighContrast) {
      return 'bg-black text-yellow-300 border-2 border-yellow-300';
    }
    return category.badge;
  };

  return (
    <div
      role="region"
      aria-label="Early Warning Kualitas Udara"
      className={`w-full border-b transition-colors ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : settings.contrastMode === 'dark'
          ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-sm'
          : '${category.panel} text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Status Indicator & Alert Message */}
          <div className="flex items-start gap-3.5 flex-1">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide shadow-xs ${getBadgeStyle()}`}>
                  US AQI {airQuality.overallIspu} · {category.label}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-300 dark:border-slate-700">
                  {airQuality.dominantPollutant}
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium hidden lg:inline">
                  • {locationLabel} · {airQuality.lastUpdated}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold leading-relaxed max-w-4xl text-slate-800 dark:text-slate-200">
                US AQI {airQuality.overallIspu} — {category.label}. Data model atmosfer Open-Meteo, bukan pembacaan sensor lokal.
              </p>
            </div>
          </div>

          {/* Action: TTS Speaker Button */}
          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            <button
              onClick={handleAudioToggle}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isPlaying
                  ? 'bg-rose-700 text-white animate-pulse'
                  : isHighContrast
                  ? 'border-2 border-yellow-300 bg-black text-yellow-300 hover:bg-neutral-900'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
              }`}
              title={isPlaying ? t.stopReading : t.readAloud}
              aria-label={isPlaying ? t.stopReading : t.readAloud}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span>{t.stopReading}</span>
                  <span className="flex gap-0.5 items-center ml-1">
                    <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-white rounded-full animate-bounce" />
                    <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.readAloud}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
