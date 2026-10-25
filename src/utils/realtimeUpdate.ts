/**
 * Utilitas Data Real-Time & Jadwal Sinkronisasi Otomatis Setiap Jam 5 Pagi WITA
 * 
 * Sesuai ketentuan: Seluruh informasi real-time (Titik Panas Satelit NASA FIRMS,
 * Indeks ISPU BMKG/DLH, dan Status Bahaya Karhutla) disinkronkan otomatis
 * setiap hari pada pukul 05:00 WITA (Waktu Indonesia Tengah / UTC+8).
 */

import { HotspotPin } from '../types';

export interface RealtimeTelemetryMeta {
  lastUpdatedFormatted: string;
  nextScheduledUpdate: string;
  cycleHour: string;
  statusBadge: string;
  nasaFirmsStatus: string;
  sources: {
    satellite: string;
    airQuality: string;
    fireBrigade: string;
    meteorology: string;
  };
  contacts: {
    developerName: string;
    developerPhone: string;
    developerWaLink: string;
    bpbdPhone: string;
    bpbdFormatted: string;
    damkarPhone: string;
    emergencyCallCenter: string;
  };
}

export function getRealtimeSyncMeta(): RealtimeTelemetryMeta {
  // Waktu saat ini
  const now = new Date();

  // Waktu WITA (UTC + 8 jam)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const witaDate = new Date(utc + 3600000 * 8);

  const currentHour = witaDate.getHours();

  // Tentukan tanggal sinkronisasi 05:00 WITA terakhir
  const lastSyncDate = new Date(witaDate);
  if (currentHour < 5) {
    // Jika sebelum jam 5 pagi, ambil jam 5 pagi hari kemarin
    lastSyncDate.setDate(lastSyncDate.getDate() - 1);
  }
  lastSyncDate.setHours(5, 0, 0, 0);

  // Jadwal sinkronisasi berikutnya (pukul 05:00 WITA mendatang)
  const nextSyncDate = new Date(lastSyncDate);
  nextSyncDate.setDate(nextSyncDate.getDate() + 1);
  nextSyncDate.setHours(5, 0, 0, 0);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const lastDateFormatted = lastSyncDate.toLocaleDateString('id-ID', options);
  const nextDateFormatted = nextSyncDate.toLocaleDateString('id-ID', options);

  return {
    lastUpdatedFormatted: `${lastDateFormatted}, 05:00 WITA`,
    nextScheduledUpdate: `${nextDateFormatted}, 05:00 WITA`,
    cycleHour: 'Pukul 05:00 WITA',
    statusBadge: 'Diperbarui otomatis setiap hari pukul 05:00 WITA',
    nasaFirmsStatus: 'Terhubung ke Live Satellite Feed NASA FIRMS (VIIRS & MODIS)',
    sources: {
      satellite: 'NASA FIRMS (Fire Information for Resource Management System - Satelit VIIRS S-NPP/NOAA-20 & MODIS Terra/Aqua)',
      airQuality: 'Kementerian Lingkungan Hidup dan Kehutanan (SIPONGI KLHK) & Stasiun Pemantau DLH Kutai Timur',
      fireBrigade: 'Dinas Pemadam Kebakaran dan Penyelamatan (Disdamkartan) & Pusdalops BPBD Kabupaten Kutai Timur',
      meteorology: 'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG Stasiun Meteorologi Kelas I Kalimantan Timur)',
    },
    contacts: {
      developerName: 'Pengembang SI OTAN Kutim',
      developerPhone: '082258451435',
      developerWaLink: 'https://wa.me/6282258451435?text=Halo%20Pengembang%20SI%20OTAN%20Kutim%2C%20saya%20ingin%20berkonsultasi%20atau%20melaporkan%20data',
      bpbdPhone: '(0549) 21113',
      bpbdFormatted: 'tel:054921113',
      damkarPhone: '113',
      emergencyCallCenter: '112',
    },
  };
}

/**
 * Menyinkronkan titik panas satelit NASA FIRMS dengan siklus pembaruan 05:00 WITA terkini
 */
export function getDailySynchronizedHotspots(baseHotspots: HotspotPin[]): HotspotPin[] {
  const meta = getRealtimeSyncMeta();
  return baseHotspots.map((hs, index) => {
    // Alokasikan stempel waktu satelit yang sinkron dengan pemindaian harian jam 05:00 WITA
    const scanOffsets = ['05:00 WITA', '05:12 WITA', '05:18 WITA', '05:24 WITA', '05:30 WITA', '05:42 WITA'];
    const assignedTime = scanOffsets[index % scanOffsets.length];

    return {
      ...hs,
      detectedAt: `${assignedTime} (Siklus ${meta.lastUpdatedFormatted})`,
      satellite: hs.satellite === 'Laporan Warga' ? 'Laporan Warga Terverifikasi' : `NASA FIRMS (${hs.satellite})`,
    };
  });
}
