import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import {
  DistrictData,
  HotspotPin,
  WasteDepot,
  CitizenReport,
  AccessibilitySettings,
  RiskLevel,
  FireStation,
} from '../types';
import {
  KUTIM_OUTER_BOUNDARY,
  KUTIM_NEIGHBORING_REGIONS,
  KUTIM_FIRE_STATIONS,
} from '../data/kutimData';
import { translations } from '../data/translations';
import logoImg from '../assets/images/regenerated_image_1792220175250.jpg';
import { playSpeech, stopSpeech } from '../utils/speech';
import {
  Flame,
  Trash2,
  Wind,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  AlertTriangle,
  ShieldCheck,
  Shield,
  PhoneCall,
  Truck,
  Coins,
  Recycle,
  MapPin,
  Compass,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  Users,
  BarChart3,
  Building2,
  Radio,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Lock,
  Unlock,
  Globe,
  Map as MapIcon,
  MessageCircle,
  ShieldAlert,
} from 'lucide-react';
import { getRealtimeSyncMeta } from '../utils/realtimeUpdate';

interface InteractiveMapProps {
  districts: DistrictData[];
  hotspots: HotspotPin[];
  tpsDepots: WasteDepot[];
  fireStations?: FireStation[];
  citizenReports: CitizenReport[];
  selectedDistrict: DistrictData | null;
  onSelectDistrict: (district: DistrictData | null) => void;
  onOpenReport: (prefillDistrict?: string) => void;
  settings: AccessibilitySettings;
}

type LayerType = 'all' | 'zones' | 'hotspots' | 'damkar' | 'bank_sampah' | 'tps' | 'reports';

