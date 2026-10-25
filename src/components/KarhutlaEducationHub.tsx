import React, { useState, useRef } from 'react';
import { AccessibilitySettings } from '../types';
import { translations } from '../data/translations';
import {
  KARHUTLA_VIDEO_CONFIG,
  BPBD_LEADER_PROFILE,
  KARHUTLA_HEALTH_GUIDELINES,
  KARHUTLA_QUIZ_QUESTIONS,
} from '../data/karhutlaData';
import { getRealtimeSyncMeta } from '../utils/realtimeUpdate';
import kepalaBpbdImg from '../assets/images/kepala_bpbd_kutim_1792932085987.jpg';
import {
  Flame,
  ShieldAlert,
  Phone,
  ExternalLink,
  Play,
  CheckCircle,
  Wind,
  MapPin,
  Clock,
  AlertTriangle,
  Upload,
  RefreshCw,
  Award,
  HelpCircle,
  FileCheck2,
  FolderOpen,
  MessageCircle,
  Radio,
  BookOpen,
  Check,
  X,
  Quote,
  ShieldCheck,
  Info,
  PhoneCall,
  Activity,
  Layers,
} from 'lucide-react';

interface KarhutlaEducationHubProps {
  settings: AccessibilitySettings;
  onOpenReport?: () => void;
}

