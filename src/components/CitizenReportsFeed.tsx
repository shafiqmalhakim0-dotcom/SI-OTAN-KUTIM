import React, { useState } from 'react';
import { CitizenReport, AccessibilitySettings } from '../types';
import { translations } from '../data/translations';
import {
  Flame,
  AlertTriangle,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  Filter,
  PlusCircle,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';

interface CitizenReportsFeedProps {
  reports: CitizenReport[];
  settings: AccessibilitySettings;
  onOpenReportModal: () => void;
  onSelectReportOnMap: (report: CitizenReport) => void;
}

export const CitizenReportsFeed: React.FC<CitizenReportsFeedProps> = ({
  reports,
  settings,
  onOpenReportModal,
  onSelectReportOnMap,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';

  const filteredReports = reports.filter((rep) => {
    if (filterCategory === 'all') return true;
    return rep.category === filterCategory;
  });

  const getUrgencyBadge = (urgency: CitizenReport['urgency']) => {
    switch (urgency) {
      case 'high':
        return { label: 'Urgensi Tinggi', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' };
      case 'medium':
        return { label: 'Urgensi Sedang', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
      default:
        return { label: 'Urgensi Rendah', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header and action trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{t.navReports}</h2>
          <p className="text-xs sm:text-sm opacity-75 mt-0.5">
            Partisipasi aktif warga, pelajar, dan MPA mendeteksi titik api serta pembakaran sampah liar secara real-time.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.quickReportBtn}</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: 'all', label: 'Semua Laporan Warga' },
          { id: 'illegal_burning', label: 'Membakar Sampah' },
          { id: 'wildfire_hotspot', label: 'Kebakaran Lahan' },
          { id: 'dry_brush', label: 'Semak Kering' },
          { id: 'illegal_dumping', label: 'Tumpukan Sampah' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-medium border transition-all ${
              filterCategory === tab.id
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => {
          const urgencyBadge = getUrgencyBadge(report.urgency);
          return (
            <div
              key={report.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                isHighContrast
                  ? 'bg-black text-yellow-300 border-yellow-300'
                  : settings.contrastMode === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Photo and Badges */}
                <div className="flex items-start gap-3">
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-24 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${urgencyBadge.color}`}>
                        {urgencyBadge.label}
                      </span>
                      <span className="text-[10px] opacity-60">
                        {report.reportedAt}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm tracking-tight leading-snug">
                      {report.title}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] opacity-75">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>Kecamatan {report.district}</span>
                    </div>
                  </div>
                </div>

                {/* Location and Reporter Note */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{report.locationDescription}</span>
                  </div>
                  <p className="opacity-80 leading-relaxed text-[11px] italic">
                    "{report.notes}"
                  </p>
                </div>

                {/* Follow up status badge */}
                {report.actionTaken && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <span className="font-bold block text-[11px]">Respon Tim Siaga:</span>
                      <p className="text-[11px] leading-tight">{report.actionTaken}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="opacity-70 text-[11px]">
                  Pelapor: <strong>{report.reporterName}</strong> ({report.reporterRole})
                </span>

                <button
                  onClick={() => onSelectReportOnMap(report)}
                  className="flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  <span>Lihat di Peta</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Verification Workflow & Sources */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Mekanisme Validasi & Sumber Informasi Laporan Warga:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
          Setiap laporan yang masuk diteruskan ke Tim Reaksi Cepat BPBD Kabupaten Kutai Timur, Dinas Lingkungan Hidup (DLH), serta Masyarakat Peduli Api (MPA) di tingkat desa/kelurahan setempat untuk verifikasi faktual lapangan dan pemadaman langsung.
        </p>
      </div>
    </div>
  );
};
