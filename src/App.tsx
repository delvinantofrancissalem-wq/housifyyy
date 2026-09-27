import React, { useState, useMemo } from 'react';
import { HouseProjectConfig } from './types/civil';
import { HOUSE_PRESETS } from './constants/presets';
import { calculateBoq } from './utils/boqCalculator';
import { generateFloorPlanLayout, PlacedRoom } from './utils/floorPlanGenerator';
import { formatCurrency } from './constants/currencies';
import { Navbar } from './components/Navbar';
import { BlueprintViewer } from './components/BlueprintViewer';
import { ZoningTable } from './components/ZoningTable';
import { BoqTable } from './components/BoqTable';
import { LaborOverheadTable } from './components/LaborOverheadTable';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { HouseSpecForm } from './components/HouseSpecForm';
import { PrintReportModal } from './components/PrintReportModal';
import { AiCivilConsultant } from './components/AiCivilConsultant';
import {
  Compass,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Check,
  Building,
  Ruler,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Initial state from first preset (3-BHK Villa)
  const [config, setConfig] = useState<HouseProjectConfig>(HOUSE_PRESETS[0].config);
  const [selectedRoom, setSelectedRoom] = useState<PlacedRoom | null>(null);
  const [isSpecEditorOpen, setIsSpecEditorOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('blueprint');

  // Compute BOQ and Layout dynamically based on config
  const boqResult = useMemo(() => calculateBoq(config), [config]);
  const layout = useMemo(() => generateFloorPlanLayout(config), [config]);

  const handleApplyPreset = (presetId: string) => {
    const preset = HOUSE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setConfig({ ...preset.config });
      setSelectedRoom(null);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isMetric = config.unitSystem === 'metric';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenAiConsultant={() => setIsAiConsultantOpen(true)}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Project Header Banner & High-Level KPIs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                  Civil Engineering & Architectural Appraisal
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400 font-mono">
                  Plot: {config.plot.plotWidthFt}&apos; × {config.plot.plotLengthFt}&apos;
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
                {config.projectName}
              </h1>
            </div>

            {/* Quick Presets & Toggle Configuration */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSpecEditorOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                <span>{isSpecEditorOpen ? 'Hide Parameters' : 'Edit Specifications'}</span>
                {isSpecEditorOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Quick KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 text-xs font-mono">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Built-Up Area</span>
              <span className="text-sm font-bold text-slate-100 tabular-nums">
                {isMetric ? `${boqResult.totalBuiltUpAreaSqM} m²` : `${boqResult.totalBuiltUpAreaSqFt} sq.ft`}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Plot Size & FAR</span>
              <span className="text-sm font-bold text-slate-100 tabular-nums">
                {boqResult.totalPlotAreaSqFt} ft² · FAR {boqResult.farRatio}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Quality Tier</span>
              <span className="text-sm font-bold text-amber-400 uppercase">
                {config.qualityTier}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Direct Materials</span>
              <span className="text-sm font-bold text-sky-400 tabular-nums">
                {formatCurrency(boqResult.totalMaterialCost, config.currency)}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Labor & Trades</span>
              <span className="text-sm font-bold text-amber-300 tabular-nums">
                {formatCurrency(boqResult.totalLaborCost, config.currency)}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Total Estimate</span>
              <span className="text-sm font-extrabold text-emerald-400 tabular-nums">
                {formatCurrency(boqResult.grandTotalCost, config.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Specification Editor */}
        {isSpecEditorOpen && (
          <HouseSpecForm
            config={config}
            onChange={(newConfig) => setConfig(newConfig)}
            onApplyPreset={handleApplyPreset}
          />
        )}

        {/* SECTION 1: ARCHITECTURAL FLOOR PLAN & BLUEPRINT SPECIFICATION */}
        <section id="blueprint" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="text-sky-400 font-mono">01.</span>
                <span>Architectural Floor Plan & Blueprint Layout Specification</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Technical 2D CAD blueprint with labeled walls, doors [D], windows [W], and circulation pathways
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              Scale 1/4&quot; = 1&apos;-0&quot; · Orientation: North ↑
            </div>
          </div>

          {/* Interactive Scalable Blueprint CAD Viewer */}
          <BlueprintViewer
            config={config}
            layout={layout}
            onSelectRoom={(r) => setSelectedRoom(r)}
            selectedRoomId={selectedRoom?.id}
          />

          {/* Spatial Zoning & Dimensions Table */}
          <div id="zoning">
            <ZoningTable
              rooms={config.rooms}
              unitSystem={config.unitSystem}
              onSelectRoom={(r) => {
                const found = layout.placedRooms.find((p) => p.id === r.id);
                if (found) setSelectedRoom(found);
              }}
              selectedRoomId={selectedRoom?.id}
            />
          </div>
        </section>

        {/* SECTION 2: ITEMIZED MATERIAL & COMPONENT COST ESTIMATION (BOQ) */}
        <section id="boq" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="text-sky-400 font-mono">02.</span>
                <span>Itemized Material & Component Cost Estimation (Bill of Quantities)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Structural rebar steel, cement bags, fine/coarse aggregates, masonry, architectural finishes & MEP
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Currency: <strong className="text-slate-200">{config.currency}</strong>
            </div>
          </div>

          <BoqTable
            structuralItems={boqResult.structuralItems}
            finishingItems={boqResult.finishingItems}
            interiorItems={boqResult.interiorItems}
            exteriorItems={boqResult.exteriorItems}
            currency={config.currency}
          />
        </section>

        {/* SECTION 3: LABOR, SUPERVISION & OVERHEAD COSTS */}
        <section id="labor" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="text-sky-400 font-mono">03.</span>
                <span>Labor, Supervision & Regulatory Overhead Costs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Contractor trade labor, architectural & structural design fees, municipal permits, and contingency reserve
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Contingency: <strong className="text-amber-400">{config.contingencyPercent}%</strong>
            </div>
          </div>

          <LaborOverheadTable
            laborItems={boqResult.laborItems}
            overheadItems={boqResult.overheadItems}
            contingencyPercent={config.contingencyPercent}
            totalContingencyCost={boqResult.totalContingencyCost}
            currency={config.currency}
          />
        </section>

        {/* SECTION 4: SUMMARY & GRAND TOTAL */}
        <section id="summary" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="text-sky-400 font-mono">04.</span>
                <span>Executive Summary, Grand Total & Value-Engineering</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Executive cost synthesis, cost per unit area, and practical value-engineering optimizations
              </p>
            </div>
          </div>

          <ExecutiveSummary
            result={boqResult}
            currency={config.currency}
            unitSystem={config.unitSystem}
          />
        </section>
      </main>

      {/* Clean Engineering Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-slate-300 font-semibold mb-0.5">Architron Civil & Quantity Survey Engine</div>
            <div>Parametric residential estimation standard based on ACI 318, EN 1992, and IS 456 civil guidelines.</div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('blueprint')}
              className="hover:text-slate-300 transition-colors"
            >
              Back to Top ↑
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Print Docket
            </button>
            <span>·</span>
            <button
              onClick={() => setIsAiConsultantOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              AI Consultant
            </button>
          </div>
        </div>
      </footer>

      {/* Print / Save PDF Modal */}
      {isPrintModalOpen && (
        <PrintReportModal
          config={config}
          result={boqResult}
          currency={config.currency}
          unitSystem={config.unitSystem}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* AI Civil Consultant Modal */}
      {isAiConsultantOpen && (
        <AiCivilConsultant
          config={config}
          result={boqResult}
          currency={config.currency}
          onClose={() => setIsAiConsultantOpen(false)}
        />
      )}
    </div>
  );
}
