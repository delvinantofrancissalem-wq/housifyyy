import React, { useState } from 'react';
import { BoqItem, CurrencyCode } from '../types/civil';
import { formatCurrency } from '../constants/currencies';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Wrench,
  Hammer,
  Home,
  TreePine,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

interface BoqTableProps {
  structuralItems: BoqItem[];
  finishingItems: BoqItem[];
  interiorItems: BoqItem[];
  exteriorItems: BoqItem[];
  currency: CurrencyCode;
}

export const BoqTable: React.FC<BoqTableProps> = ({
  structuralItems,
  finishingItems,
  interiorItems,
  exteriorItems,
  currency,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'structural' | 'finishing' | 'interior' | 'exterior'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allItems: BoqItem[] = [
    ...structuralItems,
    ...finishingItems,
    ...interiorItems,
    ...exteriorItems,
  ];

  const structuralTotal = structuralItems.reduce((acc, i) => acc + i.totalCost, 0);
  const finishingTotal = finishingItems.reduce((acc, i) => acc + i.totalCost, 0);
  const interiorTotal = interiorItems.reduce((acc, i) => acc + i.totalCost, 0);
  const exteriorTotal = exteriorItems.reduce((acc, i) => acc + i.totalCost, 0);
  const grandTotal = structuralTotal + finishingTotal + interiorTotal + exteriorTotal;

  const filteredItems = allItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const exportCsv = () => {
    const headers = ['Category', 'Item Name', 'Engineering Specification', 'Quantity', 'Unit', 'Unit Cost', 'Total Cost', 'Notes'];
    const rows = filteredItems.map((item) => [
      item.category.toUpperCase(),
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.specification.replace(/"/g, '""')}"`,
      item.quantity,
      item.unit,
      item.unitCost,
      item.totalCost,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bill_of_Quantities_${currency}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Table Header */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>02. Itemized Material & Component Cost Estimation (Bill of Quantities)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Engineering quantities, standard units, specifications, and localized unit rates
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          Export BOQ CSV
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeCategory === 'all'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Items ({allItems.length})
          </button>
          <button
            onClick={() => setActiveCategory('structural')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeCategory === 'structural'
                ? 'bg-sky-500/20 text-sky-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Structural & Civil ({structuralItems.length})
          </button>
          <button
            onClick={() => setActiveCategory('finishing')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeCategory === 'finishing'
                ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Finishing & Architectural ({finishingItems.length})
          </button>
          <button
            onClick={() => setActiveCategory('interior')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeCategory === 'interior'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interiors ({interiorItems.length})
          </button>
          <button
            onClick={() => setActiveCategory('exterior')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeCategory === 'exterior'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exterior & Site ({exteriorItems.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material or spec..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Itemized Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Item & Material</th>
              <th className="py-3 px-4">Engineering Specification</th>
              <th className="py-3 px-3 text-right">Quantity</th>
              <th className="py-3 px-3">Unit</th>
              <th className="py-3 px-3 text-right">Unit Rate</th>
              <th className="py-3 px-4 text-right">Total Cost</th>
              <th className="py-3 px-4">Application Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300 max-w-[280px]">
                  {item.specification}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-100 font-medium">
                  {typeof item.quantity === 'number' ? item.quantity.toLocaleString() : item.quantity}
                </td>
                <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                  {item.unit}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                  {formatCurrency(item.unitCost, currency)}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                  {formatCurrency(item.totalCost, currency)}
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">
                  {item.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subtotal Summary Footer */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-400">
          <span>
            Structural: <strong className="text-slate-200">{formatCurrency(structuralTotal, currency)}</strong>
          </span>
          <span>·</span>
          <span>
            Finishes: <strong className="text-slate-200">{formatCurrency(finishingTotal, currency)}</strong>
          </span>
          <span>·</span>
          <span>
            Interiors: <strong className="text-slate-200">{formatCurrency(interiorTotal, currency)}</strong>
          </span>
          <span>·</span>
          <span>
            Exterior: <strong className="text-slate-200">{formatCurrency(exteriorTotal, currency)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Total Material Cost:</span>
          <span className="text-emerald-400 font-bold text-base tabular-nums">
            {formatCurrency(grandTotal, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
