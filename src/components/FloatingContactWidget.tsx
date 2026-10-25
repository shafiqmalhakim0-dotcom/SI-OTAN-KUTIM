import React, { useState } from 'react';
import { AccessibilitySettings } from '../types';
import {
  PhoneCall,
  MessageCircle,
  ShieldAlert,
  Flame,
  X,
  ChevronDown,
  Clock,
  Radio,
  ExternalLink,
  Phone,
} from 'lucide-react';
import { getRealtimeSyncMeta } from '../utils/realtimeUpdate';

interface FloatingContactWidgetProps {
  settings: AccessibilitySettings;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const meta = getRealtimeSyncMeta();
  const isHighContrast = settings.contrastMode === 'high-contrast';
  const isDark = settings.contrastMode === 'dark';

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Popover Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Kontak Darurat dan Pengembang SI OTAN Kutim"
          className={`w-[340px] sm:w-[380px] mb-3 rounded-2xl shadow-2xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 overflow-hidden ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-2 border-yellow-300'
              : isDark
              ? 'bg-slate-900/95 backdrop-blur-md text-slate-100 border-slate-700/80'
              : 'bg-white/95 backdrop-blur-md text-slate-800 border-slate-200/90'
          }`}
        >
          {/* Header */}
          <div
            className={`p-3.5 flex items-center justify-between border-b ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-500 font-black'
                : 'bg-gradient-to-r from-emerald-800 to-slate-900 text-white border-emerald-900/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm tracking-tight leading-none">
                  Kontak Siaga & Pengembang
                </h3>
                <p className="text-[10px] opacity-80 mt-0.5">
                  Layanan Bantuan & Respon Cepat SI OTAN Kutim
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-black/20 text-current transition-colors"
              aria-label="Tutup panel kontak"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contact Items List */}
          <div className="p-3.5 space-y-2.5 text-xs">
            {/* 1. Pengembang SI OTAN Kutim (Special user requirement: Pengembang SI OTAN Kutim, bukan admin) */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                isHighContrast
                  ? 'border-yellow-300 bg-black'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-emerald-50/70 border-emerald-200/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-black text-xs text-emerald-700 dark:text-emerald-400">
                    Pengembang SI OTAN Kutim
                  </span>
                </div>
                <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                  Respon Cepat
                </span>
              </div>
              <p className="text-[11px] opacity-75 mb-2.5">
                Konsultasi teknis sistem, integrasi data lapangan, dan aduan khusus warga Kutai Timur.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://wa.me/6282258451435?text=Halo%20Pengembang%20SI%20OTAN%20Kutim%2C%20saya%20ingin%20berkonsultasi%20atau%20melaporkan%20data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:082258451435"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold text-[11px] bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>082258451435</span>
                </a>
              </div>
            </div>

            {/* 2. Pusdalops BPBD Kutim */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                isHighContrast
                  ? 'border-yellow-300'
                  : isDark
                  ? 'bg-slate-800/40 border-slate-700/60'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <h4 className="font-bold text-xs">Pusdalops BPBD Kutai Timur</h4>
                <p className="text-[10px] opacity-70">Posko Bencana & Mitigasi Karhutla</p>
              </div>
              <a
                href="tel:054921113"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>(0549) 21113</span>
              </a>
            </div>

            {/* 3. Posko Damkar 113 */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                isHighContrast
                  ? 'border-yellow-300'
                  : isDark
                  ? 'bg-slate-800/40 border-slate-700/60'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <h4 className="font-bold text-xs">Posko Pemadam Kebakaran</h4>
                <p className="text-[10px] opacity-70">Disdamkartan Kab. Kutai Timur</p>
              </div>
              <a
                href="tel:113"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs shrink-0"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>113</span>
              </a>
            </div>

            {/* Daily 05:00 WITA Auto-Sync note */}
            <div className="pt-1 border-t border-slate-200 dark:border-slate-800 text-[10px] opacity-70 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                <span>Update data harian: Pukul 05:00 WITA</span>
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                NASA FIRMS Live
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Buka Kontak Darurat dan Pengembang SI OTAN Kutim"
        className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-xl transition-all duration-200 active:scale-95 ${
          isOpen
            ? 'bg-slate-900 text-white ring-2 ring-emerald-400'
            : isHighContrast
            ? 'bg-yellow-400 text-black font-black border-2 border-black ring-2 ring-yellow-400'
            : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white ring-2 ring-white/50 dark:ring-slate-700'
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300" />
        </span>

        <PhoneCall className="w-4 h-4 transition-transform group-hover:scale-110" />

        <div className="flex flex-col text-left">
          <span className="font-black text-xs leading-none">
            {isOpen ? 'Tutup Kontak' : 'Kontak Siaga & Pengembang'}
          </span>
          {!isOpen && (
            <span className="text-[9.5px] opacity-90 leading-tight">
              Pengembang & Posko 113 / 21113
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-80 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
};