// District natural colors matching administrative map
const DISTRICT_COLORS: Record<string, string> = {
  sangatta_utara: '#ef4444',
  sangatta_selatan: '#f59e0b',
  bengalon: '#dc2626',
  teluk_pandan: '#f59e0b',
  rantau_pulung: '#10b981',
  muara_wahau: '#f59e0b',
  kongbeng: '#10b981',
  sangkulirang: '#f59e0b',
  kaliorang: '#10b981',
  kaubun: '#10b981',
  karangan: '#f59e0b',
  sandaran: '#10b981',
  muara_bengkal: '#ef4444',
  muara_ancalong: '#f59e0b',
  batu_ampar: '#f59e0b',
  busang: '#10b981',
  telen: '#10b981',
  long_mesangat: '#10b981',
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  districts,
  hotspots,
  tpsDepots,
  fireStations = KUTIM_FIRE_STATIONS,
  citizenReports,
  selectedDistrict,
  onSelectDistrict,
  onOpenReport,
  settings,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<LayerType>('all');
  const [mapType, setMapType] = useState<'osm' | 'topo' | 'satellite'>('osm');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(null);
  const [selectedTps, setSelectedTps] = useState<WasteDepot | null>(null);
  const [selectedFireStation, setSelectedFireStation] = useState<FireStation | null>(null);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [isSpeakingDistrict, setIsSpeakingDistrict] = useState(false);
  const [showNeighborBorders, setShowNeighborBorders] = useState(true);
  const [scrollZoomEnabled, setScrollZoomEnabled] = useState(false);

  const t = translations[settings.language] || translations.id;
  const isHighContrast = settings.contrastMode === 'high-contrast';
  const isDark = settings.contrastMode === 'dark';

  // Kutai Timur center coordinates
  const KUTIM_CENTER: [number, number] = [0.85, 117.3];
  const KUTIM_DEFAULT_ZOOM = 8;

  // Filtered districts based on search
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districts;
    const q = searchQuery.toLowerCase();
    return districts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nativeKutaiName.toLowerCase().includes(q)
    );
  }, [districts, searchQuery]);

  // Nearest Fire Station for active district
  const nearestFireStation = useMemo(() => {
    if (!selectedDistrict) return null;
    return (
      fireStations.find(
        (fs) =>
          fs.district.toLowerCase().includes(selectedDistrict.name.toLowerCase()) ||
          selectedDistrict.name.toLowerCase().includes(fs.district.toLowerCase())
      ) || fireStations[0]
    );
  }, [selectedDistrict, fireStations]);

  // Nearest Bank Sampah for active district
  const nearestBankSampah = useMemo(() => {
    if (!selectedDistrict) return null;
    const bankDepots = tpsDepots.filter((d) => d.type === 'bank_sampah');
    return (
      bankDepots.find(
        (bs) =>
          bs.district.toLowerCase().includes(selectedDistrict.name.toLowerCase()) ||
          selectedDistrict.name.toLowerCase().includes(bs.district.toLowerCase())
      ) || bankDepots[0]
    );
  }, [selectedDistrict, tpsDepots]);

  // Initialize Leaflet Map with safe scroll bounds to prevent jumping on page scroll
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: KUTIM_CENTER,
        zoom: KUTIM_DEFAULT_ZOOM,
        minZoom: 7,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false, // Prevents map from jumping or trapping page scroll
        maxBounds: [
          [-1.5, 114.2],
          [3.0, 120.8],
        ],
        maxBoundsViscosity: 0.8,
      });

      // Standard OSM Tile
      const tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors &bull; KLHK &bull; BMKG',
      }).addTo(map);

      tileLayerRef.current = tile;

      const layerGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Provider & Dark Mode styling
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors &bull; KLHK';

    if (mapType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri World Imagery';
    } else if (mapType === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenTopoMap contributors';
    } else if (isDark && !isHighContrast) {
      // CartoDB Dark Matter for crisp night view
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap contributors &copy; CARTO';
    }

    const newTile = L.tileLayer(url, { maxZoom: 18, attribution }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [mapType, isDark, isHighContrast]);

  // Render Polygons and Pins into Leaflet LayerGroup
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. Render District Polygons
    if (activeLayer === 'all' || activeLayer === 'zones') {
      filteredDistricts.forEach((d) => {
        const isSelected = selectedDistrict?.id === d.id;
        const color = isHighContrast
          ? d.riskLevel === 'danger'
            ? '#ff2222'
            : d.riskLevel === 'warning'
            ? '#ffee00'
            : '#00ff44'
          : DISTRICT_COLORS[d.id] || '#3b82f6';

        const polygon = L.polygon(d.polygonCoords, {
          color: isSelected ? '#ffffff' : color,
          weight: isSelected ? 4 : 2,
          opacity: 0.95,
          fillColor: color,
          fillOpacity: isSelected ? 0.65 : isDark ? 0.45 : 0.35,
        });

        // Tooltip on hover
        polygon.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px; font-weight: 700; color: #0f172a; padding: 2px 4px;">
            <div>Kec. ${d.name} (${d.nativeKutaiName})</div>
            <div style="font-size: 10px; font-weight: 500; color: #475569;">ISPU ${d.ispu} &bull; ${d.population.toLocaleString('id-ID')} Jiwa</div>
          </div>`,
          { sticky: true, opacity: 0.95 }
        );

        polygon.on('click', () => {
          onSelectDistrict(d);
          setSelectedHotspot(null);
          setSelectedTps(null);
          setSelectedReport(null);
        });

        polygon.addTo(group);

        // Permanent on-map District Name Label for every sub-district
        const badgeColor =
          d.riskLevel === 'danger'
            ? '#ef4444'
            : d.riskLevel === 'warning'
            ? '#f59e0b'
            : '#10b981';

        const labelHtml = `
          <div class="district-badge-container" title="Kecamatan ${d.name} (${d.nativeKutaiName})">
            <span class="district-badge-dot" style="background-color: ${badgeColor};"></span>
            <span class="district-badge-text">Kec. ${d.name}</span>
          </div>
        `;

        const labelMarker = L.marker([d.lat, d.lng], {
          icon: L.divIcon({
            html: labelHtml,
            className: 'district-name-marker',
            iconSize: [0, 0],
          }),
          interactive: true,
        });

        labelMarker.on('click', () => {
          onSelectDistrict(d);
          setSelectedHotspot(null);
          setSelectedTps(null);
          setSelectedFireStation(null);
          setSelectedReport(null);
        });

        labelMarker.addTo(group);
      });

      // 1b. Render Outer Administrative Boundary of Kutai Timur & Neighboring Regencies
      if (showNeighborBorders) {
        // High-contrast dark casing underneath for crisp demarcation
        const casingPoly = L.polyline(KUTIM_OUTER_BOUNDARY, {
          color: isDark ? '#020617' : '#0f172a',
          weight: 7,
          opacity: 0.95,
        });
        casingPoly.addTo(group);

        const outerBoundaryPoly = L.polyline(KUTIM_OUTER_BOUNDARY, {
          color: isHighContrast ? '#ffff00' : '#f59e0b',
          weight: 3.5,
          dashArray: '10, 8',
          opacity: 1,
        });
        outerBoundaryPoly.bindTooltip(
          '<div style="font-weight: 800; font-size: 11px; color: #b45309;">Garis Batas Administratif Luar Kab. Kutai Timur</div>'
        );
        outerBoundaryPoly.addTo(group);

        // Border Demarcation Labels along Perimeter
        const BORDER_DEMARCATIONS = [
          { lat: 1.78, lng: 117.20, label: 'Batas Utara: Kab. Berau' },
          { lat: 0.98, lng: 115.82, label: 'Batas Barat: Mahakam Ulu & Kubar' },
          { lat: 0.22, lng: 116.95, label: 'Batas Selatan: Kab. Kukar' },
          { lat: 0.17, lng: 117.44, label: 'Batas Selatan: Kota Bontang' },
          { lat: 0.85, lng: 118.82, label: 'Batas Maritim: Selat Makassar' },
        ];

        BORDER_DEMARCATIONS.forEach((b) => {
          const borderLabelHtml = `
            <div style="
              background: rgba(15, 23, 42, 0.92);
              border: 1.5px solid #f59e0b;
              color: #fef08a;
              font-size: 9.5px;
              font-weight: 800;
              padding: 2px 7px;
              border-radius: 9999px;
              white-space: nowrap;
              box-shadow: 0 4px 10px rgba(0,0,0,0.4);
              transform: translate(-50%, -50%);
              letter-spacing: 0.02em;
            ">
              ${b.label}
            </div>
          `;
          const bMarker = L.marker([b.lat, b.lng], {
            icon: L.divIcon({
              html: borderLabelHtml,
              className: 'border-demarcation-label',
              iconSize: [0, 0],
            }),
            interactive: false,
          });
          bMarker.addTo(group);
        });

        // Render Neighboring Region Markers with borders
        KUTIM_NEIGHBORING_REGIONS.forEach((nr) => {
          const markerHtml = `
            <div class="neighbor-region-pill" title="${nr.description}">
              <span class="neighbor-direction">${nr.direction}</span>
              <span class="neighbor-name">${nr.name}</span>
            </div>
          `;
          const marker = L.marker([nr.lat, nr.lng], {
            icon: L.divIcon({
              html: markerHtml,
              className: 'neighbor-region-marker',
              iconSize: [0, 0],
            }),
            interactive: true,
          });
          marker.bindTooltip(`Batas Wilayah Luar: ${nr.name} (${nr.direction})`);
          marker.addTo(group);
        });
      }
    }

    // 2. Render Hotspots Pins (Unified NASA FIRMS VIIRS & MODIS Satellites)
    if (activeLayer === 'all' || activeLayer === 'hotspots') {
      hotspots.forEach((hs) => {
        const isSelected = selectedHotspot?.id === hs.id;
        const iconHtml = `
          <div style="
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            background-color: #ef4444;
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.6);
            transform: translate(-50%, -50%);
            transition: all 0.2s;
            cursor: pointer;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-hotspot-pin',
          iconSize: [0, 0],
        });

        const marker = L.marker([hs.lat, hs.lng], { icon: customIcon });
        marker.bindTooltip(`Titik Panas: ${hs.locationName} (${hs.satellite})`);

        marker.on('click', () => {
          setSelectedHotspot(hs);
          setSelectedTps(null);
          setSelectedFireStation(null);
          setSelectedReport(null);
          const parent = districts.find((d) => d.id === hs.districtId);
          if (parent) onSelectDistrict(parent);
        });

        marker.addTo(group);
      });
    }

    // 2b. Render Fire Stations (Posko Pemadam Kebakaran Disdamkartan & BPBD)
    if (activeLayer === 'all' || activeLayer === 'damkar') {
      fireStations.forEach((fs) => {
        const isSelected = selectedFireStation?.id === fs.id;
        const iconHtml = `
          <div style="
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            background: linear-gradient(135deg, #e11d48, #be123c);
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(225, 29, 72, 0.6);
            transform: translate(-50%, -50%);
            transition: all 0.2s;
            cursor: pointer;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8a2 2 0 0 0-2 2c0 1.5 2 3 2 3s2-1.5 2-3a2 2 0 0 0-2-2z"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-damkar-pin',
          iconSize: [0, 0],
        });

        const marker = L.marker([fs.lat, fs.lng], { icon: customIcon });
        marker.bindTooltip(`Pos Pemadam: ${fs.name} (Hotline: ${fs.hotline})`);

        marker.on('click', () => {
          setSelectedFireStation(fs);
          setSelectedHotspot(null);
          setSelectedTps(null);
          setSelectedReport(null);
          const parent = districts.find((d) => d.name.toLowerCase().includes(fs.district.toLowerCase()));
          if (parent) onSelectDistrict(parent);
        });

        marker.addTo(group);
      });
    }

    // 3. Render Bank Sampah Pins
    if (activeLayer === 'all' || activeLayer === 'bank_sampah') {
      const bankSampahDepots = tpsDepots.filter((d) => d.type === 'bank_sampah');
      bankSampahDepots.forEach((bs) => {
        const isSelected = selectedTps?.id === bs.id;
        const iconHtml = `
          <div style="
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            background: linear-gradient(135deg, #059669, #047857);
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(5, 150, 105, 0.6);
            transform: translate(-50%, -50%);
            transition: all 0.2s;
            cursor: pointer;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="8" cy="8" r="6"/>
              <path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
              <path d="M7 6h1v4"/>
              <path d="m16.71 13.88.7.71-2.82 2.82"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-bank-sampah-pin',
          iconSize: [0, 0],
        });

        const marker = L.marker([bs.lat, bs.lng], { icon: customIcon });
        marker.bindTooltip(`Bank Sampah: ${bs.name} (DLH Kutim)`);

        marker.on('click', () => {
          setSelectedTps(bs);
          setSelectedFireStation(null);
          setSelectedHotspot(null);
          setSelectedReport(null);
          const parent = districts.find((d) => bs.district.toLowerCase().includes(d.name.toLowerCase()));
          if (parent) onSelectDistrict(parent);
        });

        marker.addTo(group);
      });
    }

    // 3b. Render Official TPS & 3R Pins
    if (activeLayer === 'all' || activeLayer === 'tps') {
      const regularTps = tpsDepots.filter((d) => d.type !== 'bank_sampah');
      regularTps.forEach((tps) => {
        const isSelected = selectedTps?.id === tps.id;
        const iconHtml = `
          <div style="
            width: ${isSelected ? '30px' : '24px'};
            height: ${isSelected ? '30px' : '24px'};
            background-color: #10b981;
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.5);
            transform: translate(-50%, -50%);
            cursor: pointer;
          ">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.565-.89 1.78 1.78 0 0 0 .005-1.78l-3.95-6.83"/>
              <path d="M17 19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-tps-pin',
          iconSize: [0, 0],
        });

        const marker = L.marker([tps.lat, tps.lng], { icon: customIcon });
        marker.bindTooltip(`TPS Resmi: ${tps.name}`);

        marker.on('click', () => {
          setSelectedTps(tps);
          setSelectedFireStation(null);
          setSelectedHotspot(null);
          setSelectedReport(null);
        });

        marker.addTo(group);
      });
    }

    // 4. Render Citizen Reports Pins
    if (activeLayer === 'all' || activeLayer === 'reports') {
      citizenReports.forEach((rep) => {
        const isSelected = selectedReport?.id === rep.id;
        const iconHtml = `
          <div style="
            width: ${isSelected ? '30px' : '24px'};
            height: ${isSelected ? '30px' : '24px'};
            background-color: #f97316;
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(249, 115, 22, 0.6);
            transform: translate(-50%, -50%);
            cursor: pointer;
          ">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-report-pin',
          iconSize: [0, 0],
        });

        const marker = L.marker([rep.lat, rep.lng], { icon: customIcon });
        marker.bindTooltip(`Laporan Warga: ${rep.title}`);

        marker.on('click', () => {
          setSelectedReport(rep);
          setSelectedFireStation(null);
          setSelectedHotspot(null);
          setSelectedTps(null);
        });

        marker.addTo(group);
      });
    }
  }, [districts, filteredDistricts, hotspots, tpsDepots, fireStations, citizenReports, activeLayer, selectedDistrict, selectedHotspot, selectedTps, selectedFireStation, selectedReport, isHighContrast, isDark, showNeighborBorders]);

  // Handle scrollWheelZoom toggle safely
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (scrollZoomEnabled) {
      mapInstanceRef.current.scrollWheelZoom.enable();
    } else {
      mapInstanceRef.current.scrollWheelZoom.disable();
    }
  }, [scrollZoomEnabled]);

  // When selected district changes, gently pan
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDistrict) return;
    mapInstanceRef.current.panTo([selectedDistrict.lat, selectedDistrict.lng], {
      animate: true,
      duration: 0.8,
    });
  }, [selectedDistrict]);

  const handleZoom = (delta: number) => {
    if (!mapInstanceRef.current) return;
    const current = mapInstanceRef.current.getZoom();
    mapInstanceRef.current.setZoom(current + delta);
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(KUTIM_CENTER, KUTIM_DEFAULT_ZOOM, { animate: true });
    onSelectDistrict(null);
    setSelectedHotspot(null);
    setSelectedTps(null);
    setSelectedReport(null);
    stopSpeech();
    setIsSpeakingDistrict(false);
  };

  const handleSpeakDistrictProfile = (district: DistrictData) => {
    if (isSpeakingDistrict) {
      stopSpeech();
      setIsSpeakingDistrict(false);
      return;
    }

    const desc = district.description[settings.language] || district.description.id;
    const textToSpeak = `Kecamatan ${district.name}, dialek Kutai ${district.nativeKutaiName}. Jumlah penduduk mencapai ${district.population.toLocaleString('id-ID')} jiwa. ${district.specialty || ''}. Indeks standar pencemar udara saat ini adalah ${district.ispu}, dengan suhu ${district.temperature} derajat celcius dan ${district.hotspotCount} titik api aktif. ${desc}`;

    playSpeech(
      textToSpeak,
      settings.language,
      () => setIsSpeakingDistrict(true),
      () => setIsSpeakingDistrict(false),
      () => setIsSpeakingDistrict(false)
    );
  };

  // Find nearest TPS
  const nearestTps = useMemo(() => {
    if (!selectedDistrict) return null;
    return (
      tpsDepots.find((t) => t.district.toLowerCase().includes(selectedDistrict.name.toLowerCase())) ||
      tpsDepots[0]
    );
  }, [selectedDistrict, tpsDepots]);

  const syncMeta = getRealtimeSyncMeta();

  return (
    <div className="w-full space-y-4">
      {/* Widget Status Live: Terhubung ke Live Satellite Feed NASA FIRMS dengan Pulsing Green Dot & Siklus Update 05:00 WITA */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : isDark
            ? 'bg-slate-900 border-emerald-500/30 text-slate-100 shadow-md'
            : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                Terhubung ke Live Satellite Feed NASA FIRMS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold uppercase tracking-wider">
                Real-Time VIIRS &bull; MODIS
              </span>
            </div>
            <p className="text-[11px] opacity-85 mt-0.5 leading-snug">
              Seluruh data telemetry diperbarui otomatis setiap hari pukul <strong>05:00 WITA</strong> &bull; Sinkronisasi terakhir: <strong>{syncMeta.lastUpdatedFormatted}</strong>
            </p>
          </div>
        </div>

        {/* Quick Clickable Contact Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto text-xs flex-wrap">
          <a
            href="https://wa.me/6282258451435?text=Halo%20Admin%20SI%20OTAN%20Kutim%2C%20saya%20ingin%20melaporkan%20titik%20api%20atau%20kendala"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-transform hover:scale-[1.02]"
            title="Chat WhatsApp Admin Pengembang SI OTAN: 082258451435"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WA Admin: 082258451435</span>
          </a>
          <a
            href="tel:054921113"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs hover:border-emerald-500"
            title="Telepon BPBD Kutim: (0549) 21113"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            <span>BPBD: (0549) 21113</span>
          </a>
        </div>
      </div>

      {/* 1. Explainer Bar: ISPU Index Meaning */}
      <div
        className={`p-3 rounded-2xl border transition-all ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-300'
            : isDark
            ? 'bg-slate-900 text-slate-100 border-slate-700/80 shadow-md'
            : 'bg-white text-slate-800 border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" />
              <span>ISPU</span>
            </span>
            <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100">
              Panduan Nilai Indeks Udara:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-xs">
              <ShieldCheck className="w-3 h-3" />
              <span>0 - 50: Baik (Aman Berkat)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] shadow-xs">
              <AlertTriangle className="w-3 h-3" />
              <span>51 - 100: Sedang (Waspada)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] shadow-xs">
              <Flame className="w-3 h-3" />
              <span>101 - 200: Tidak Sehat (Pakai Masker)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-700 text-white font-bold text-[11px] shadow-xs">
              <AlertTriangle className="w-3 h-3" />
              <span>201 - 300+: Berbahaya</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Layer Switcher & Map Style */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Chips */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            {(
              [
                { id: 'all', label: t.layerAll || 'Semua', icon: Layers },
                { id: 'zones', label: t.layerZones || 'Zonasi Risiko', icon: ShieldCheck },
                { id: 'hotspots', label: 'Titik Panas (NASA FIRMS & VIIRS)', icon: Flame },
                { id: 'damkar', label: 'Pos Pemadam (113)', icon: Shield },
                { id: 'bank_sampah', label: 'Bank Sampah', icon: Coins },
                { id: 'tps', label: t.layerTps || 'TPS & 3R', icon: Trash2 },
                { id: 'reports', label: t.layerCitizenReports || 'Lapor Warga', icon: AlertTriangle },
              ] as const
            ).map((layer) => {
              const Icon = layer.icon;
              const isActive = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    isActive
                      ? isHighContrast
                        ? 'bg-yellow-400 text-black font-black'
                        : layer.id === 'damkar'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : layer.id === 'bank_sampah'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>

          {/* Map Base Tile Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setMapType('osm')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapType === 'osm'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setMapType('topo')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapType === 'topo'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Topografi
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapType === 'satellite'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Satelit
            </button>
          </div>

          {/* Outer Boundary Toggle Button */}
          <button
            onClick={() => setShowNeighborBorders(!showNeighborBorders)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showNeighborBorders
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
            title="Tampilkan garis batas luar kabupaten & wilayah tetangga (Berau, Kukar, Bontang, Mahulu)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{showNeighborBorders ? 'Batas Luar: Tampil' : 'Batas Luar: Sembunyi'}</span>
          </button>
        </div>

        {/* Search District & Zoom Tools */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari 18 kecamatan Kutim..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-emerald-500 shadow-xs"
            />
          </div>

          {/* Zoom controls & Scroll Wheel Lock */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleZoom(1)}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 font-bold"
              title="Perbesar Peta"
              aria-label="Perbesar Peta"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 font-bold"
              title="Perkecil Peta"
              aria-label="Perkecil Peta"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScrollZoomEnabled(!scrollZoomEnabled)}
              className={`p-1.5 rounded-lg font-bold transition-all ${
                scrollZoomEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100'
              }`}
              title={
                scrollZoomEnabled
                  ? 'Zoom scroll roda mouse AKTIF (Klik untuk kunci scroll aman)'
                  : 'Zoom scroll roda mouse TERKUNCI (Halaman web aman di-scroll tanpa peta meloncat)'
              }
              aria-label="Kunci atau aktifkan scroll zoom"
            >
              {scrollZoomEnabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 font-bold"
              title="Reset Tampilan"
              aria-label="Reset Tampilan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Map Canvas & District Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Leaflet Map Container with strict containment against scroll overflow */}
        <div
          className={`lg:col-span-8 map-canvas-container relative rounded-3xl overflow-hidden border-2 shadow-xl transition-all ${
            isHighContrast
              ? 'bg-black border-yellow-400'
              : isDark
              ? 'bg-slate-950 border-slate-700 shadow-slate-950/60'
              : 'bg-slate-100 border-slate-300 shadow-slate-200'
          }`}
          style={{ minHeight: '620px', height: '620px', isolation: 'isolate' }}
        >
          {/* Top Title & Boundary Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-slate-950/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 text-white shadow-xl flex items-center gap-3 pointer-events-auto max-w-[90%] sm:max-w-md">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-emerald-500/40 bg-white shadow-sm shrink-0 flex items-center justify-center p-0.5">
              <img
                src={logoImg}
                alt="Logo SI OTAN KUTIM"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="text-xs font-black tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                <span>PETA 18 KECAMATAN · KAB. KUTAI TIMUR</span>
              </div>
              <div className="text-[10px] text-amber-300 font-semibold leading-tight mt-0.5">
                Batas Luar: Berau (Utara) &bull; Kukar & Bontang (Selatan) &bull; Mahakam Ulu (Barat) &bull; Selat Makassar (Timur)
              </div>
            </div>
          </div>

          {/* Leaflet Map DOM Element with strict container constraints */}
          <div
            ref={mapContainerRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%', minHeight: '620px' }}
          />

          {/* Bottom Official Data Source Attribution on Map */}
          <div className="absolute bottom-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-[10px] font-medium flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Sumber: SIPONGI KLHK, NASA FIRMS, BMKG & DLH Kutai Timur</span>
          </div>
        </div>

        {/* 4. Side Inspector: Detailed Profile & Population Data */}
        <div
          className={`lg:col-span-4 rounded-3xl p-6 border-2 flex flex-col justify-between transition-all shadow-xl ${
            isHighContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : isDark
              ? 'bg-slate-900 text-slate-100 border-slate-700 shadow-slate-950/60'
              : 'bg-white text-slate-900 border-slate-200 shadow-sm'
          }`}
        >
          {selectedDistrict ? (
            <div className="space-y-4">
              {/* Header with dialect & badge */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase shadow-xs ${
                      selectedDistrict.riskLevel === 'danger'
                        ? 'bg-rose-600 text-white'
                        : selectedDistrict.riskLevel === 'warning'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {selectedDistrict.riskLevel === 'danger'
                      ? 'Zona Merah (Bahaya / Belewah)'
                      : selectedDistrict.riskLevel === 'warning'
                      ? 'Zona Waspada (Rawa)'
                      : 'Zona Aman (Aman Berkat)'}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Basa Kutai: {selectedDistrict.nativeKutaiName}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Kecamatan {selectedDistrict.name}
                  </h3>
                  <button
                    onClick={() => handleSpeakDistrictProfile(selectedDistrict)}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                    title="Dengarkan Profil Suara (TTS)"
                  >
                    {isSpeakingDistrict ? (
                      <VolumeX className="w-5 h-5 text-rose-500 animate-pulse" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {selectedDistrict.specialty && (
                  <p className="text-xs font-bold text-slate-700 dark:text-emerald-300 mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{selectedDistrict.specialty}</span>
                  </p>
                )}
              </div>

              {/* Data Jumlah Penduduk & Kepadatan (BPS Kutai Timur) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>Data Kependudukan Resmi</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">BPS Kutim 2024/2025</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] opacity-70 block font-semibold">Total Penduduk</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {selectedDistrict.population.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] opacity-60 block">Jiwa</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] opacity-70 block font-semibold">Kepadatan</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      {selectedDistrict.populationDensity}
                    </span>
                    <span className="text-[10px] opacity-60 block">Jiwa / km²</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                  Sumber: Badan Pusat Statistik (BPS) Kabupaten Kutai Timur & Disdukcapil Kutim.
                </p>
              </div>

              {/* ISPU & Environmental Metric Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase block">
                    Indeks ISPU
                  </span>
                  <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block my-0.5">
                    {selectedDistrict.ispu}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    PM2.5: {selectedDistrict.pm25} µg/m³
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase block">
                    Titik Api / Hotspot
                  </span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block my-0.5">
                    {selectedDistrict.hotspotCount} Titik
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Kekeringan: {selectedDistrict.drynessIndex}%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] opacity-70 block font-semibold">Suhu & Lembap:</span>
                  <span className="font-extrabold text-xs">
                    {selectedDistrict.temperature}°C / {selectedDistrict.humidity}%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] opacity-70 block font-semibold">Angin:</span>
                  <span className="font-extrabold text-xs">
                    {selectedDistrict.windSpeed} km/h · {selectedDistrict.windDirection}
                  </span>
                </div>
              </div>

              {/* Informative Short Profile */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Deskripsi & Karakteristik Wilayah:
                </span>
                <p className="leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                  {selectedDistrict.description[settings.language] || selectedDistrict.description.id}
                </p>
              </div>

              {/* Health Guidance */}
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
                  Saran Kesehatan Warga:
                </span>
                <p className="leading-relaxed text-slate-800 dark:text-slate-100">
                  {selectedDistrict.recommendations[settings.language] || selectedDistrict.recommendations.id}
                </p>
              </div>

              {/* Nearest Posko Damkar Recommendation */}
              {nearestFireStation && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                      <Shield className="w-4 h-4 text-rose-600" />
                      <span>Posko Damkar Rujukan Terdekat:</span>
                    </div>
                    <span className="text-[10px] font-black text-rose-600 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                      Siaga 24 Jam
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {nearestFireStation.name}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {nearestFireStation.address}
                  </div>
                  <div className="pt-1.5 flex items-center justify-between border-t border-rose-500/20">
                    <a
                      href={`tel:${nearestFireStation.hotline.split('/')[0].trim()}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 shadow-xs"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Telepon Posko: {nearestFireStation.hotline}</span>
                    </a>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Disdamkartan Kutim
                    </span>
                  </div>
                </div>
              )}

              {/* Nearest Bank Sampah Recommendation */}
              {nearestBankSampah && (
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
                      <Coins className="w-4 h-4 text-teal-600" />
                      <span>Bank Sampah Rujukan Terdekat:</span>
                    </div>
                    <span className="text-[10px] font-black text-teal-700 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-full">
                      Tukar Jadi Saldo
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {nearestBankSampah.name}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {nearestBankSampah.address} • {nearestBankSampah.operatingHours}
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 text-[10px] text-teal-800 dark:text-teal-300 font-medium">
                    {nearestBankSampah.antiBurnTip.id}
                  </div>
                </div>
              )}

              {/* Nearest TPS Depot Recommendation */}
              {nearestTps && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>TPS Resmi Rujukan Terdekat:</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {nearestTps.name}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {nearestTps.address} • {nearestTps.operatingHours}
                  </div>
                </div>
              )}

              {/* Data Source Footnote */}
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Sumber Data Terverifikasi Kecamatan:</span>
                </div>
                <div><strong>Kualitas Udara:</strong> {selectedDistrict.dataSource.airQuality}</div>
                <div><strong>Titik Panas:</strong> {selectedDistrict.dataSource.hotspots}</div>
                <div><strong>Persampahan:</strong> {selectedDistrict.dataSource.waste}</div>
              </div>
            </div>
          ) : selectedFireStation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white flex items-center gap-1.5 shadow-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>POSKO PEMADAM KEBAKARAN RESMI</span>
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {selectedFireStation.district}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedFireStation.name}
                </h3>
                <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{selectedFireStation.address}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 dark:text-rose-200">Kesiapsiagaan Personil:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{selectedFireStation.crewStatus}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Armada & Fasilitas Unit:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedFireStation.vehicles.map((v, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Wilayah Cakupan:</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{selectedFireStation.coverageArea}</p>
                </div>
              </div>

              {/* Direct Hotline Dialing */}
              <div className="p-3.5 rounded-2xl bg-rose-600 text-white space-y-2 shadow-md shadow-rose-600/30">
                <div className="text-xs font-black uppercase tracking-wider">Hubungi Panggilan Darurat</div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:113"
                    className="flex-1 py-2 px-3 rounded-xl bg-white text-rose-700 font-black text-center text-xs hover:bg-rose-50 transition-colors shadow-xs"
                  >
                    Hotline 113 Bebas Pulsa
                  </a>
                  <a
                    href={`tel:${selectedFireStation.phone.replace(/[^0-9]/g, '')}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-black text-center text-xs transition-colors shadow-xs"
                  >
                    Posko: {selectedFireStation.phone}
                  </a>
                </div>
              </div>

              {/* Official Source Card */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sumber Informasi Resmi Terverifikasi:</span>
                </div>
                <p>{selectedFireStation.dataSource}</p>
                <p className="text-slate-500">Komandan / Pimpinan: {selectedFireStation.commander}</p>
              </div>
            </div>
          ) : selectedHotspot ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>TITIK PANAS (HOTSPOT AKTIF)</span>
                </span>
                <span className="text-xs font-bold opacity-80">{selectedHotspot.satellite}</span>
              </div>
              <h3 className="text-xl font-black">{selectedHotspot.locationName}</h3>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Terdeteksi: {selectedHotspot.detectedAt} · Keyakinan Satelit: {selectedHotspot.confidence}% · Suhu Termal: {selectedHotspot.brightnessKelvin} Kelvin
              </p>
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs space-y-1">
                <span className="font-bold text-rose-800 dark:text-rose-300 block">
                  Kategori: {selectedHotspot.type === 'karhutla' ? 'Kebakaran Hutan & Lahan' : 'Pembakaran Sampah Liar'}
                </span>
                <p className="opacity-80">
                  Koordinat: {selectedHotspot.lat.toFixed(4)}, {selectedHotspot.lng.toFixed(4)}
                </p>
                <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-400">
                  Sumber: SIPONGI Kementerian LHK & NASA FIRMS Resource Management System
                </div>
              </div>
            </div>
          ) : selectedTps ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1.5 shadow-xs ${
                  selectedTps.type === 'bank_sampah' ? 'bg-teal-600' : 'bg-emerald-600'
                }`}>
                  {selectedTps.type === 'bank_sampah' ? (
                    <>
                      <Coins className="w-3.5 h-3.5" />
                      <span>BANK SAMPAH RESMI KUTAI TIMUR</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>TPS RESMI KUTAI TIMUR</span>
                    </>
                  )}
                </span>
                <span className="text-xs font-bold opacity-80">{selectedTps.district}</span>
              </div>

              <div>
                <h3 className="text-xl font-black">{selectedTps.name}</h3>
                <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{selectedTps.address}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">Jam Operasional:</span>
                  <span className="font-semibold">{selectedTps.operatingHours}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sampah yang Diterima:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTps.acceptedWaste.map((w, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="opacity-90">Kontak: {selectedTps.phone} ({selectedTps.contact})</div>
                <div className="text-slate-700 dark:text-slate-200">
                  Fasilitas: {selectedTps.facility}
                </div>
              </div>

              {/* Economic & Anti-Burn Tip */}
              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs space-y-1">
                <span className="font-bold text-teal-900 dark:text-teal-200 block">
                  Nilai Manfaat & Solusi Bersih:
                </span>
                <p className="text-teal-800 dark:text-teal-300 leading-relaxed font-medium">
                  {selectedTps.antiBurnTip[settings.language] || selectedTps.antiBurnTip.id}
                </p>
              </div>

              {/* Official Source Card */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sumber Informasi Resmi Terverifikasi:</span>
                </div>
                <p>{selectedTps.dataSource || 'Dinas Lingkungan Hidup (DLH) Kabupaten Kutai Timur & Asosiasi Bank Sampah Indonesia (ASBSI)'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shadow-inner">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  Pilih Wilayah pada Peta Leaflet
                </h3>
                <p className="text-xs font-medium opacity-80 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Peta digital OpenStreetMap 18 kecamatan Kabupaten Kutai Timur. Klik salah satu poligon wilayah atau titik pin pemadam kebakaran, bank sampah, dan TPS resmi untuk melihat informasi dan sumber terverifikasi.
                </p>
              </div>
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => onOpenReport(selectedDistrict?.name)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-all hover:scale-[1.01]"
            >
              <Flame className="w-4 h-4" />
              <span>
                {selectedDistrict
                  ? `Lapor Kejadian di ${selectedDistrict.name}`
                  : t.quickReportBtn}
              </span>
            </button>
            <div className="pt-2 text-center text-[10px] text-slate-500 dark:text-slate-400">
              Kontak Pengembang SI OTAN Kutim & Posko Siaga tersedia di widget pojok kanan bawah.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
