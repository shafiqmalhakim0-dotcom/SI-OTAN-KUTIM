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
 * Mengonversi nilai confidence dari NASA FIRMS (berupa string 'nominal', 'high', 'low' atau angka 0-100)
 */
function normalizeConfidence(raw: string | undefined): number {
  if (!raw) return 80;
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === 'h' || cleaned === 'high') return 95;
  if (cleaned === 'n' || cleaned === 'nominal') return 85;
  if (cleaned === 'l' || cleaned === 'low') return 60;
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 80 : Math.min(100, Math.max(0, num));
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
    const confidence = confIndex !== -1 ? normalizeConfidence(row[confIndex]) : 85;
    const brightness = brightIndex !== -1 ? Math.round(parseFloat(row[brightIndex]) || 340) : 340;
    const satelliteCode = satIndex !== -1 ? row[satIndex] : '';
    const instrument = instIndex !== -1 ? row[instIndex] : 'VIIRS';
    const acqTime = timeIndex !== -1 && row[timeIndex] ? row[timeIndex] : '0500';
    const acqDate = dateIndex !== -1 && row[dateIndex] ? row[dateIndex] : '';
    const frp = frpIndex !== -1 ? parseFloat(row[frpIndex]) || 12 : 12;

    // Format jam pengambilan satelit ke format WITA (UTC+8)
    const formattedHour = acqTime.length >= 4 
      ? `${acqTime.slice(0, 2)}:${acqTime.slice(2, 4)} WITA`
      : '05:00 WITA';

    const satelliteLabel = instrument.toUpperCase().includes('MODIS')
      ? 'MODIS'
      : satelliteCode.includes('N')
      ? 'SNPP'
      : 'VIIRS';

    // Perkiraan jenis titik api: jika dekat area pemukiman padat sangatta -> pembakaran sampah, jika di hutan/kebun -> karhutla
    const isSettlement = nearestDistrict.id.includes('sangatta') && confidence < 90;

    results.push({
      id: `firms-live-${i}-${Date.now().toString().slice(-4)}`,
      districtId: nearestDistrict.id,
      districtName: nearestDistrict.name,
      locationName: `Titik Pantau Satelit ${nearestDistrict.name} (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      lat,
      lng,
      svgX: nearestDistrict.svgX,
      svgY: nearestDistrict.svgY,
      confidence,
      satellite: `NASA FIRMS (${satelliteLabel})`,
      detectedAt: `${formattedHour}${acqDate ? ` • ${acqDate}` : ''}`,
      brightnessKelvin: brightness,
      type: isSettlement ? 'pembakaran_sampah' : 'karhutla',
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
