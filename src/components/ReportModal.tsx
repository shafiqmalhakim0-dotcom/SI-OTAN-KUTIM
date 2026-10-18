import React, { useState } from 'react';
import { CitizenReport, AccessibilitySettings, DistrictData } from '../types';
import { translations } from '../data/translations';
import {
  X,
  Flame,
  Camera,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Navigation,
  FileText,
  User,
  Phone,
  Sparkles,
  FileCheck2,
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: DistrictData[];
  prefilledDistrict?: string;
  onAddReport: (newReport: CitizenReport) => void;
  settings: AccessibilitySettings;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  districts,
  prefilledDistrict,
  onAddReport,
  settings,
}) => {
  if (!isOpen) return null;

  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';

  const [category, setCategory] = useState<CitizenReport['category']>('illegal_burning');
  const [district, setDistrict] = useState(prefilledDistrict || 'Sangatta Utara');
  const [locationDescription, setLocationDescription] = useState('');
  const [lat, setLat] = useState<number>(0.5042);
  const [lng, setLng] = useState<number>(117.5451);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState('Warga Setempat');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState<'high' | 'medium' | 'low'>('high');
  const [previewImage, setPreviewImage] = useState<string>(
    'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDetectGps = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
          setIsDetectingGps(false);
          setGpsCaptured(true);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, using district centroid:', err);
          // Fallback to district centroid
          const found = districts.find((d) => d.name === district);
          if (found) {
            setLat(found.lat);
            setLng(found.lng);
          }
          setIsDetectingGps(false);
          setGpsCaptured(true);
        },
        { timeout: 8000 }
      );
    } else {
      setIsDetectingGps(false);
      setGpsCaptured(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPreviewImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const foundDistrict = districts.find((d) => d.name === district) || districts[0];

    const newReport: CitizenReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      title:
        category === 'illegal_burning'
          ? 'Pembakaran Sampah Liar / Plastik'
          : category === 'wildfire_hotspot'
          ? 'Titik Api Kebakaran Lahan'
          : category === 'dry_brush'
          ? 'Semak Kering Rawan Api'
          : 'Penumpukan Sampah Liar',
      category,
      district,
      locationDescription: locationDescription || `Dekat Jalan Poros ${district}`,
      lat,
      lng,
      svgX: foundDistrict.svgX + (Math.random() * 20 - 10),
      svgY: foundDistrict.svgY + (Math.random() * 20 - 10),
      reporterName: reporterName || 'Warga Peduli Langit Biru',
      reporterRole,
      reportedAt: 'Baru saja (Verifikasi Otomatis)',
      status: 'verified',
      urgency,
      imageUrl: previewImage,
      notes: notes || 'Asap teramati mengepul dan berpotensi meluas.',
      actionTaken: 'Telah diteruskan ke Tim Patroli MPA & BPBD Kutim.',
    };

    setTimeout(() => {
      onAddReport(newReport);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2200);
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className={`w-full max-w-xl my-8 rounded-2xl p-6 shadow-2xl border transition-all ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : settings.contrastMode === 'dark'
            ? 'bg-slate-900 text-slate-100 border-slate-800'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t.reportTitle}</h2>
              <p className="text-xs opacity-75 mt-0.5">{t.reportSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-emerald-600">Laporan Berhasil Terkirim!</h3>
            <p className="text-xs max-w-md mx-auto opacity-80 leading-relaxed">
              {t.reportSuccess}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            {/* Category selection */}
            <div>
              <label className="block font-bold mb-1.5">{t.reportCategory} *</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'illegal_burning', label: t.catBurning, icon: Flame },
                  { id: 'wildfire_hotspot', label: t.catHotspot, icon: AlertTriangle },
                  { id: 'dry_brush', label: t.catDryBrush, icon: Navigation },
                  { id: 'illegal_dumping', label: t.catDumping, icon: Camera },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as CitizenReport['category'])}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-left font-semibold transition-all ${
                      category === item.id
                        ? 'border-rose-600 bg-rose-50/70 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-district & Location Detail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">{t.reportDistrict} *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.nativeKutaiName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Tingkat Urgensi</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as 'high' | 'medium' | 'low')}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="high">Urgensi Tinggi (Api Merembet / Asap Pekat)</option>
                  <option value="medium">Urgensi Sedang (Asap Tipis / Belum Merembet)</option>
                  <option value="low">Urgensi Siaga (Tumpukan Sampah Siap Bakar)</option>
                </select>
              </div>
            </div>

            {/* Location Landmarks */}
            <div>
              <label className="block font-bold mb-1">{t.reportLocation} *</label>
              <input
                type="text"
                required
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                placeholder="Contoh: Jl. APT Pranoto Gg. Pelita RT 14 dekat tiang listrik"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            {/* GPS Capture */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold block">{t.reportGps}</span>
                <span className="opacity-75 text-[11px]">
                  Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isDetectingGps ? 'Mendeteksi...' : t.detectGpsBtn}</span>
              </button>
            </div>

            {/* Photo Upload & Preview */}
            <div>
              <label className="block font-bold mb-1">{t.reportPhoto}</label>
              <div className="flex items-center gap-3">
                <img
                  src={previewImage}
                  alt="Preview Bukti Kejadian"
                  className="w-20 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs"
                />
                <div className="flex-1 space-y-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 cursor-pointer font-semibold">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ambil / Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] opacity-70 leading-tight">
                    {t.reportPhotoHint}
                  </p>
                </div>
              </div>
            </div>

            {/* Reporter details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">{t.reporterName}</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Misal: Andi / Warga RT 02"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Peran Pelapor</label>
                <select
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="Warga Setempat">Warga Setempat</option>
                  <option value="Pelajar / Pramuka">Pelajar / Pramuka Peduli Lingkungan</option>
                  <option value="Relawan MPA">Relawan MPA (Masyarakat Peduli Api)</option>
                  <option value="Aparat Desa / RT">Aparat Desa / RT</option>
                </select>
              </div>
            </div>

            {/* Notes / Narrative */}
            <div>
              <label className="block font-bold mb-1">{t.reportNotes}</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Deskripsikan kondisi asap, luas kobaran, atau barang yang sedang dibakar..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            {/* Official Validation & Data Source Note */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Mekanisme Validasi & Tindak Lanjut Lapangan:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-tight">
                Laporan diteruskan ke Satuan Tugas Reaksi Cepat BPBD Kabupaten Kutai Timur, Dinas Pemadam Kebakaran & Penyelamatan, serta regu Masyarakat Peduli Api (MPA) di kecamatan terkait untuk verifikasi GPS dan penindakan segera.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] opacity-70">
                Laporan aman, valid, dan dipetakan secara real-time.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
              >
                <Flame className="w-4 h-4" />
                <span>{isSubmitting ? t.submitting : t.submitReport}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
