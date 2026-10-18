import React, { useState } from 'react';
import { AirQualitySummary, AccessibilitySettings } from '../types';
import { translations } from '../data/translations';
import { playSpeech, stopSpeech, isSpeaking } from '../utils/speech';
import {
  Wind,
  Activity,
  AlertCircle,
  Shield,
  HeartPulse,
  Baby,
  Users,
  Volume2,
  VolumeX,
  Gauge,
  Thermometer,
  Droplets,
  CloudSun,
  Info,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface AirQualityPanelProps {
  airQuality: AirQualitySummary;
  settings: AccessibilitySettings;
}

export const AirQualityPanel: React.FC<AirQualityPanelProps> = ({
  airQuality,
  settings,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';

  const handleAudioPlayback = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      const summaryText = `${t.airQualityTitle}. Nilai ISPU saat ini adalah ${airQuality.overallIspu}, berstatus ${t.airUnhealthy}. Parameter dominan adalah ${airQuality.dominantPollutant}. PM2.5 tercatat ${airQuality.pm25} mikrogram per meter kubik, dan PM10 sebesar ${airQuality.pm10}. Disarankan memakai masker jika keluar rumah dan jangan membakar sampah!`;

      playSpeech(
        summaryText,
        settings.language,
        () => setIsPlaying(true),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  const pollutants = [
    {
      name: 'PM2.5',
      fullName: 'Partikulat Sangat Halus (Asap & Jelaga)',
      value: airQuality.pm25,
      unit: 'µg/m³',
      status: 'Tidak Sehat',
      statusColor: 'text-rose-500',
      standard: 'Baku Mutu: 15 µg/m³ (WHO)',
      desc: 'Dihasilkan dari pembakaran sampah plastik & semak belukar. Menembus saluran pernapasan terdalam.',
    },
    {
      name: 'PM10',
      fullName: 'Partikulat Kasar (Debu Jalanan & Abu)',
      value: airQuality.pm10,
      unit: 'µg/m³',
      status: 'Sedang',
      statusColor: 'text-amber-500',
      standard: 'Baku Mutu: 45 µg/m³',
      desc: 'Debu terbawa angin kencang dan abu sisa kebakaran lahan.',
    },
    {
      name: 'CO',
      fullName: 'Karbon Monoksida',
      value: airQuality.co,
      unit: 'mg/m³',
      status: 'Baik',
      statusColor: 'text-emerald-500',
      standard: 'Baku Mutu: 10 mg/m³',
      desc: 'Gas tanpa warna dan bau akibat pembakaran tidak sempurna.',
    },
    {
      name: 'NO₂',
      fullName: 'Nitrogen Dioksida',
      value: airQuality.no2,
      unit: 'µg/m³',
      status: 'Baik',
      statusColor: 'text-emerald-500',
      standard: 'Baku Mutu: 50 µg/m³',
      desc: 'Berasal dari pembakaran suhu tinggi dan emisi kendaraan transportasi.',
    },
    {
      name: 'O₃',
      fullName: 'Ozon Permukaan',
      value: airQuality.o3,
      unit: 'µg/m³',
      status: 'Sedang',
      statusColor: 'text-amber-500',
      standard: 'Baku Mutu: 100 µg/m³',
      desc: 'Terbentuk saat polutan bereaksi dengan sinar matahari terik Kutai Timur.',
    },
    {
      name: 'SO₂',
      fullName: 'Sulfur Dioksida',
      value: airQuality.so2,
      unit: 'µg/m³',
      status: 'Baik',
      statusColor: 'text-emerald-500',
      standard: 'Baku Mutu: 40 µg/m³',
      desc: 'Senyawa belerang dari aktivitas industri energi dan pembakaran.',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header section with Audio Voice Reader */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{t.airQualityTitle}</h2>
          <p className="text-xs sm:text-sm opacity-75 mt-0.5">{t.airQualitySubtitle}</p>
        </div>

        <button
          onClick={handleAudioPlayback}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isPlaying
              ? 'bg-rose-600 text-white animate-pulse'
              : isHighContrast
              ? 'border-2 border-yellow-300 bg-black text-yellow-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t.stopReading}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{t.readAloud}</span>
            </>
          )}
        </button>
      </div>

      {/* Main ISPU Gauge & Weather Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Big ISPU Gauge Box */}
        <div
          className={`md:col-span-6 rounded-3xl p-6 border-2 flex flex-col justify-between transition-colors shadow-lg ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-300'
              : settings.contrastMode === 'dark'
              ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-slate-950/60'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                Pusat Kendali Sangatta
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{airQuality.lastUpdated}</span>
            </div>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-6xl font-black tracking-tighter text-rose-600 dark:text-rose-500">
                {airQuality.overallIspu}
              </span>
              <div>
                <span className="text-xl font-black block text-slate-900 dark:text-white">{t.airUnhealthy}</span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Rentang Indeks: 101 - 200 (Tidak Sehat)</span>
              </div>
            </div>

            {/* Scale Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-[11px] font-black text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500">0 Baik</span>
                <span className="text-amber-500">50 Sedang</span>
                <span className="text-rose-500">100 Tdk Sehat</span>
                <span className="text-purple-500">200 Sgt Tdk Sehat</span>
                <span className="text-red-700">300+ Bahaya</span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex ring-1 ring-slate-300 dark:ring-slate-600">
                <div style={{ width: '16.6%' }} className="bg-emerald-500 h-full" />
                <div style={{ width: '16.6%' }} className="bg-amber-400 h-full" />
                <div style={{ width: '33.3%' }} className="bg-rose-500 h-full relative">
                  {/* Current marker */}
                  <div className="w-2.5 h-full bg-white ring-2 ring-black mx-auto shadow-md" />
                </div>
                <div style={{ width: '16.6%' }} className="bg-purple-600 h-full" />
                <div style={{ width: '16.9%' }} className="bg-red-900 h-full" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
            <strong className="text-slate-900 dark:text-white">Parameter Dominan:</strong> {airQuality.dominantPollutant}. Partikel asap hasil karhutla dan pembakaran sampah rumah tangga mendominasi langit Kutai Timur saat ini.
          </div>
        </div>

        {/* Weather Conditions in Kutim */}
        <div
          className={`md:col-span-6 rounded-3xl p-6 border-2 flex flex-col justify-between transition-colors shadow-lg ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-300'
              : settings.contrastMode === 'dark'
              ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-slate-950/60'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-emerald-600" />
              <span>Dinamika Cuaca & Atmosfer Kutai Timur</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-1.5 text-xs opacity-75">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  Suhu Permukaan
                </span>
                <span className="text-xl font-black mt-1 block">33.4°C</span>
                <span className="text-[10px] opacity-60">Terik Siang Hari</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-1.5 text-xs opacity-75">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  Kelembapan Relatif
                </span>
                <span className="text-xl font-black mt-1 block">56%</span>
                <span className="text-[10px] opacity-60">Gambut Mudah Terbakar</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-1.5 text-xs opacity-75">
                  <Wind className="w-3.5 h-3.5 text-indigo-500" />
                  Kecepatan Angin
                </span>
                <span className="text-xl font-black mt-1 block">15 km/jam</span>
                <span className="text-[10px] opacity-60">Mendorong Asap ke Barat</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-1.5 text-xs opacity-75">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  Arah Hembusan
                </span>
                <span className="text-xl font-black mt-1 block">Tenggara (SE)</span>
                <span className="text-[10px] opacity-60">Dari Pesisir Selat Makassar</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs leading-relaxed border border-amber-500/20">
            <strong>Kondisi Kritis:</strong> Angin tenggara berkecepatan 15 km/jam membawa asap pembakaran dari Bengalon menuju Sangatta Utara. Jangan menambah asap dengan membakar sampah!
          </div>
        </div>
      </div>

      {/* 6 Pollutant Detailed Cards */}
      <div>
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Rincian 6 Parameter Pencemar Udara</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pollutants.map((p) => (
            <div
              key={p.name}
              className={`p-4 rounded-xl border transition-all hover:shadow-xs ${
                isHighContrast
                  ? 'bg-black border-yellow-300 text-yellow-300'
                  : settings.contrastMode === 'dark'
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-black tracking-tight">{p.name}</span>
                  <p className="text-[11px] opacity-75">{p.fullName}</p>
                </div>
                <span className={`text-xs font-bold ${p.statusColor}`}>{p.status}</span>
              </div>

              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-black">{p.value}</span>
                <span className="text-xs opacity-70 font-semibold">{p.unit}</span>
              </div>

              <p className="text-[11px] opacity-75 leading-relaxed">{p.desc}</p>
              <div className="mt-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {p.standard}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Advisory Guidelines */}
      <div
        className={`rounded-2xl p-6 border transition-colors shadow-sm ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>Panduan Perlindungan Diri Menurut Kelompok Rentan</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
              <Baby className="w-4 h-4" />
              <span>Anak-Anak, Balita, & Ibu Hamil</span>
            </div>
            <p className="leading-relaxed text-slate-700 dark:text-slate-200">
              Saluran pernapasan anak masih dalam tahap pertumbuhan. Batasi bermain di luar ruangan antara pukul 11:00 - 16:00 WITA saat konsentrasi partikel asap tertinggi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <HeartPulse className="w-4 h-4" />
              <span>Lansia & Penderita Asma / ISPA</span>
            </div>
            <p className="leading-relaxed text-slate-700 dark:text-slate-200">
              Sediakan obat pelega pernapasan (inhaler) jika memiliki riwayat asma. Gunakan masker medis atau respirator N95 bila terpaksa bepergian melintasi zona merah karhutla.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <Users className="w-4 h-4" />
              <span>Pekerja Lapangan & Warga Umum</span>
            </div>
            <p className="leading-relaxed text-slate-700 dark:text-slate-200">
              Banyak minum air putih (minimal 2,5 liter) untuk membilas tenggorokan dari jelaga. Bersihkan ventilasi rumah dan laporkan segera setiap ada warga membakar sampah liar.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive ISPU Category Educational Matrix */}
      <div
        className={`rounded-2xl p-6 border transition-colors shadow-sm ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold">
            Memahami Indeks Standar Pencemar Udara (ISPU) - Permen LHK No. 14 Tahun 2020
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mb-4">
          ISPU adalah angka tanpa satuan yang digunakan untuk menggambarkan kondisi kualitas udara ambien di lokasi tertentu, didasarkan pada dampaknya terhadap kesehatan manusia, nilai estetika, dan makhluk hidup lainnya.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-emerald-700 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0 - 50: Baik</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              Tingkat kualitas udara sangat baik, tidak memberikan dampak negatif terhadap manusia, hewan, maupun tumbuhan.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-amber-700 dark:text-amber-300 text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>51 - 100: Sedang</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              Tidak berpengaruh pada kesehatan manusia atau hewan umum, namun kelompok sangat sensitif disarankan mengurangi aktivitas berat luar ruang.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-rose-700 dark:text-rose-300 text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>101 - 200: Tidak Sehat</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              Mulai merugikan kesehatan pada kelompok rentan (lansia, balita, penderita asma/paru-paru). Wajib kenakan masker pelindung.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-500/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-purple-700 dark:text-purple-300 text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>201 - 300: Sangat Tidak Sehat</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              Kualitas udara dapat meningkatkan sensitivitas pada seluruh populasi. Segera tutup jendela dan gunakan pembersih udara di dalam ruangan.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-red-700/40 bg-red-700/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-red-700 dark:text-red-400 text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>301+: Berbahaya</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              Kondisi darurat kabut asap karhutla parah. Seluruh populasi berisiko mengalami gangguan pernapasan serius. Evakuasi kelompok rentan.
            </p>
          </div>
        </div>
      </div>

      {/* Official Data Source Attribution Footer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Sumber Informasi & Pemantauan Resmi:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
          <div>&bull; Stasiun AQMS Dinas Lingkungan Hidup Kab. Kutai Timur</div>
          <div>&bull; BMKG Stasiun Meteorologi Temindung / Berau</div>
          <div>&bull; Satelit NASA Terra, Aqua & Suomi-NPP (FIRMS)</div>
          <div>&bull; Pusat Pengendalian Operasi (Pusdalops) BPBD Kutai Timur</div>
        </div>
      </div>
    </div>
  );
};
