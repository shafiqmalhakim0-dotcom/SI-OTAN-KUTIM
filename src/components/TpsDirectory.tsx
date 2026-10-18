import React, { useState, useMemo } from 'react';
import { WasteDepot, AccessibilitySettings } from '../types';
import { translations } from '../data/translations';
import {
  Trash2,
  Recycle,
  Building,
  Clock,
  Phone,
  CheckCircle,
  AlertOctagon,
  Search,
  Filter,
  Navigation,
  Sparkles,
  MapPin,
  FileCheck2,
} from 'lucide-react';

interface TpsDirectoryProps {
  tpsDepots: WasteDepot[];
  settings: AccessibilitySettings;
  onSelectOnMap: (depot: WasteDepot) => void;
}

export const TpsDirectory: React.FC<TpsDirectoryProps> = ({
  tpsDepots,
  settings,
  onSelectOnMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [directionModalDepot, setDirectionModalDepot] = useState<WasteDepot | null>(null);

  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';

  const filteredDepots = useMemo(() => {
    return tpsDepots.filter((depot) => {
      const matchesSearch =
        depot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        depot.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        depot.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'tps_resmi' && depot.type === 'tps_resmi') ||
        (filterType === 'tps_3r' && depot.type === 'tps_3r') ||
        (filterType === 'bank_sampah' && depot.type === 'bank_sampah') ||
        (filterType === 'tpa' && depot.type === 'tpa');

      return matchesSearch && matchesFilter;
    });
  }, [tpsDepots, searchQuery, filterType]);

  const getTypeBadge = (type: WasteDepot['type']) => {
    switch (type) {
      case 'tpa':
        return { label: 'TPA Regional', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' };
      case 'tps_3r':
        return { label: 'TPS 3R Daur Ulang', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
      case 'bank_sampah':
        return { label: 'Bank Sampah Induk', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' };
      default:
        return { label: 'TPS Resmi DLH', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Title & Stop Burning Pledge Banner */}
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{t.tpsTitle}</h2>
          <p className="text-xs sm:text-sm opacity-75 mt-0.5">{t.tpsSubtitle}</p>
        </div>

        {/* Anti-burn pledge card */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-colors ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-300'
              : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-950 dark:text-emerald-200'
          }`}
        >
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
            <Recycle className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-sm tracking-tight">
              Gerakan Bebas Asap: Buang ke TPS Resmi, Bukan Dibakar!
            </h3>
            <p className="leading-relaxed opacity-90">{t.tpsPledge}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.tpsSearchPlaceholder}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-emerald-500 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          {[
            { id: 'all', label: t.tpsFilterAll },
            { id: 'tps_resmi', label: t.tpsFilterOfficial },
            { id: 'tps_3r', label: t.tpsFilter3R },
            { id: 'bank_sampah', label: t.tpsFilterBank },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === tab.id
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Depots List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDepots.map((depot) => {
          const typeBadge = getTypeBadge(depot.type);
          return (
            <div
              key={depot.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all hover:shadow-md ${
                isHighContrast
                  ? 'bg-black text-yellow-300 border-yellow-300'
                  : settings.contrastMode === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${typeBadge.bg}`}>
                      {typeBadge.label}
                    </span>
                    <h3 className="text-base font-bold tracking-tight mt-1">
                      {depot.name}
                    </h3>
                    <p className="text-xs opacity-75 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{depot.address}</span>
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      depot.capacityStatus === 'Tersedia'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {depot.capacityStatus}
                  </span>
                </div>

                {/* Info Points */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 opacity-85">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{depot.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-85">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${depot.phone}`} className="hover:underline font-medium">
                      {depot.phone} ({depot.contact})
                    </a>
                  </div>
                </div>

                {/* Accepted Waste */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider block">
                    {t.acceptedWaste}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {depot.acceptedWaste.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Anti-burn tip quote */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs italic text-amber-900 dark:text-amber-200">
                  "{depot.antiBurnTip[settings.language] || depot.antiBurnTip.id}"
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectOnMap(depot)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Lihat di Peta</span>
                </button>

                <button
                  onClick={() => setDirectionModalDepot(depot)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition-opacity"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.tpsDirections}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direction & Distance Modal */}
      {directionModalDepot && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${
              isHighContrast
                ? 'bg-black text-yellow-300 border-yellow-300'
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-600">
                <Navigation className="w-5 h-5" />
                <h3 className="font-bold text-base">Petunjuk Arah TPS</h3>
              </div>
              <button
                onClick={() => setDirectionModalDepot(null)}
                className="text-xs opacity-60 hover:opacity-100"
              >
                Tutup
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <h4 className="font-bold text-sm">{directionModalDepot.name}</h4>
              <p className="opacity-80">{directionModalDepot.address}</p>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-70">Estimasi Jarak dari Pusat Kota:</span>
                  <span className="font-bold">± 3.8 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Waktu Tempuh Kendaraan:</span>
                  <span className="font-bold">~ 8-12 menit</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Biaya Retribusi:</span>
                  <span className="font-bold text-emerald-600">Gratis (Ditanggung Pemkab)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 leading-relaxed">
                <strong>Tips Membawa Sampah:</strong> Ikat sampah organik di wadah ember/karung dan pilah plastik botol secara terpisah agar mudah ditimbang petugas.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setDirectionModalDepot(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Saya Mengerti & Siap Mengantar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Data Source Attribution Footer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Sumber Informasi Resmi Fasilitas Persampahan:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
          Bidang Pengelolaan Sampah dan Limbah B3, Dinas Lingkungan Hidup (DLH) Kabupaten Kutai Timur, Unit Pelaksana Teknis Daerah (UPTD) Persampahan Sangatta, dan Asosiasi Bank Sampah Seluruh Indonesia (ASBSI) DPD Kutai Timur.
        </p>
      </div>
    </div>
  );
};
