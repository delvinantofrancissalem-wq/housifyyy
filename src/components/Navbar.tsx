import React from 'react';
import { Printer, Download, Sparkles, Sliders } from 'lucide-react';

interface NavbarProps {
  onOpenPrint: () => void;
  onOpenAiConsultant: () => void;
  activeSection: string;
  onNavigateSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPrint,
  onOpenAiConsultant,
  activeSection,
  onNavigateSection,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="/"
        className="text-lg font-bold tracking-tight text-slate-100 hover:text-sky-400 transition-colors whitespace-nowrap"
      >
        Architron Civil & BOQ
      </a>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onNavigateSection('blueprint')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeSection === 'blueprint' ? 'text-sky-400 font-semibold underline underline-offset-4' : ''
          }`}
        >
          Architectural Blueprint
        </button>
        <button
          onClick={() => onNavigateSection('zoning')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeSection === 'zoning' ? 'text-sky-400 font-semibold underline underline-offset-4' : ''
          }`}
        >
          Spatial Zoning
        </button>
        <button
          onClick={() => onNavigateSection('boq')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeSection === 'boq' ? 'text-sky-400 font-semibold underline underline-offset-4' : ''
          }`}
        >
          Bill of Quantities
        </button>
        <button
          onClick={() => onNavigateSection('labor')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeSection === 'labor' ? 'text-sky-400 font-semibold underline underline-offset-4' : ''
          }`}
        >
          Labor & Overhead
        </button>
        <button
          onClick={() => onNavigateSection('summary')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeSection === 'summary' ? 'text-sky-400 font-semibold underline underline-offset-4' : ''
          }`}
        >
          Executive Summary
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenAiConsultant}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-300 bg-sky-950/70 hover:bg-sky-900/60 border border-sky-600/40 rounded-lg transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>AI Civil Audit</span>
        </button>
        <button
          onClick={onOpenPrint}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm font-semibold"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Docket</span>
        </button>
      </div>
    </header>
  );
};
