import React, { useState, useRef, useEffect } from 'react';
import { AccessibilitySettings } from '../types';
import { EDUCATION_MODULES } from '../data/educationData';
import { translations } from '../data/translations';
import { USER_VIDEO_CONFIG } from '../data/videoConfig';
import {
  Flame,
  Wind,
  Droplets,
  Calculator,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Beaker,
  Clock,
  HelpCircle,
  FileCheck2,
  Video,
  ExternalLink,
  Upload,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  ShieldCheck,
  Film,
  Check,
} from 'lucide-react';

interface EducationHubProps {
  settings: AccessibilitySettings;
}

export const EducationHub: React.FC<EducationHubProps> = ({ settings }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('dangers_of_burning');
  
  // Interactive Eco-Enzyme Calculator state
  const [containerLiters, setContainerLiters] = useState<number>(5);

  // HTML5 Video Player state for User's own Educational Video
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(USER_VIDEO_CONFIG.videoSrc);
  const [googleDriveUrl, setGoogleDriveUrl] = useState<string>(USER_VIDEO_CONFIG.googleDriveUrl);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const [showConfigHelper, setShowConfigHelper] = useState<boolean>(false);
  const [inputVideoSrc, setInputVideoSrc] = useState<string>(USER_VIDEO_CONFIG.videoSrc);
  const [inputDriveUrl, setInputDriveUrl] = useState<string>(USER_VIDEO_CONFIG.googleDriveUrl);

  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';

  // 1 : 3 : 10 Formula calculation
  const waterLiters = (containerLiters * 0.6); // 60% capacity
  const waterMl = Math.round(waterLiters * 1000);
  const sugarGrams = Math.round(waterMl * 0.1); // 1 part sugar per 10 parts water
  const fruitPeelsGrams = Math.round(sugarGrams * 3); // 3 parts fruit peels

  const currentModule =
    EDUCATION_MODULES.find((m) => m.id === activeModuleId) || EDUCATION_MODULES[0];

  // Handle video element errors (source not found, format unsupported, network failure)
  const handleVideoError = () => {
    setIsVideoLoading(false);
    setVideoError(
      'Video tidak dapat diputar langsung di peramban (file belum tersedia di jalur penyimpanan atau format tidak didukung). Silakan tonton video melalui Google Drive di bawah.'
    );
  };

  const handleVideoLoadedData = () => {
    setIsVideoLoading(false);
    setVideoError(null);
  };

  // Optional local file preview for testing before hosting file
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setLocalFileName(file.name);
      setVideoError(null);
      setIsVideoLoading(true);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  const handleApplyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoSrc(inputVideoSrc);
    setGoogleDriveUrl(inputDriveUrl);
    setVideoError(null);
    setIsVideoLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight">{t.eduHubTitle}</h2>
        <p className="text-xs sm:text-sm opacity-75 mt-0.5">{t.eduHubSubtitle}</p>
      </div>

      {/* =========================================================================
          BAGIAN UTAMA: Video Edukasi Sampah (HTML5 Embedded Video Player)
          ========================================================================= */}
      <section
        id="video-edukasi-sampah"
        aria-label="Video Edukasi Sampah"
        className={`rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-md space-y-6 ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-700/80 text-slate-100 shadow-slate-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-100'
        }`}
      >
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Film className="w-5 h-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Video Edukasi Resmi
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Video Edukasi Sampah
            </h3>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-2xl">
              {USER_VIDEO_CONFIG.subtitle}
            </p>
          </div>

          {/* Badge Pemutar HTML5 */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold shrink-0 self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="block text-[11px] font-black uppercase tracking-wider">Pemutar HTML5 Langsung</span>
              <span className="block text-[10px] font-medium opacity-80">Format MP4 Asli & Cadangan Google Drive</span>
            </div>
          </div>
        </div>

        {/* Pemutar Video Utama (HTML5 Video Element) */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto flex items-center justify-center min-h-[300px] sm:min-h-[420px]">
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              onError={handleVideoError}
              onLoadedData={handleVideoLoadedData}
              onCanPlay={() => {
                setIsVideoLoading(false);
                setVideoError(null);
              }}
              poster="/logo.png"
              className="w-full h-auto max-h-[640px] rounded-2xl focus:outline-none"
            >
              <source src="/video otan_compressed (1).mp4" type="video/mp4" />
              <p className="p-6 text-center text-xs text-white">
                Browser Anda tidak mendukung pemutar video HTML5. Silakan tonton melalui Google Drive.
              </p>
            </video>

            {/* Pesan Ramah Ketika Terjadi Kesalahan Pemutaran / File Belum Dihosting */}
            {videoError && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 text-white z-10">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center ring-2 ring-rose-500/40">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h4 className="font-bold text-base sm:text-lg text-slate-100">
                    Video Belum Tersedia untuk Pemutaran Langsung
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {videoError}
                  </p>
                </div>

                {/* Tombol Cadangan Utama di Layar Error */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="https://drive.google.com/file/d/1JDvuwvJct2LWt7hlw89f8tv5wck_sfJZ/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Tonton Video di Google Drive</span>
                  </a>

                  <label className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer transition-colors border border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Uji File Video Lokal (MP4)</span>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={handleLocalFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Indikator File Lokal yang sedang diuji jika ada */}
          {localFileName && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Memutar file lokal terpilih: <strong>{localFileName}</strong></span>
              </span>
              <button
                onClick={() => {
                  setLocalFileName(null);
                  setVideoSrc(USER_VIDEO_CONFIG.videoSrc);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="text-[11px] underline font-bold hover:text-blue-900"
              >
                Kembalikan Sumber Default
              </button>
            </div>
          )}

          {/* ===================================================================
              2. TAUTAN GOOGLE DRIVE SEBAGAI CADANGAN (JELAS DI BAWAH PEMUTAR VIDEO)
              Sesuai persyaratan: Tampilkan secara jelas di bawah pemutar video sehingga
              pengunjung tetap dapat membukanya meskipun kegagalan pemutaran tidak terdeteksi
              oleh browser.
             =================================================================== */}
          <div
            className={`p-5 rounded-2xl border-2 transition-all ${
              isHighContrast
                ? 'bg-black text-yellow-300 border-yellow-300'
                : settings.contrastMode === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-slate-100'
                : 'bg-emerald-50/70 border-emerald-300 text-slate-900'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" />
                    <span>Tautan Cadangan Google Drive</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Akses Alternatif Resmi
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Jika pemutaran video langsung di atas mengalami kendala pada perangkat atau koneksi Anda, silakan tonton video melalui Google Drive:
                </p>
              </div>

              {/* Tautan Alternatif: "Tonton Video di Google Drive" */}
              <a
                href="https://drive.google.com/file/d/1JDvuwvJct2LWt7hlw89f8tv5wck_sfJZ/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Tonton Video di Google Drive</span>
              </a>
            </div>
          </div>

          {/* Informasi Panduan Konfigurasi Sumber Video bagi Pengelola Website */}
          <div className="pt-2">
            <button
              onClick={() => setShowConfigHelper(!showConfigHelper)}
              className="text-[11px] font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showConfigHelper ? 'Sembunyikan Panduan Konfigurasi Video' : 'Lihat Lokasi & Cara Mengatur Link Video / Google Drive'}</span>
            </button>

            {showConfigHelper && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Lokasi Konfigurasi File Video & Tautan Google Drive:
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    <strong>File Konfigurasi Utama:</strong> Buka file <code>src/data/videoConfig.ts</code> di proyek ini.
                  </li>
                  <li>
                    <strong>Untuk Tautan Google Drive:</strong> Masukkan URL tautan berbagi Drive Anda pada baris <code>googleDriveUrl: 'https://drive.google.com/...'</code>. Pastikan pengaturan izin akses Google Drive disetel ke <em>"Siapa saja yang memiliki tautan"</em>.
                  </li>
                  <li>
                    <strong>Untuk Pemutaran Langsung (HTML5):</strong> Simpan file MP4 Anda di folder <code>public/</code> (contoh: <code>public/video-edukasi-sampah.mp4</code>) lalu atur <code>videoSrc: '/video-edukasi-sampah.mp4'</code>, ATAU masukkan URL file MP4 langsung dari server/hosting penyimpanan Anda.
                  </li>
                </ol>

                {/* Form Uji Cepat di Peramban */}
                <form onSubmit={handleApplyConfig} className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300">
                    Atau Uji Coba Langsung di Peramban Ini:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">URL Video Langsung (MP4):</label>
                      <input
                        type="text"
                        value={inputVideoSrc}
                        onChange={(e) => setInputVideoSrc(e.target.value)}
                        placeholder="Contoh: /video-edukasi-sampah.mp4 atau URL https://..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Tautan Google Drive:</label>
                      <input
                        type="text"
                        value={inputDriveUrl}
                        onChange={(e) => setInputDriveUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    Terapkan Pengujian
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Module Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {EDUCATION_MODULES.map((module) => {
          const isActive = activeModuleId === module.id;
          return (
            <button
              key={module.id}
              onClick={() => setActiveModuleId(module.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? isHighContrast
                    ? 'border-yellow-300 bg-yellow-400 text-black font-black'
                    : 'border-emerald-600 bg-emerald-50/80 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-sm'
                  : isHighContrast
                  ? 'border-yellow-500/50 bg-black text-yellow-300 hover:bg-neutral-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {module.badge}
                </span>
                <span className="text-[10px] opacity-60 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.readTime}
                </span>
              </div>
              <h3 className="text-sm font-bold leading-snug">
                {module.title[settings.language] || module.title.id}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Module Detailed View */}
      <div
        className={`rounded-2xl p-6 border transition-colors shadow-sm space-y-6 ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Module Title Banner */}
        <div className="space-y-1.5 border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
            {currentModule.badge}
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            {currentModule.title[settings.language] || currentModule.title.id}
          </h3>
          <p className="text-xs sm:text-sm opacity-80">
            {currentModule.subtitle[settings.language] || currentModule.subtitle.id}
          </p>
        </div>

        {/* Intro */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm leading-relaxed border border-slate-200/50 dark:border-slate-700/50">
          {currentModule.content.intro[settings.language] || currentModule.content.intro.id}
        </div>

        {/* 3 Key Scientific Points */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Fakta Ilmiah & Dampak Nyata</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentModule.content.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 space-y-2 text-xs flex flex-col justify-between"
              >
                <div>
                  {point.stat && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 mb-2">
                      {point.stat}
                    </span>
                  )}
                  <h5 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                    {point.title[settings.language] || point.title.id}
                  </h5>
                  <p className="opacity-80 leading-relaxed mt-1">
                    {point.description[settings.language] || point.description.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chemical Insight Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/25 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
            <Beaker className="w-4 h-4" />
            <span>Wawasan Kimia Lingkungan:</span>
            {currentModule.content.scientificInsight.chemicalFormula && (
              <code className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-mono text-[11px]">
                {currentModule.content.scientificInsight.chemicalFormula}
              </code>
            )}
          </div>
          <p className="leading-relaxed opacity-90">
            {currentModule.content.scientificInsight.explanation[settings.language] ||
              currentModule.content.scientificInsight.explanation.id}
          </p>
        </div>

        {/* Practical Call to Action */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-3">
          <Sparkles className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Aksi Nyata yang Dapat Anda Lakukan Sekarang:</span>
            <p>
              {currentModule.content.practicalAction[settings.language] ||
                currentModule.content.practicalAction.id}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Eco-Enzyme Calculator Component */}
      <div
        className={`rounded-2xl p-6 border transition-colors shadow-sm ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Kalkulator Eco-Enzyme Skala Rumah Tangga</h3>
              <p className="text-xs opacity-75">
                Hitung takaran eksak berdasarkan wadah yang Anda miliki (Rasio Emas 1 : 3 : 10)
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            Fermentasi 90 Hari Bebas Kimia
          </span>
        </div>

        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Controls */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1.5">
                Pilih Ukuran Wadah Plastik Anda:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { liters: 3, label: '3 Liter (Botol)' },
                  { liters: 5, label: '5 Liter (Galon Mini)' },
                  { liters: 10, label: '10 Liter (Ember)' },
                  { liters: 15, label: '15 Liter (Jerigen)' },
                  { liters: 20, label: '20 Liter (Tong Kecil)' },
                  { liters: 50, label: '50 Liter (Tong Biru)' },
                ].map((preset) => (
                  <button
                    key={preset.liters}
                    onClick={() => setContainerLiters(preset.liters)}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      containerLiters === preset.liters
                        ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">
                Atau Ketik Volume Wadah (Liter):
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={containerLiters}
                onChange={(e) => setContainerLiters(Math.max(1, Number(e.target.value)))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-sm"
              />
              <p className="text-[11px] opacity-70 mt-1">
                *Catatan: Isi maksimal 80% volume wadah agar tersisa ruang gas fermentasi.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] space-y-1">
              <span className="font-bold block">Kulit Buah Terbaik:</span>
              <p className="opacity-80">
                Kulit nanas, jeruk manis/limau, apel, pepaya mengkal, dan semangka. Hindari kulit buah berulat atau berminyak seperti durian/alpukat.
              </p>
            </div>
          </div>

          {/* Computed Results Panel */}
          <div className="lg:col-span-7 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-5 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block mb-3">
                Resep Takaran Presisi:
              </span>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-bold opacity-60 uppercase block">1 Bagian</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-600 block my-1">
                    {sugarGrams} gr
                  </span>
                  <span className="text-xs font-semibold">Gula Merah / Molase</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-bold opacity-60 uppercase block">3 Bagian</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 block my-1">
                    {fruitPeelsGrams} gr
                  </span>
                  <span className="text-xs font-semibold">Kulit Buah Segar</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-bold opacity-60 uppercase block">10 Bagian</span>
                  <span className="text-xl sm:text-2xl font-black text-cyan-600 block my-1">
                    {waterLiters.toFixed(1)} L
                  </span>
                  <span className="text-xs font-semibold">Air Bersih ({waterMl} ml)</span>
                </div>
              </div>

              {/* Step Checklist */}
              <div className="mt-5 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Hari ke 1-7:</strong> Buka tutup wadah 1x sehari untuk membuang gas fermentasi berlebih.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Bulan ke 1:</strong> Muncul lapisan jamur putih halus (Pitera baik) yang menyehatkan kulit.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Hari ke 90:</strong> Panen! Saring cairan cokelat bening beraroma segar buah untuk pel lantai & semprot udara.</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-[11px] text-teal-700 dark:text-teal-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>1 wadah {containerLiters} liter ini menyelamatkan {fruitPeelsGrams} gram sampah organik dari timbunan metana TPA!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Educational Reference Box */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Sumber Referensi & Modul Edukasi Lingkungan:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
          Modul Pengelolaan Sampah Mandiri Dinas Lingkungan Hidup (DLH) Kabupaten Kutai Timur, Panduan Baku Mutu Udara WHO 2021, dan Riset Fermentasi Organik Dr. Rosukon Poompanvong (Founder Eco-Enzyme).
        </p>
      </div>
    </div>
  );
};
