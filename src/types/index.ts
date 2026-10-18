export type Language = 'id' | 'en' | 'kt';

export type TextSize = 'normal' | 'large' | 'xl';
export type ContrastMode = 'normal' | 'high-contrast' | 'dark';

export interface AccessibilitySettings {
  textSize: TextSize;
  fontDyslexic: boolean;
  contrastMode: ContrastMode;
  language: Language;
  soundEnabled: boolean;
}

export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface DistrictData {
  id: string;
  name: string;
  nativeKutaiName: string;
  svgX: number; // 0 - 800
  svgY: number; // 0 - 600
  lat: number;
  lng: number;
  riskLevel: RiskLevel;
  ispu: number;
  pm25: number;
  pm10: number;
  temperature: number; // Celsius
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  hotspotCount: number;
  drynessIndex: number; // 0-100%
  activeFires: number;
  description: {
    id: string;
    en: string;
    kt: string;
  };
  recommendations: {
    id: string;
    en: string;
    kt: string;
  };
  specialty?: string;
  landscape?: string;
  svgPath?: string;
  areaKm2?: number;
  population: number;
  populationDensity: number;
  polygonCoords: Array<[number, number]>;
  dataSource: {
    population: string;
    airQuality: string;
    hotspots: string;
    waste: string;
  };
}

export interface NeighboringRegion {
  id: string;
  name: string;
  direction: string;
  lat: number;
  lng: number;
  description: string;
}

export interface HotspotPin {
  id: string;
  districtId: string;
  districtName: string;
  locationName: string;
  lat: number;
  lng: number;
  svgX: number;
  svgY: number;
  confidence: number;
  satellite: 'VIIRS' | 'MODIS' | 'SNPP' | 'Laporan Warga';
  detectedAt: string;
  brightnessKelvin: number;
  type: 'karhutla' | 'pembakaran_sampah';
}

export interface WasteDepot {
  id: string;
  name: string;
  type: 'tps_resmi' | 'tps_3r' | 'bank_sampah' | 'tpa';
  district: string;
  address: string;
  lat: number;
  lng: number;
  svgX: number;
  svgY: number;
  operatingHours: string;
  acceptedWaste: string[];
  capacityStatus: 'Tersedia' | 'Hampir Penuh' | 'Penuh';
  contact: string;
  phone: string;
  facility: string;
  dataSource?: string;
  antiBurnTip: {
    id: string;
    en: string;
    kt: string;
  };
}

export interface FireStation {
  id: string;
  name: string;
  type: 'mako_pusat' | 'pos_sektor' | 'posko_bpbd' | 'posko_mpa';
  district: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hotline: string;
  crewStatus: string;
  vehicles: string[];
  coverageArea: string;
  commander: string;
  dataSource: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  category: 'illegal_burning' | 'wildfire_hotspot' | 'dry_brush' | 'illegal_dumping';
  district: string;
  locationDescription: string;
  lat: number;
  lng: number;
  svgX: number;
  svgY: number;
  reporterName: string;
  reporterRole: string; // Warga, Relawan Karhutla, Pelajar Pramuka, Aparat Desa
  reportedAt: string;
  status: 'verified' | 'investigating' | 'resolved';
  urgency: 'high' | 'medium' | 'low';
  imageUrl: string;
  notes: string;
  actionTaken?: string;
}

export interface AirQualitySummary {
  overallIspu: number;
  category: 'baik' | 'sedang' | 'tidak_sehat' | 'sangat_tidak_sehat' | 'berbahaya';
  dominantPollutant: string;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
  lastUpdated: string;
  warningNotice: {
    id: string;
    en: string;
    kt: string;
  };
}