export const KarhutlaEducationHub: React.FC<KarhutlaEducationHubProps> = ({
  settings,
  onOpenReport,
}) => {
  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';
  const syncMeta = getRealtimeSyncMeta();

  // Video State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(KARHUTLA_VIDEO_CONFIG.videoSrc);
  const [googleDriveUrl, setGoogleDriveUrl] = useState<string>(KARHUTLA_VIDEO_CONFIG.googleDriveFullHdUrl);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [localVideoName, setLocalVideoName] = useState<string | null>(null);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Video Handlers
  const handleVideoError = () => {
    setVideoError(
      'File video edukasi Karhutla belum tersedia di server hosting atau format belum didukung browser. Anda dapat menonton dan mengunduh versi Full HD langsung di Google Drive melalui tombol di bawah.'
    );
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setLocalVideoName(file.name);
      setVideoError(null);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  // Quiz Handlers
  const handleSelectOption = (questionId: number, key: 'A' | 'B' | 'C' | 'D') => {
    if (isQuizSubmitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: key }));
  };

  const handleCalculateScore = () => {
    let correctCount = 0;
    KARHUTLA_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctKey) {
        correctCount += 1;
      }
    });
    const calculated = Math.round((correctCount / KARHUTLA_QUIZ_QUESTIONS.length) * 100);
    setQuizScore(calculated);
    setIsQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(0);
  };

  const allAnswered =
    KARHUTLA_QUIZ_QUESTIONS.length > 0 &&
    KARHUTLA_QUIZ_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="w-full space-y-8">
      {/* 1. Header Banner & Live Sync Status Indicator */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 font-black text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>PANDUAN MITIGASI RESMI</span>
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Kabupaten Kutai Timur
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Edukasi Karhutla & Kesiapsiagaan Bencana
            </h2>
            <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-3xl leading-relaxed">
              Panduan terpadu pencegahan kebakaran hutan dan lahan, protokol perlindungan dari asap PM2.5, profil arahan Kepala BPBD Kutim, serta kuis interaktif cepat tanggap.
            </p>
          </div>

          {/* Real-Time Sync Indicator Widget (05:00 WITA & NASA FIRMS) */}
          <div
            className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 shadow-xs shrink-0 self-start md:self-auto ${
              isHighContrast
                ? 'bg-black text-yellow-300 border-yellow-300'
                : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-black">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>Terhubung ke Live Satellite Feed NASA FIRMS</span>
            </div>
            <div className="text-[11px] opacity-90 leading-tight">
              <div>Pembaruan Terjadwal: <strong>Setiap hari pukul 05:00 WITA</strong></div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold mt-0.5">
                Sinkronisasi Terakhir: {syncMeta.lastUpdatedFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pemutar Video Edukasi Karhutla (HTML5 & Google Drive Backup) */}
      <section
        aria-label="Pemutar Video Edukasi Karhutla"
        className={`rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-md space-y-6 ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-700/80 text-slate-100 shadow-slate-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-100'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Play className="w-4 h-4 fill-current" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Video Edukasi Karhutla (Durasi: {KARHUTLA_VIDEO_CONFIG.duration})
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {KARHUTLA_VIDEO_CONFIG.title}
            </h3>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-2xl">
              {KARHUTLA_VIDEO_CONFIG.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
            <Clock className="w-4 h-4 text-rose-500" />
            <span>3 Menit 32 Detik</span>
          </div>
        </div>

        {/* Pemutar Video HTML5 */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto flex items-center justify-center min-h-[300px] sm:min-h-[440px]">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              onError={handleVideoError}
              poster="/logo.png"
              className="w-full h-auto max-h-[640px] rounded-2xl focus:outline-none"
            >
              <source src={videoSrc} type="video/mp4" />
              <source src="/edukasi-karhutla-compressed.mp4" type="video/mp4" />
              <p className="p-6 text-center text-xs text-white">
                Browser Anda tidak mendukung pemutar video HTML5. Silakan tonton video melalui Google Drive di bawah ini.
              </p>
            </video>

            {/* Error Overlay Ramah jika file belum di-host */}
            {videoError && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 text-white z-10">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center ring-2 ring-rose-500/40">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h4 className="font-bold text-base sm:text-lg text-slate-100">
                    Video Siap Ditonton di Google Drive
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {videoError}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={googleDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Video Full HD di Google Drive</span>
                  </a>

                  <label className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer transition-colors border border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-rose-400" />
                    <span>Uji File (edukasi-karhutla-compressed.mp4)</span>
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

          {/* Indikator file lokal terpilih */}
          {localVideoName && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Memutar file lokal: {localVideoName}</span>
              </span>
              <button
                onClick={() => {
                  setLocalVideoName(null);
                  setVideoSrc(KARHUTLA_VIDEO_CONFIG.videoSrc);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="text-[11px] underline font-bold"
              >
                Kembalikan Sumber Default
              </button>
            </div>
          )}

          {/* Tautan Cadangan Google Drive yang selalu terlihat jelas di bawah pemutar */}
          <div
            className={`p-5 rounded-2xl border-2 transition-all ${
              isHighContrast
                ? 'bg-black text-yellow-300 border-yellow-300'
                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/60 text-slate-900 dark:text-slate-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" />
                    <span>Tautan Cadangan Google Drive (Kualitas Penuh Full HD)</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                    Resolusi Asli 1080p
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Pengguna yang ingin mengunduh atau menonton video edukasi Karhutla dalam resolusi tinggi tanpa kompresi dapat langsung membuka penyimpanan Google Drive resmi:
                </p>
              </div>

              <a
                href={googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02] shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Tonton Video di Google Drive</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Profil & Ulasan Resmi Kepala BPBD Kutai Timur */}
      <section
        aria-label="Profil Kepala BPBD Kutai Timur"
        className={`rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-md ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-700/80 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
          {/* Foto Profil Resmi */}
          <div className="relative shrink-0 text-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden ring-4 ring-rose-500/30 shadow-2xl bg-slate-800 mx-auto">
              <img
                src={kepalaBpbdImg}
                alt={BPBD_LEADER_PROFILE.name}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pejabat Resmi Kutim</span>
            </div>
          </div>

          {/* Keterangan & Kotak Kutipan Sambutan Resmi */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                {BPBD_LEADER_PROFILE.agency}
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
                {BPBD_LEADER_PROFILE.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold opacity-75 mt-0.5">
                {BPBD_LEADER_PROFILE.title} &bull; {BPBD_LEADER_PROFILE.location}
              </p>
            </div>

            {/* Badges Kelembagaan */}
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
              {BPBD_LEADER_PROFILE.officialBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Kotak Kutipan Resmi */}
            <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent border border-rose-500/25 text-left space-y-2.5">
              <Quote className="w-8 h-8 text-rose-500/40 absolute top-4 right-4 -scale-x-100" />
              <div className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <span>Sambutan Resmi & Arahan Mitigasi:</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-medium italic">
                "{BPBD_LEADER_PROFILE.officialStatement}"
              </p>
              <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-rose-700 dark:text-rose-300">
                <span>Semboyan: "{BPBD_LEADER_PROFILE.callout}"</span>
                <span>Hotline Siaga: (0549) 21113</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Materi Edukasi Bahaya Asap & Partikel PM2.5 */}
      <section aria-label="Materi Edukasi Bahaya Asap dan Gambut" className="space-y-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Materi Edukasi Bahaya Asap & Partikel PM2.5
          </h3>
          <p className="text-xs sm:text-sm opacity-80 mt-0.5">
            Dampak terhadap pernapasan manusia, kehancuran lahan gambut lokal, serta protokol masker bersertifikasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {KARHUTLA_HEALTH_GUIDELINES.map((guide, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition-all shadow-sm ${
                isHighContrast
                  ? 'bg-black text-yellow-300 border-yellow-300'
                  : settings.contrastMode === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {guide.badge}
                </span>
                <h4 className="text-base font-extrabold leading-snug">
                  {guide.title}
                </h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {guide.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Poin Utama:
                  </span>
                  {guide.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-tight opacity-90">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Mini-Game Interaktif: Kuis Cepat Tanggap Karhutla */}
      <section
        aria-label="Mini Game Kuis Cepat Tanggap Karhutla"
        className={`rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-md space-y-6 ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>MINI-GAME INTERAKTIF</span>
              </span>
              <span className="text-xs font-bold text-slate-500">Uji Kesiapsiagaan Anda</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Kuis Cepat Tanggap Karhutla
            </h3>
            <p className="text-xs sm:text-sm opacity-80">
              Jawab 3 pertanyaan seputar tindakan darurat, bahaya PM2.5, dan alat pelindung diri untuk melihat skor kesiapsiagaan Anda.
            </p>
          </div>

          {isQuizSubmitted && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase block opacity-75">Skor Akhir Anda</span>
                <span className="text-2xl font-black">{quizScore} / 100</span>
              </div>
              <button
                onClick={handleResetQuiz}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 shadow-xs transition-colors"
                title="Ulangi Kuis"
              >
                <RefreshCw className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          )}
        </div>

        {/* Daftar 3 Pertanyaan */}
        <div className="space-y-6">
          {KARHUTLA_QUIZ_QUESTIONS.map((q, idx) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = isQuizSubmitted && userAnswer === q.correctKey;
            const isWrong = isQuizSubmitted && userAnswer !== undefined && userAnswer !== q.correctKey;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isQuizSubmitted
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                    <span className="text-rose-600 dark:text-rose-400 mr-2">#{idx + 1}.</span>
                    {q.question}
                  </h4>
                  {isQuizSubmitted && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isCorrect ? 'Benar (+33 Poin)' : 'Kurang Tepat'}
                    </span>
                  )}
                </div>

                {/* Pilihan Ganda */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.key;
                    const isTheCorrectOne = isQuizSubmitted && opt.key === q.correctKey;

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(q.id, opt.key)}
                        disabled={isQuizSubmitted}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-start gap-2.5 ${
                          isQuizSubmitted
                            ? isTheCorrectOne
                              ? 'border-emerald-500 bg-emerald-100 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-100 font-bold'
                              : isSelected
                              ? 'border-rose-400 bg-rose-100 text-rose-950 dark:bg-rose-900/60 dark:text-rose-100'
                              : 'opacity-50 border-slate-200 dark:border-slate-700'
                            : isSelected
                            ? 'border-rose-600 bg-rose-600 text-white font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-rose-400'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                            isSelected && !isQuizSubmitted
                              ? 'bg-white text-rose-600'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="leading-tight flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Pembahasan jika sudah disubmit */}
                {isQuizSubmitted && (
                  <div className="mt-3.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Pembahasan Edukasi:
                    </span>
                    <p className="opacity-90 text-slate-600 dark:text-slate-300">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tombol Hitung Skor & Evaluasi */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
          {!isQuizSubmitted ? (
            <button
              onClick={handleCalculateScore}
              disabled={!allAnswered}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs transition-all ${
                allAnswered
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 hover:scale-[1.01]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {allAnswered ? 'Kirim Jawaban & Hitung Skor Otomatis' : 'Jawab Semua 3 Pertanyaan Dahulu'}
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                {quizScore === 100 && (
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Luar Biasa! Skor Sempurna 100/100 — Anda adalah Warga Siaga Karhutla Teladan Kutim!</span>
                  </span>
                )}
                {quizScore >= 66 && quizScore < 100 && (
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Bagus Sekali! Skor {quizScore}/100 — Pemahaman mitigasi Anda sudah sangat mumpuni.</span>
                  </span>
                )}
                {quizScore < 66 && (
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    <span>Skor {quizScore}/100 — Pelajari kembali panduan di atas untuk memperkuat kewaspadaan.</span>
                  </span>
                )}
              </div>

              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Pembaruan Kontak Darurat & Pengembang Terpadu (Clickable tel: & wa.me) */}
      <section
        aria-label="Kontak Darurat dan Pengembang"
        className={`p-6 rounded-3xl border-2 transition-all ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : 'bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 text-white shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
              Posko Siaga Karhutla & Kontak Pengembang
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Butuh Bantuan Cepat atau Laporkan Titik Api?
            </h3>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
              Hubungi langsung nomor darurat resmi BPBD & Damkar Kutim, atau hubungi kontak Pengembang SI OTAN Kutim melalui telepon dan WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Kontak Pengembang WhatsApp & Telepon */}
            <a
              href="https://wa.me/6282258451435?text=Halo%20Pengembang%20SI%20OTAN%20Kutim%2C%20saya%20ingin%20berkonsultasi%20atau%20melaporkan%20data"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs sm:text-sm shadow-lg transition-transform hover:scale-[1.02]"
              title="Chat WhatsApp Pengembang SI OTAN Kutim: 082258451435"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Pengembang (082258451435)</span>
            </a>

            <a
              href="tel:082258451435"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-colors"
              title="Telepon Pengembang SI OTAN Kutim: 082258451435"
            >
              <Phone className="w-4 h-4" />
              <span>Telp: 0822-5845-1435</span>
            </a>

            {/* BPBD Kutai Timur */}
            <a
              href="tel:054921113"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white text-rose-800 hover:bg-rose-50 font-black text-xs transition-colors shadow-md"
              title="Telepon BPBD Kutim: (0549) 21113"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>BPBD: (0549) 21113</span>
            </a>

            {/* Damkar 113 */}
            <a
              href="tel:113"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-black/30 hover:bg-black/50 text-white font-black text-xs transition-colors"
              title="Telepon Damkar Bebas Pulsa 113"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Damkar: 113</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. Sumber Resmi Metadata */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Sumber Informasi Terverifikasi:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
          Badan Penanggulangan Bencana Daerah (BPBD) Kabupaten Kutai Timur, Dinas Pemadam Kebakaran dan Penyelamatan (Disdamkartan) Kutim, NASA FIRMS (Fire Information for Resource Management System VIIRS/MODIS), dan SIPONGI Kementerian Lingkungan Hidup dan Kehutanan (KLHK) RI.
        </p>
      </div>
    </div>
  );
};
