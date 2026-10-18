import React from 'react';
import { AccessibilitySettings, Language, TextSize, ContrastMode } from '../types';
import { translations } from '../data/translations';
import { X, Volume2, Type, Sun, Moon, Eye, Languages, RotateCcw, Check } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const t = translations[settings.language] || translations.id;

  const handleTextSizeChange = (size: TextSize) => {
    onUpdateSettings({ ...settings, textSize: size });
  };

  const handleDyslexicToggle = () => {
    onUpdateSettings({ ...settings, fontDyslexic: !settings.fontDyslexic });
  };

  const handleContrastChange = (mode: ContrastMode) => {
    onUpdateSettings({ ...settings, contrastMode: mode });
  };

  const handleLanguageChange = (lang: Language) => {
    onUpdateSettings({ ...settings, language: lang });
  };

  const handleSoundToggle = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleReset = () => {
    onUpdateSettings({
      textSize: 'normal',
      fontDyslexic: false,
      contrastMode: 'normal',
      language: 'id',
      soundEnabled: true,
    });
  };

  const isHighContrast = settings.contrastMode === 'high-contrast';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
    >
      <div
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl transition-all ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-2 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 text-slate-100 border border-slate-800'
            : 'bg-white text-slate-900 border border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-600">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 id="accessibility-title" className="text-xl font-bold leading-tight">
                {t.accessibilityTitle}
              </h2>
              <p className="text-xs opacity-75 mt-0.5">{t.accessibilityDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Tutup pengaturan aksesibilitas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-6">
          {/* Text Size Controls */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2.5">
              <Type className="w-4 h-4 text-emerald-600" />
              <span>{t.textSizeLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'normal', label: t.textNormal, size: 'text-sm' },
                  { id: 'large', label: t.textLarge, size: 'text-base font-medium' },
                  { id: 'xl', label: t.textXl, size: 'text-lg font-bold' },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleTextSizeChange(option.id)}
                  className={`py-3 px-3 rounded-xl border text-center transition-all ${
                    settings.textSize === option.id
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700'
                  }`}
                >
                  <span className={option.size}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dyslexia Friendly Font */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">{t.dyslexicFontLabel}</h3>
                <p className="text-xs opacity-75 mt-0.5 max-w-sm">{t.dyslexicFontDesc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.fontDyslexic}
                onClick={handleDyslexicToggle}
                className={`w-13 h-7 flex items-center rounded-full p-1 transition-colors ${
                  settings.fontDyslexic ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    settings.fontDyslexic ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Contrast and Themes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2.5">
              <Sun className="w-4 h-4 text-emerald-600" />
              <span>{t.themeContrastLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleContrastChange('normal')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium text-center transition-all ${
                  settings.contrastMode === 'normal'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>{t.themeDefault}</span>
              </button>

              <button
                onClick={() => handleContrastChange('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium text-center transition-all ${
                  settings.contrastMode === 'dark'
                    ? 'border-emerald-500 bg-slate-800 text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span>{t.themeDark}</span>
              </button>

              <button
                onClick={() => handleContrastChange('high-contrast')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 text-xs font-bold text-center transition-all ${
                  settings.contrastMode === 'high-contrast'
                    ? 'border-yellow-400 bg-black text-yellow-300 shadow-md ring-2 ring-yellow-400'
                    : 'border-yellow-500/50 bg-black text-yellow-300 hover:bg-neutral-900'
                }`}
              >
                <Eye className="w-5 h-5 text-yellow-300" />
                <span>{t.themeHighContrast}</span>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2.5">
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{t.languageLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { code: 'id', name: 'Bahasa Indonesia', badge: 'Nasional' },
                  { code: 'en', name: 'English', badge: 'Global' },
                  { code: 'kt', name: 'Basa Kutai', badge: 'Dialek Kutim' },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    settings.language === lang.code
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {settings.language === lang.code && (
                    <Check className="w-4 h-4 text-emerald-600 absolute top-2 right-2" />
                  )}
                  <div className="text-xs font-bold">{lang.name}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{lang.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sound / TTS Assist Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-semibold">{t.audioAssistLabel}</h3>
                <p className="text-xs opacity-75 mt-0.5 max-w-sm">{t.audioAssistDesc}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={handleSoundToggle}
              className={`w-13 h-7 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetSettings}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            {t.saveClose}
          </button>
        </div>
      </div>
    </div>
  );
};
