/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AccessibilitySettings,
  DistrictData,
  HotspotPin,
  WasteDepot,
  CitizenReport,
  Language,
  FireStation,
} from './types';
import {
  KUTIM_DISTRICTS,
  KUTIM_HOTSPOTS,
  KUTIM_TPS_DEPOTS,
  KUTIM_FIRE_STATIONS,
  INITIAL_CITIZEN_REPORTS,
  CURRENT_AIR_QUALITY,
} from './data/kutimData';
import { Header } from './components/Header';
import { AirQualityBanner } from './components/AirQualityBanner';
import { InteractiveMap } from './components/InteractiveMap';
import { AirQualityPanel } from './components/AirQualityPanel';
import { TpsDirectory } from './components/TpsDirectory';
import { CitizenReportsFeed } from './components/CitizenReportsFeed';
import { KarhutlaEducationHub } from './components/KarhutlaEducationHub';
import { EducationHub } from './components/EducationHub';
import { FunFactsSection } from './components/FunFactsSection';
import { AccessibilityModal } from './components/AccessibilityModal';
import { ReportModal } from './components/ReportModal';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { Footer } from './components/Footer';
import { getDailySynchronizedHotspots } from './utils/realtimeUpdate';

export default function App() {
  // Accessibility state
  const [settings, setSettings] = useState<AccessibilitySettings>({
    textSize: 'normal',
    fontDyslexic: false,
    contrastMode: 'normal',
    language: 'id',
    soundEnabled: true,
  });

  // App navigation & data state
  const [activeTab, setActiveTab] = useState<
    'map' | 'air' | 'tps' | 'reports' | 'karhutla' | 'education' | 'funfact'
  >('map');
  const [districts, setDistricts] = useState<DistrictData[]>(KUTIM_DISTRICTS);
  const [hotspots, setHotspots] = useState<HotspotPin[]>(() =>
    getDailySynchronizedHotspots(KUTIM_HOTSPOTS)
  );
  const [tpsDepots, setTpsDepots] = useState<WasteDepot[]>(KUTIM_TPS_DEPOTS);
  const [fireStations] = useState<FireStation[]>(KUTIM_FIRE_STATIONS);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(
    INITIAL_CITIZEN_REPORTS
  );
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);

  // Modals state
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [prefilledDistrict, setPrefilledDistrict] = useState<string | undefined>(undefined);

  // Synchronize accessibility styles on html/body elements
  useEffect(() => {
    // 1. Text sizing class on <html>
    const html = document.documentElement;
    html.classList.remove('text-size-normal', 'text-size-large', 'text-size-xl');
    html.classList.add(`text-size-${settings.textSize}`);
    html.setAttribute('lang', settings.language === 'kt' ? 'id' : settings.language);

    // 2. Body styling: font & contrast
    const body = document.body;
    body.classList.remove('font-dyslexic', 'high-contrast', 'dark');

    if (settings.fontDyslexic) {
      body.classList.add('font-dyslexic');
    }
    if (settings.contrastMode === 'high-contrast') {
      body.classList.add('high-contrast');
    } else if (settings.contrastMode === 'dark') {
      body.classList.add('dark');
    }
  }, [settings]);

  // Handle adding new crowdsourced citizen report
  const handleAddReport = (newReport: CitizenReport) => {
    setCitizenReports((prev) => [newReport, ...prev]);

    // Also add to active hotspots if it's fire or burning
    if (
      newReport.category === 'illegal_burning' ||
      newReport.category === 'wildfire_hotspot'
    ) {
      const newHotspot: HotspotPin = {
        id: `hs-new-${Date.now().toString().slice(-4)}`,
        districtId: newReport.district.toLowerCase().replace(/\s+/g, '_'),
        districtName: newReport.district,
        locationName: newReport.locationDescription,
        lat: newReport.lat,
        lng: newReport.lng,
        svgX: newReport.svgX,
        svgY: newReport.svgY,
        confidence: 96,
        satellite: 'Laporan Warga',
        detectedAt: 'Baru saja',
        brightnessKelvin: 350,
        type: newReport.category === 'illegal_burning' ? 'pembakaran_sampah' : 'karhutla',
      };
      setHotspots((prev) => [newHotspot, ...prev]);
    }
  };

  const handleOpenReportModal = (districtName?: string) => {
    setPrefilledDistrict(districtName);
    setIsReportOpen(true);
  };

  const handleSelectOnMap = (depot: WasteDepot) => {
    const parentDistrict = districts.find((d) =>
      depot.district.toLowerCase().includes(d.name.toLowerCase())
    );
    if (parentDistrict) {
      setSelectedDistrict(parentDistrict);
    }
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReportOnMap = (report: CitizenReport) => {
    const parentDistrict = districts.find((d) =>
      report.district.toLowerCase().includes(d.name.toLowerCase())
    );
    if (parentDistrict) {
      setSelectedDistrict(parentDistrict);
    }
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHighContrast = settings.contrastMode === 'high-contrast';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isHighContrast
          ? 'bg-black text-yellow-300'
          : settings.contrastMode === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-50/70 text-slate-900'
      }`}
    >
      {/* 1. Universal Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => handleOpenReportModal()}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        settings={settings}
        onUpdateLanguage={(l: Language) => setSettings({ ...settings, language: l })}
      />

      {/* 2. Air Quality Early Warning Banner & Audio Speaker */}
      <AirQualityBanner
        airQuality={CURRENT_AIR_QUALITY}
        settings={settings}
      />

      {/* 3. Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {activeTab === 'map' && (
          <InteractiveMap
            districts={districts}
            hotspots={hotspots}
            tpsDepots={tpsDepots}
            fireStations={fireStations}
            citizenReports={citizenReports}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            onOpenReport={handleOpenReportModal}
            settings={settings}
          />
        )}

        {activeTab === 'air' && (
          <AirQualityPanel
            airQuality={CURRENT_AIR_QUALITY}
            settings={settings}
          />
        )}

        {activeTab === 'tps' && (
          <TpsDirectory
            tpsDepots={tpsDepots}
            settings={settings}
            onSelectOnMap={handleSelectOnMap}
          />
        )}

        {activeTab === 'reports' && (
          <CitizenReportsFeed
            reports={citizenReports}
            settings={settings}
            onOpenReportModal={() => handleOpenReportModal()}
            onSelectReportOnMap={handleSelectReportOnMap}
            onClose={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'karhutla' && (
          <KarhutlaEducationHub
            settings={settings}
            onOpenReport={() => handleOpenReportModal()}
          />
        )}

        {activeTab === 'education' && (
          <EducationHub settings={settings} />
        )}

        {activeTab === 'funfact' && (
          <FunFactsSection settings={settings} />
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        settings={settings}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onSelectTab={setActiveTab}
      />

      {/* Floating Emergency & Developer Contact Widget (Bottom Right) */}
      <FloatingContactWidget settings={settings} />

      {/* Accessibility Controls Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Fast Citizen Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        districts={districts}
        prefilledDistrict={prefilledDistrict}
        onAddReport={handleAddReport}
        settings={settings}
      />
    </div>
  );
}
