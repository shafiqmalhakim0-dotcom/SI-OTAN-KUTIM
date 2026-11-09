/**
 * Layanan Integrasi Real-Time API NASA FIRMS (Fire Information for Resource Management System)
 * Mendukung satelit VIIRS (S-NPP, NOAA-20, NOAA-21) dan MODIS (Terra & Aqua).
 * 
 * Bounding Box Kabupaten Kutai Timur, Kalimantan Timur:
 * Min Longitude: 115.8, Min Latitude: -0.1
 * Max Longitude: 119.0, Max Latitude: 1.9
 */

import { HotspotPin, DistrictData } from '../types';
import { KUTIM_DISTRICTS, KUTIM_HOTSPOTS } from '../data/kutimData';
import { getDailySynchronizedHotspots, getRealtimeSyncMeta } from '../utils/realtimeUpdate';

export interface FirmsFetchResult {
  hotspots: HotspotPin[];
  isLiveApi: boolean;
  syncTimestamp: string;
  sourceLabel: string;
  count: number;
  message?: string;
}

// Bounding box Kutai Timur untuk query API NASA FIRMS [min_lon, min_lat, max_lon, max_lat]
export const KUTIM_FIRMS_BBOX = '115.8,-0.1,119.0,1.9';

/**
 * Format teks status sinkronisasi sesuai spesifikasi:
 * "SINKRONISASI TERAKHIR: [Tanggal Hari Ini], 05:00 WITA"
 */
export function formatFirmsSyncHeader(customDate?: Date): string {
  const now = customDate || new Date();
  // Waktu WITA (UTC+8)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const witaDate = new Date(utc + 3600000 * 8);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const formattedDate = witaDate.toLocaleDateString('id-ID', options);
  return `SINKRONISASI TERAKHIR: ${formattedDate}, 05:00 WITA`;
}

/**
 * Menemukan kecamatan terdekat berdasarkan koordinat lat/lng
 */
function findNearestDistrict(lat: number, lng: number): DistrictData {
  let nearest = KUTIM_DISTRICTS[0];
  let minDistance = Number.MAX_VALUE;

  for (const district of KUTIM_DISTRICTS) {
    const dLat = district.lat - lat;
    const dLng = district.lng - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDistance) {
      minDistance = dist;
      nearest = district;
    }
  }

  return nearest;
}

/**
 * Preserve the confidence value exactly as supplied by NASA FIRMS.
 * VIIRS commonly uses low/nominal/high categories; MODIS may use 0-100.
 * These formats are not interchangeable and neither is a probability that a fire exists.
 */
function parseConfidence(raw: string | undefined): {
  raw: string;
  category: 'low' | 'nominal' | 'high' | 'numeric' | 'unknown';
  legacyValue: number;
} {
  const value = (raw || '').trim();
  const normalized = value.toLowerCase();
  if (normalized === 'l' || normalized === 'low') {
    return { raw: value, category: 'low', legacyValue: 0 };
  }
  if (normalized === 'n' || normalized === 'nominal') {
    return { raw: value, category: 'nominal', legacyValue: 0 };
  }
  if (normalized === 'h' || normalized === 'high') {
    return { raw: value, category: 'high', legacyValue: 0 };
  }
  if (value !== '' && Number.isFinite(Number(value))) {
    return {
      raw: value,
      category: 'numeric',
      legacyValue: Math.min(100, Math.max(0, Number(value))),
    };
  }
  return { raw: value, category: 'unknown', legacyValue: 0 };
}

/**
 * Parsing data CSV response dari NASA FIRMS
 */
