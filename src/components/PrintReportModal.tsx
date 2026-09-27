import React from 'react';
import {
  BoqCalculationResult,
  HouseProjectConfig,
  CurrencyCode,
  UnitSystem,
} from '../types/civil';
import { formatCurrency } from '../constants/currencies';
import { X, Printer, CheckCircle, FileText } from 'lucide-react';

interface PrintReportModalProps {
  config: HouseProjectConfig;
  result: BoqCalculationResult;
  currency: CurrencyCode;
  unitSystem: UnitSystem;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  config,
  result,
  currency,
  unitSystem,
  onClose,
}) => {
  const isMetric = unitSystem === 'metric';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Civil Engineering & Quantity Survey Docket Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div id="printable-docket" className="p-8 overflow-y-auto bg-white text-slate-900 font-sans print:p-0">
          {/* Engineering Docket Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                {config.projectName}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Official Bill of Quantities (BOQ) & Architectural Layout Specification
              </div>
            </div>
            <div className="text-right text-xs font-mono">
              <div className="font-bold text-slate-900">ARCH-BOQ-DOC-2026</div>
              <div className="text-slate-500">Date: {new Date().toLocaleDateString()}</div>
              <div className="text-slate-500">Status: Approved Baseline</div>
            </div>
          </div>

          {/* Key Parameters */}
          <div className="grid grid-cols-4 gap-3 p-3 bg-slate-100 rounded-lg text-xs mb-6 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Plot Area</span>
              <strong className="text-slate-900">{result.totalPlotAreaSqFt} sq.ft</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Built-Up Area</span>
              <strong className="text-slate-900">
                {isMetric ? `${result.totalBuiltUpAreaSqM} m²` : `${result.totalBuiltUpAreaSqFt} sq.ft`}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Finish Tier</span>
              <strong className="text-slate-900 uppercase">{config.qualityTier}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Currency</span>
              <strong className="text-slate-900 font-bold">{config.currency}</strong>
            </div>
          </div>

          {/* Executive Cost Breakdown */}
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-1">
            01. Cost Summary & Synthesis
          </h4>
          <table className="w-full text-xs text-left mb-6 border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-mono text-[11px]">
              <tr>
                <th className="p-2 border-b">Classification</th>
                <th className="p-2 border-b text-right">Share (%)</th>
                <th className="p-2 border-b text-right">Amount ({config.currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr>
                <td className="p-2 font-medium">Civil, Structural & Architectural Materials</td>
                <td className="p-2 text-right">{result.materialPercentage}%</td>
                <td className="p-2 text-right font-bold">{formatCurrency(result.totalMaterialCost, currency)}</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Labor & Trade Subcontractors</td>
                <td className="p-2 text-right">{result.laborPercentage}%</td>
                <td className="p-2 text-right font-bold">{formatCurrency(result.totalLaborCost, currency)}</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Architectural Fees, Approvals & Site Supervision</td>
                <td className="p-2 text-right">{result.overheadPercentage}%</td>
                <td className="p-2 text-right font-bold">{formatCurrency(result.totalOverheadAndPermits, currency)}</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Statutory Contingency Reserve ({config.contingencyPercent}%)</td>
                <td className="p-2 text-right">{result.contingencyPercentage}%</td>
                <td className="p-2 text-right font-bold">{formatCurrency(result.totalContingencyCost, currency)}</td>
              </tr>
              <tr className="bg-slate-100 font-bold text-slate-900">
                <td className="p-2.5">GRAND TOTAL ESTIMATED COST</td>
                <td className="p-2.5 text-right">100.0%</td>
                <td className="p-2.5 text-right text-sm">{formatCurrency(result.grandTotalCost, currency)}</td>
              </tr>
            </tbody>
          </table>

          {/* Average Rates */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono text-amber-900 mb-6 flex justify-between">
            <span>
              Estimated Unit Rate:{' '}
              <strong>
                {isMetric
                  ? `${formatCurrency(result.costPerSqM, currency)} / m²`
                  : `${formatCurrency(result.costPerSqFt, currency)} / sq.ft`}
              </strong>
            </span>
            <span>Steel Ratio: {config.steelRatioKgPerSqFt} kg/ft² · Cement: {config.cementBagsPerSqFt} bags/ft²</span>
          </div>

          {/* Value Engineering Recommendations */}
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-1">
            02. Value-Engineering Recommendations
          </h4>
          <div className="space-y-2 mb-6 text-xs">
            {result.valueEngineeringTips.map((tip, idx) => (
              <div key={idx} className="p-2.5 border border-slate-200 rounded">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>{idx + 1}. {tip.title}</span>
                  <span className="text-emerald-700 font-mono">{tip.savingsPotential}</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">{tip.description}</p>
              </div>
            ))}
          </div>

          {/* Signoff Stamp Block */}
          <div className="border-t-2 border-slate-900 pt-4 mt-8 flex justify-between items-end text-xs font-mono">
            <div>
              <div className="font-bold text-slate-900">CIVIL ENGINEERING & QUANTITY SURVEY AUDIT</div>
              <div className="text-slate-500 text-[10px]">Parametric BOQ Standard EN 1992 / IS 456 / ACI 318</div>
            </div>
            <div className="text-right">
              <div className="w-44 border-b border-slate-900 mb-1" />
              <div className="text-slate-900 font-bold">Principal Quantity Surveyor</div>
              <div className="text-slate-500 text-[10px]">Registered Structural Engineer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
