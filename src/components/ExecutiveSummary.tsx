import React from 'react';
import { BoqCalculationResult, CurrencyCode, UnitSystem } from '../types/civil';
import { formatCurrency } from '../constants/currencies';
import {
  TrendingDown,
  Lightbulb,
  AlertTriangle,
  Building2,
  Percent,
  CheckCircle,
  FileCheck2,
  DollarSign,
} from 'lucide-react';

interface ExecutiveSummaryProps {
  result: BoqCalculationResult;
  currency: CurrencyCode;
  unitSystem: UnitSystem;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  result,
  currency,
  unitSystem,
}) => {
  const isMetric = unitSystem === 'metric';

  return (
    <div className="space-y-6">
      {/* 4.1 Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Materials */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Direct Materials Cost
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">
              {formatCurrency(result.totalMaterialCost, currency)}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Share of Project</span>
            <span className="font-mono text-sky-400 font-semibold tabular-nums">
              {result.materialPercentage}%
            </span>
          </div>
        </div>

        {/* Card 2: Total Labor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Labor & Trade Contractors
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">
              {formatCurrency(result.totalLaborCost, currency)}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Share of Project</span>
            <span className="font-mono text-amber-400 font-semibold tabular-nums">
              {result.laborPercentage}%
            </span>
          </div>
        </div>

        {/* Card 3: Permits & Design & Contingency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Design, Permits & Contingency
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">
              {formatCurrency(result.totalOverheadAndPermits + result.totalContingencyCost, currency)}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Share of Project</span>
            <span className="font-mono text-indigo-400 font-semibold tabular-nums">
              {(result.overheadPercentage + result.contingencyPercentage).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Card 4: Grand Total */}
        <div className="bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/30 rounded-xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider block mb-1 font-semibold">
              Grand Total Construction Estimate
            </span>
            <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-400">
              {formatCurrency(result.grandTotalCost, currency)}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800/80 pt-2">
            <span>Est. Rate / Area</span>
            <span className="font-mono text-sky-300 font-bold tabular-nums">
              {isMetric
                ? `${formatCurrency(result.costPerSqM, currency)} / m²`
                : `${formatCurrency(result.costPerSqFt, currency)} / sq.ft`}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Cost Allocation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Capital Allocation Breakdown</span>
          <span>Built-up Footprint: {isMetric ? `${result.totalBuiltUpAreaSqM} m²` : `${result.totalBuiltUpAreaSqFt} sq.ft`}</span>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${result.materialPercentage}%` }}
            className="bg-sky-500 transition-all duration-500"
            title={`Materials: ${result.materialPercentage}%`}
          />
          <div
            style={{ width: `${result.laborPercentage}%` }}
            className="bg-amber-500 transition-all duration-500"
            title={`Labor: ${result.laborPercentage}%`}
          />
          <div
            style={{ width: `${result.overheadPercentage}%` }}
            className="bg-indigo-500 transition-all duration-500"
            title={`Permits & Design: ${result.overheadPercentage}%`}
          />
          <div
            style={{ width: `${result.contingencyPercentage}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Contingency: ${result.contingencyPercentage}%`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-5 mt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
            Materials ({result.materialPercentage}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            Labor ({result.laborPercentage}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
            Permits & Engineering ({result.overheadPercentage}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            Contingency ({result.contingencyPercentage}%)
          </span>
        </div>
      </div>

      {/* Executive Summary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-sky-400" />
            <span>04. Executive Quantity Survey & Cost Synthesis</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Section 4 Summary</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Component Classification</th>
                <th className="py-3 px-4">Cost Basis & Description</th>
                <th className="py-3 px-3 text-right">Share (%)</th>
                <th className="py-3 px-4 text-right">Estimated Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">
                  Total Civil & Architectural Materials
                </td>
                <td className="py-3 px-4 text-slate-400 font-sans">
                  Structural rebar, cement, aggregates, masonry, glazing, electrical, plumbing & millwork
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-300">
                  {result.materialPercentage}%
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-100 font-bold">
                  {formatCurrency(result.totalMaterialCost, currency)}
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">
                  Total Labor & Trade Contractors
                </td>
                <td className="py-3 px-4 text-slate-400 font-sans">
                  Masonry, shuttering, RCC casting, MEP channelling, tiling & finishing teams
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-300">
                  {result.laborPercentage}%
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-100 font-bold">
                  {formatCurrency(result.totalLaborCost, currency)}
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">
                  Architectural, Structural Design & Permits
                </td>
                <td className="py-3 px-4 text-slate-400 font-sans">
                  Full CAD engineering docket, municipal sanctions, utility meters & resident supervision
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-300">
                  {result.overheadPercentage}%
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-100 font-bold">
                  {formatCurrency(result.totalOverheadAndPermits, currency)}
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">
                  Statutory Contingency Reserve
                </td>
                <td className="py-3 px-4 text-slate-400 font-sans">
                  Risk mitigation hedge against material inflation, seasonal anomalies & field variations
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-300">
                  {result.contingencyPercentage}%
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-amber-400 font-bold">
                  {formatCurrency(result.totalContingencyCost, currency)}
                </td>
              </tr>

              <tr className="bg-sky-950/40 border-t-2 border-sky-500/40 text-sm">
                <td className="py-4 px-4 font-extrabold text-sky-300">
                  GRAND TOTAL ESTIMATED COST
                </td>
                <td className="py-4 px-4 text-slate-300 font-sans text-xs">
                  All direct materials + labor + engineering supervision + permits + contingency
                </td>
                <td className="py-4 px-3 text-right tabular-nums text-sky-400 font-bold">
                  100.0%
                </td>
                <td className="py-4 px-4 text-right tabular-nums text-emerald-400 font-black text-base">
                  {formatCurrency(result.grandTotalCost, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Value-Engineering Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <div>
            <h4 className="text-sm font-semibold text-slate-100">
              Practical Value-Engineering Recommendations
            </h4>
            <p className="text-xs text-slate-400">
              Proven cost reductions without compromising structural integrity or seismic resistance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.valueEngineeringTips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-sky-400 font-semibold">{tip.category}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    {tip.savingsPotential}
                  </span>
                </div>
                <h5 className="text-sm font-semibold text-slate-100 mb-2">{tip.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {tip.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                <span className="text-amber-400 font-medium block mb-0.5">Actionable Spec:</span>
                {tip.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Disclaimer */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200/90">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-amber-300">
            Civil Engineering Site Conditions Notice:
          </strong>{' '}
          This estimate is calculated utilizing regional standard parametric civil ratios. Actual construction tenders will vary depending on site-specific geotechnical soil load-bearing capacity (SBC), water table depth, seasonal monsoon constraints, local municipal seismic zones, and real-time raw material market indices. Always conduct a borehole soil test prior to casting structural footings.
        </div>
      </div>
    </div>
  );
};
