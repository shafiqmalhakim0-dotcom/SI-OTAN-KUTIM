import React, { useState, useEffect } from 'react';
import { AccessibilitySettings, Language } from '../types';
import { translations } from '../data/translations';
import logoImg from '../assets/images/regenerated_image_1792220175250.jpg';
import {
  Wind,
  Flame,
  Trash2,
  BookOpen,
  Sparkles,
  MapPin,
  Sliders,
  Menu,
  X,
  PhoneCall,
  Clock,
  Volume2,
  ShieldAlert,
  MessageCircle,
  Phone,
  Radio,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'air' | 'tps' | 'reports' | 'karhutla' | 'education' | 'funfact';
  setActiveTab: (tab: 'map' | 'air' | 'tps' | 'reports' | 'karhutla' | 'education' | 'funfact') => void;
  onOpenReport: () => void;
  onOpenAccessibility: () => void;
  settings: AccessibilitySettings;
  onUpdateLanguage: (lang: Language) => void;
  syncStatus?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onOpenAccessibility,
  settings,
  onUpdateLanguage,
  syncStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [witaTime, setWitaTime] = useState('');

  const t = translations[settings.language] || translations.id;

  // Real-time clock in WITA (UTC+8)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format to WITA time
      const timeStr = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setWitaTime(timeStr + ' WITA');
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'map' as const, label: t.navMap, icon: MapPin },
    { id: 'air' as const, label: t.navAir, icon: Wind },
    { id: 'tps' as const, label: t.navTps, icon: Trash2 },
    { id: 'reports' as const, label: t.navReports, icon: Flame },
    // Edukasi Karhutla strictly to the left of Edukasi Lingkungan
    { id: 'karhutla' as const, label: t.navKarhutla || 'Edukasi Karhutla', icon: ShieldAlert },
    { id: 'education' as const, label: t.navEducation, icon: BookOpen },
    { id: 'funfact' as const, label: t.navFunFact, icon: Sparkles },
  ];

  const isHighContrast = settings.contrastMode === 'high-contrast';

  return (
      <header
        className={`sticky top-0 z-50 w-full transition-colors backdrop-blur-md border-b shadow-xs ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900/95 text-slate-100 border-slate-800'
            : 'bg-white/95 text-slate-800 border-slate-200'
        }`}
      >
        {/* Top micro status banner */}
        <div
          className={`px-3 sm:px-6 py-1.5 text-xs flex items-center justify-between gap-2 border-b ${
            isHighContrast
              ? 'bg-yellow-400 text-black font-black border-yellow-500'
              : 'bg-emerald-800 text-emerald-50 border-emerald-900/30'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-[11px] sm:text-xs">
              Kab. Kutai Timur &bull; Siaga Karhutla &bull; {syncStatus || 'SINKRONISASI TERAKHIR: 05:00 WITA'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold">
            <div className="flex items-center gap-1 opacity-90 text-[10px]">
              <Clock className="w-3 h-3 text-emerald-300" />
              <span>{witaTime || 'WITA'}</span>
            </div>
          </div>
        </div>

        {/* Main navigation container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand identity (clean without long expansion) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-3 text-left group focus-visible:outline-emerald-500"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-emerald-500/40 group-hover:scale-105 transition-transform bg-white shadow-sm shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={logoImg}
                  alt="Logo SI OTAN KUTIM"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  {t.appName}
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  LIVE
                </span>
              </div>
            </button>
          </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Menu Utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? isHighContrast
                      ? 'bg-yellow-300 text-black font-black'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : isHighContrast
                    ? 'hover:bg-yellow-950 text-yellow-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Language switch buttons */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-medium">
            {(['id', 'en', 'kt'] as const).map((l) => (
              <button
                key={l}
                onClick={() => onUpdateLanguage(l)}
                className={`px-2 py-1 rounded-md transition-all uppercase text-[11px] font-bold ${
                  settings.language === l
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={l === 'kt' ? 'Bahasa Kutai' : l === 'en' ? 'English' : 'Bahasa Indonesia'}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Accessibility Settings Button */}
          <button
            onClick={onOpenAccessibility}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isHighContrast
                ? 'border-yellow-400 bg-black text-yellow-300 hover:bg-neutral-900'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
            title="Buka Pengaturan Aksesibilitas"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">{t.accessibilityBtn}</span>
          </button>

          {/* Lapor Cepat Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="whitespace-nowrap">{t.quickReportBtn}</span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-4 space-y-2 ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-300'
              : settings.contrastMode === 'dark'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200/40 flex items-center justify-between">
            <span className="text-xs font-medium opacity-75">Bahasa:</span>
            <div className="flex gap-1.5">
              {(['id', 'en', 'kt'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => onUpdateLanguage(l)}
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
                    settings.language === l
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
