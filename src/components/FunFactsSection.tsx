import React, { useState } from 'react';
import { AccessibilitySettings } from '../types';
import { FUN_FACTS, FunFactItem } from '../data/funFactsData';
import { translations } from '../data/translations';
import {
  Trees,
  Wind,
  Recycle,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  TreeDeciduous,
  ShieldCheck,
  Flame,
  Award,
  FileCheck2,
} from 'lucide-react';

interface FunFactsSectionProps {
  settings: AccessibilitySettings;
}

export const FunFactsSection: React.FC<FunFactsSectionProps> = ({ settings }) => {
  const [expandedTrivia, setExpandedTrivia] = useState<Record<string, boolean>>({
    ff_rainforest: true,
    ff_wind_smoke: false,
    ff_recycling: false,
  });

  // Simulator state: Number of households (KK) in village
  const [householdsCount, setHouseholdsCount] = useState<number>(350);

  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';

  const toggleTrivia = (id: string) => {
    setExpandedTrivia((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Math simulation for village waste impact:
  // Average Indonesian household: 4 people, 0.7 kg waste/person/day = ~2.8 kg/day per KK
  // 1 year = KK * 2.8 kg * 365 days
  const annualWasteTons = (householdsCount * 2.8 * 365) / 1000;
  // If open burned: 1 ton waste generates approx 0.85 tons of CO2e and dangerous particulates
  const emissionsPreventedTons = Math.round(annualWasteTons * 0.82);
  // Trees saved (1 mature tree absorbs ~22 kg CO2/year -> 1 ton CO2 = ~45 trees)
  const treesEquivalent = Math.round(emissionsPreventedTons * 45.4);
  // Dioxin prevention (micrograms/grams level)
  const toxicAshPreventedKg = Math.round(annualWasteTons * 12); // ~12 kg hazardous ash per ton

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight">{t.funFactTitle}</h2>
        <p className="text-xs sm:text-sm opacity-75 mt-0.5">{t.funFactSubtitle}</p>
      </div>

      {/* 3 Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FUN_FACTS.map((item) => {
          const isExpanded = expandedTrivia[item.id];
          return (
            <div
              key={item.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all hover:shadow-md ${
                isHighContrast
                  ? 'bg-black text-yellow-300 border-yellow-300'
                  : settings.contrastMode === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Badge & Stat */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {item.badge[settings.language] || item.badge.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                    Kutai Timur
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-base font-bold tracking-tight leading-snug">
                  {item.headline[settings.language] || item.headline.id}
                </h3>

                {/* Big Stat Feature */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                    {item.highlightStat}
                  </span>
                  <span className="text-[11px] opacity-75 font-medium">
                    {item.highlightLabel[settings.language] || item.highlightLabel.id}
                  </span>
                </div>

                {/* Narrative story */}
                <p className="text-xs opacity-85 leading-relaxed">
                  {item.story[settings.language] || item.story.id}
                </p>
              </div>

              {/* Collapsible Trivia Box */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => toggleTrivia(item.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:opacity-80 py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fakta Rahasia & Wawasan Unik</span>
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] leading-relaxed italic text-emerald-950 dark:text-emerald-200">
                    {item.triviaBox[settings.language] || item.triviaBox.id}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Village Impact Simulator Widget */}
      <div
        className={`rounded-2xl p-6 border transition-colors shadow-sm ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 border-emerald-200/80 text-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-emerald-500/20 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Simulator Penyelamatan Langit Desa Kutim</h3>
              <p className="text-xs opacity-75">
                Hitung berapa ton emisi dan pohon yang selamat jika warga desa Anda beralih dari membakar sampah ke TPS resmi.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Aksi Gotong Royong Desa Bebas Asap
          </span>
        </div>

        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Slider input */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold">Jumlah Kepala Keluarga (KK) di Desa:</label>
                <span className="text-base font-black px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white">
                  {householdsCount} KK
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={householdsCount}
                onChange={(e) => setHouseholdsCount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] opacity-60 font-semibold mt-1">
                <span>Dusun Kecil (50 KK)</span>
                <span>Desa Sedang (500 KK)</span>
                <span>Kelurahan (2.000 KK)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <span className="font-bold block">Asumsi Standar Kutai Timur:</span>
              <p className="opacity-80">
                1 keluarga menghasilkan rata-rata 2,8 kg sampah/hari. Tanpa TPS resmi, sampah dibakar di pekarangan memicu pelepasan dioksin pekat dan kabut asap lokal.
              </p>
            </div>
          </div>

          {/* Metric Outputs */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-bold opacity-60 uppercase block">Sampah Terkelola</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 block">
                {annualWasteTons.toFixed(0)} Ton
              </span>
              <span className="text-[10px] opacity-75 font-medium">per Tahun dialihkan</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-bold opacity-60 uppercase block">Emisi Gas Tercegah</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 block">
                {emissionsPreventedTons} Ton
              </span>
              <span className="text-[10px] opacity-75 font-medium">CO₂e & Metana (CH₄)</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-bold opacity-60 uppercase block">Setara Menanam</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 block">
                {treesEquivalent.toLocaleString()}
              </span>
              <span className="text-[10px] opacity-75 font-medium">Pohon Tropis Lestari</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-bold opacity-60 uppercase block">Abu Beracun Dilenyapkan</span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 block">
                {toxicAshPreventedKg.toLocaleString()} kg
              </span>
              <span className="text-[10px] opacity-75 font-medium">Abu Karsinogenik Bebas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Data Source Attribution Footer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Sumber Informasi & Riset Lingkungan Hidup:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
          <div>&bull; Balai Taman Nasional Kutai (TNK) Kementerian LHK</div>
          <div>&bull; Lembaga Adat Dayak Wehea (Hutan Lindung Wehea)</div>
          <div>&bull; Intergovernmental Panel on Climate Change (IPCC) Waste Model</div>
        </div>
      </div>
    </div>
  );
};
