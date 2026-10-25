import React from 'react';
import { AccessibilitySettings } from '../types';
import { translations } from '../data/translations';
import { Wind, Shield, PhoneCall, Heart, MapPin, ExternalLink, Leaf, ShieldAlert, MessageCircle, Phone } from 'lucide-react';

interface FooterProps {
  settings: AccessibilitySettings;
  onOpenAccessibility: () => void;
  onSelectTab: (tab: 'map' | 'air' | 'tps' | 'reports' | 'karhutla' | 'education' | 'funfact') => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAccessibility,
  onSelectTab,
}) => {
  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';

  return (
    <footer
      className={`w-full border-t mt-12 transition-colors ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-300'
          : settings.contrastMode === 'dark'
          ? 'bg-slate-950 text-slate-300 border-slate-800'
          : 'bg-slate-900 text-slate-300 border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-emerald-500/40 bg-slate-900 shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo SI OTAN KUTIM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">SI OTAN KUTIM</span>
                <p className="text-[11px] font-medium text-emerald-400">
                  {t.appTagline}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Sistem Online Monitoring Titik Karhutla, Indeks Udara, dan Navigasi TPS Kabupaten Kutai Timur. Platform kolaborasi digital pemantauan kualitas udara (ISPU), zonasi ancaman karhutla, penunjuk lokasi TPS bebas bakar sampah, dan kanal partisipasi masyarakat.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Leaf className="w-4 h-4" />
              <span>Bersama Jaga Langit Kutim Biru Tanpa Asap Beracun</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('map')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navMap}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('air')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navAir}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('tps')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navTps}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('reports')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navReports}
                </button>
              </li>
              {/* Edukasi Karhutla strictly to the left of Edukasi Lingkungan */}
              <li>
                <button
                  onClick={() => onSelectTab('karhutla')}
                  className="hover:text-emerald-400 transition-colors text-amber-300 font-semibold flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.navKarhutla || 'Edukasi Karhutla'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('education')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navEducation}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('funfact')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navFunFact}
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines & Developer Contact */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
              <span>Posko Siaga & Kontak Pengembang</span>
            </h4>
            <div className="space-y-2 text-slate-400">
              {/* Kontak Pengembang WhatsApp & Telp */}
              <div className="p-2.5 rounded-xl bg-slate-800/90 border border-emerald-500/40">
                <span className="font-bold text-emerald-300 block flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>Pengembang SI OTAN Kutim:</span>
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <a
                    href="https://wa.me/6282258451435?text=Halo%20Pengembang%20SI%20OTAN%20Kutim%2C%20saya%20ingin%20berkonsultasi%20atau%20melaporkan%20data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-black hover:underline"
                    title="Chat WhatsApp Pengembang SI OTAN Kutim"
                  >
                    WhatsApp: 0822-5845-1435
                  </a>
                  <a
                    href="tel:082258451435"
                    className="text-slate-300 font-bold hover:underline text-[11px]"
                    title="Telepon Pengembang Langsung"
                  >
                    (Telepon)
                  </a>
                </div>
              </div>

              {/* Damkar Kutim */}
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="font-bold text-white block">Damkar Sangatta / Posko 113:</span>
                <a href="tel:113" className="text-rose-400 font-bold hover:underline">
                  113 / (0549) 21008
                </a>
              </div>

              {/* BPBD Kutim */}
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="font-bold text-white block">Pusdalops BPBD Kutai Timur:</span>
                <a href="tel:054921113" className="text-amber-400 font-bold hover:underline">
                  (0549) 21113 / 0811-580-1113
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Accessibility Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} <strong>SI OTAN KUTIM</strong> · Dinas Lingkungan Hidup & BPBD Kabupaten Kutai Timur, Kalimantan Timur.
          </div>

          <button
            onClick={onOpenAccessibility}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Buka Setelan Aksesibilitas</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
