import React from 'react';
import { LaborItem, OverheadPermitItem, CurrencyCode } from '../types/civil';
import { formatCurrency } from '../constants/currencies';
import { HardHat, FileText, ShieldAlert } from 'lucide-react';

interface LaborOverheadTableProps {
  laborItems: LaborItem[];
  overheadItems: OverheadPermitItem[];
  contingencyPercent: number;
  totalContingencyCost: number;
  currency: CurrencyCode;
}

export const LaborOverheadTable: React.FC<LaborOverheadTableProps> = ({
  laborItems,
  overheadItems,
  contingencyPercent,
  totalContingencyCost,
  currency,
}) => {
  const totalLaborCost = laborItems.reduce((acc, i) => acc + i.totalCost, 0);
  const totalOverheadCost = overheadItems.reduce((acc, i) => acc + i.amount, 0);
  const combinedTotal = totalLaborCost + totalOverheadCost + totalContingencyCost;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 bg-slate-950/70 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <span>03. Labor, Supervision & Regulatory Overhead Costs</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Skilled trade contractor mandays, architectural engineering oversight, permits & risk buffer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Trade Labor Expenses */}
        <div>
          <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <HardHat className="w-3.5 h-3.5 text-amber-400" />
              Contractor Trade Labor Schedule
            </span>
            <span className="font-mono text-slate-400">
              Subtotal: <strong className="text-emerald-400">{formatCurrency(totalLaborCost, currency)}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Trade Craft</th>
                  <th className="py-2.5 px-3">Scope of Work</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {laborItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {item.trade}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {item.description}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                      {formatCurrency(item.ratePerUnit, currency)}/{item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-400 font-bold">
                      {formatCurrency(item.totalCost, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Engineering, Permits & Contingency */}
        <div>
          <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              Supervision, Permits & Contingency Reserve
            </span>
            <span className="font-mono text-slate-400">
              Subtotal: <strong className="text-emerald-400">{formatCurrency(totalOverheadCost + totalContingencyCost, currency)}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Overhead Head</th>
                  <th className="py-2.5 px-3">Statutory Basis / Basis</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {overheadItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-200">{item.title}</div>
                      <span className="text-[11px] text-slate-400">{item.description}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {item.basis}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-400 font-bold">
                      {formatCurrency(item.amount, currency)}
                    </td>
                  </tr>
                ))}

                {/* Contingency Row */}
                <tr className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      Statutory Contingency Reserve ({contingencyPercent}%)
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Price escalation hedge, subsurface anomalies & unpredicted change orders
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {contingencyPercent}% of direct construction cost
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-400 font-bold">
                    {formatCurrency(totalContingencyCost, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="text-slate-400">
          Labor accounts for approx ~25-30% of total civil outlay; contingency safeguards against material price spikes.
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Combined Labor, Design & Contingency:</span>
          <span className="text-emerald-400 font-bold text-base tabular-nums">
            {formatCurrency(combinedTotal, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