export function parseFirmsCsv(csvText: string): HotspotPin[] {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const latIndex = headers.indexOf('latitude');
  const lngIndex = headers.indexOf('longitude');
  const brightIndex = headers.findIndex((h) => h.includes('bright'));
  const confIndex = headers.indexOf('confidence');
  const satIndex = headers.indexOf('satellite');
  const instIndex = headers.indexOf('instrument');
  const timeIndex = headers.indexOf('acq_time');
  const dateIndex = headers.indexOf('acq_date');
  const frpIndex = headers.indexOf('frp');

  if (latIndex === -1 || lngIndex === -1) {
    throw new Error('Format CSV NASA FIRMS tidak valid: kolom latitude/longitude tidak ditemukan.');
  }

  const results: HotspotPin[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map((val) => val.trim());
    if (row.length <= latIndex || row.length <= lngIndex) continue;

    const lat = parseFloat(row[latIndex]);
    const lng = parseFloat(row[lngIndex]);
    if (isNaN(lat) || isNaN(lng)) continue;

    const nearestDistrict = findNearestDistrict(lat, lng);
    const confidenceInfo = parseConfidence(confIndex !== -1 ? row[confIndex] : undefined);
    const brightnessText = brightIndex !== -1 ? (row[brightIndex] || '').trim() : '';
    const rawBrightness = brightnessText ? Number(brightnessText) : Number.NaN;
    const brightness = Number.isFinite(rawBrightness) ? Math.round(rawBrightness) : 0;
    const satelliteCode = satIndex !== -1 ? row[satIndex] : '';
    const instrument = instIndex !== -1 && row[instIndex] ? row[instIndex] : 'VIIRS';
    const acqTime = timeIndex !== -1 && row[timeIndex] ? row[timeIndex].padStart(4, '0') : '';
    const acqDate = dateIndex !== -1 && row[dateIndex] ? row[dateIndex] : '';
    const frpText = frpIndex !== -1 ? (row[frpIndex] || '').trim() : '';
    const rawFrp = frpText ? Number(frpText) : Number.NaN;
    const frpMW = Number.isFinite(rawFrp) ? rawFrp : undefined;

    // NASA FIRMS acquisition time is UTC. Convert it to local WITA for display.
    let formattedHour = 'Waktu tidak tersedia';
    if (/^\\d{4}$/.test(acqTime)) {
      const hh = Number(acqTime.slice(0, 2));
      const mm = Number(acqTime.slice(2, 4));
      if (hh <= 23 && mm <= 59) {
        const utcDate = acqDate
          ? new Date(`${acqDate}T${acqTime.slice(0, 2)}:${acqTime.slice(2, 4)}:00Z`)
          : new Date(Date.UTC(2020, 0, 1, hh, mm));
        formattedHour = new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Makassar',
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23',
        }).format(utcDate) + ' WITA';
      }
    }

    const satelliteLabel = instrument.toUpperCase().includes('MODIS')
      ? 'MODIS'
      : satelliteCode.toUpperCase().includes('N')
      ? 'SNPP'
      : 'VIIRS';

    results.push({
      id: `firms-live-${i}-${Date.now().toString().slice(-4)}`,
      districtId: nearestDistrict.id,
      districtName: nearestDistrict.name,
      locationName: `Titik Pantau Satelit ${nearestDistrict.name} (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      lat,
      lng,
      svgX: nearestDistrict.svgX,
      svgY: nearestDistrict.svgY,
      confidence: confidenceInfo.legacyValue,
      confidenceRaw: confidenceInfo.raw,
      confidenceCategory: confidenceInfo.category,
      satellite: `NASA FIRMS (${satelliteLabel})`,
      detectedAt: `${formattedHour}${acqDate ? ` • ${acqDate}` : ''}`,
      acquisitionDate: acqDate || undefined,
      acquisitionTimeUtc: acqTime || undefined,
      brightnessKelvin: brightness,
      frpMW,
      // Satellite detections do not identify whether the source is a forest fire or waste burning.
      type: 'belum_diketahui',
    });
  }

  return results;
}

/**
 * Panggil API NASA FIRMS secara asynchronous untuk area Kutai Timur
 * Menggunakan import.meta.env.VITE_FIRMS_API_KEY
 */
export async function fetchLiveFirmsHotspots(): Promise<FirmsFetchResult> {
  const waktu = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());

  const syncTimestamp = `Diperiksa: ${waktu} WITA`;

  try {
    // Mengambil data melalui backend Vercel
    // API key NASA tetap tersimpan aman di server.
    const response = await fetch('/api/firms', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API NASA gagal: HTTP ${response.status}`);
    }

    const csvText = await response.text();

    const header = csvText
      .split(/\r?\n/)[0]
      .toLowerCase();

    if (
      !header.includes('latitude') ||
      !header.includes('longitude')
    ) {
      throw new Error('Format data NASA FIRMS tidak valid');
    }

    const parsedHotspots = parseFirmsCsv(csvText);

    return {
      hotspots: parsedHotspots,
      isLiveApi: true,
      syncTimestamp,
      sourceLabel: 'NASA FIRMS VIIRS S-NPP NRT',
      count: parsedHotspots.length,
      message: parsedHotspots.length > 0
        ? `${parsedHotspots.length} titik panas terdeteksi satelit.`
        : 'NASA terhubung. Tidak ada hotspot terdeteksi pada periode yang diminta.',
    };

  } catch (error) {
    console.error('NASA FIRMS:', error);

    return {
      hotspots: [],
      isLiveApi: false,
      syncTimestamp,
      sourceLabel: 'NASA FIRMS tidak tersedia',
      count: 0,
      message: 'Data satelit tidak dapat diambil. Periksa koneksi API.',
    };
  }
}
