import React, { useState, useRef } from 'react';
import {
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileCode,
  Box,
  Copy,
  Check,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { HouseProjectConfig } from '../types/civil';
import { BlueprintLayout, PlacedRoom } from '../utils/floorPlanGenerator';

interface BlueprintViewerProps {
  config: HouseProjectConfig;
  layout: BlueprintLayout;
  onSelectRoom?: (room: PlacedRoom | null) => void;
  selectedRoomId?: string | null;
}

type ViewMode = 'blueprint' | 'paper' | 'ascii' | 'isometric';

export const BlueprintViewer: React.FC<BlueprintViewerProps> = ({
  config,
  layout,
  onSelectRoom,
  selectedRoomId,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('blueprint');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showFurniture, setShowFurniture] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showCirculation, setShowCirculation] = useState<boolean>(true);
  const [showZoningColor, setShowZoningColor] = useState<boolean>(true);
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);
  const [hoveredRoom, setHoveredRoom] = useState<PlacedRoom | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const scale = 14; // pixels per foot
  const plotW = config.plot.plotWidthFt;
  const plotL = config.plot.plotLengthFt;
  const svgWidth = (plotW + 8) * scale;
  const svgHeight = (plotL + 8) * scale;

  // Offsets
  const originX = 4 * scale;
  const originY = 4 * scale;

  // Building position inside setbacks
  const bldgStartX = originX + config.plot.sideSetbackLeftFt * scale;
  const bldgStartY = originY + config.plot.frontSetbackFt * scale;

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(layout.asciiDiagram);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const isDarkCAD = viewMode === 'blueprint';

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* CAD Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          {/* View Modes */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('blueprint')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'blueprint'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cyan CAD Blueprint
            </button>
            <button
              onClick={() => setViewMode('paper')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'paper'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Drafting Paper
            </button>
            <button
              onClick={() => setViewMode('ascii')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'ascii'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              ASCII Grid
            </button>
            <button
              onClick={() => setViewMode('isometric')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'isometric'
                  ? 'bg-purple-500/20 text-purple-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              3D Axonometric
            </button>
          </div>
        </div>

        {/* Layer Toggles & Zoom */}
        <div className="flex items-center gap-3">
          {viewMode !== 'ascii' && (
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showDimensions}
                  onChange={(e) => setShowDimensions(e.target.checked)}
                  className="rounded border-slate-700 text-sky-500 focus:ring-0"
                />
                Dimensions
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showFurniture}
                  onChange={(e) => setShowFurniture(e.target.checked)}
                  className="rounded border-slate-700 text-sky-500 focus:ring-0"
                />
                Furniture
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showCirculation}
                  onChange={(e) => setShowCirculation(e.target.checked)}
                  className="rounded border-slate-700 text-sky-500 focus:ring-0"
                />
                Pathways
              </label>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono tabular-nums text-slate-300 px-1 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, +(z + 0.15).toFixed(2)))}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200 font-mono"
              title="Reset Zoom"
            >
              1:1
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div
        ref={containerRef}
        className={`relative overflow-auto min-h-[580px] max-h-[720px] transition-colors ${
          isDarkCAD ? 'bg-[#061426]' : viewMode === 'paper' ? 'bg-[#f4efe6]' : 'bg-slate-950'
        }`}
      >
        {viewMode === 'ascii' ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Precision ASCII Architectural Floor Grid
              </span>
              <button
                onClick={handleCopyAscii}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                {copiedAscii ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy ASCII Plan
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-xs leading-relaxed text-emerald-300 bg-slate-950 p-6 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre selection:bg-emerald-900 selection:text-white">
              {layout.asciiDiagram}
            </pre>
          </div>
        ) : viewMode === 'isometric' ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[550px] text-slate-300">
            <div className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-semibold text-slate-100">
                    Axonometric Structural Layer Assembly
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-400">G+0 Floor Level</span>
              </div>

              {/* 3D Wireframe Canvas */}
              <div className="relative h-72 flex items-center justify-center bg-slate-950/80 rounded-xl border border-slate-800/80 p-4">
                <svg viewBox="0 0 500 300" className="w-full h-full">
                  <defs>
                    <linearGradient id="plinthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#4338ca" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Level 0: Foundation / Plinth Bedding */}
                  <g transform="translate(100, 180)">
                    <polygon
                      points="150,0 300,50 150,100 0,50"
                      fill="url(#plinthGrad)"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                    <polygon
                      points="0,50 150,100 150,120 0,70"
                      fill="#0369a1"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                    <polygon
                      points="150,100 300,50 300,70 150,120"
                      fill="#0284c7"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                    <text x="150" y="55" textAnchor="middle" fill="#bae6fd" fontSize="10" fontFamily="JetBrains Mono">
                      RCC Raft / Footing Plinth Level (+0.60m)
                    </text>
                  </g>

                  {/* Level 1: Masonry Superstructure & Partitions */}
                  <g transform="translate(100, 90)">
                    <polygon
                      points="150,0 300,50 150,100 0,50"
                      fill="url(#wallGrad)"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="4,2"
                    />
                    {/* Partition wall uprights */}
                    <line x1="0" y1="50" x2="0" y2="10" stroke="#818cf8" strokeWidth="2" />
                    <line x1="150" y1="100" x2="150" y2="60" stroke="#818cf8" strokeWidth="2" />
                    <line x1="300" y1="50" x2="300" y2="10" stroke="#818cf8" strokeWidth="2" />
                    <line x1="75" y1="75" x2="75" y2="35" stroke="#a5b4fc" strokeWidth="1.5" />
                    <line x1="225" y1="75" x2="225" y2="35" stroke="#a5b4fc" strokeWidth="1.5" />
                    <text x="150" y="55" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontFamily="JetBrains Mono">
                      AAC Blockwork & Lintel Band Level (+3.00m)
                    </text>
                  </g>

                  {/* Level 2: RCC Roof Slab Overlay */}
                  <g transform="translate(100, 30)">
                    <polygon
                      points="150,0 300,50 150,100 0,50"
                      fill="#4f46e5"
                      fillOpacity="0.25"
                      stroke="#a855f7"
                      strokeWidth="2"
                    />
                    <text x="150" y="55" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontFamily="JetBrains Mono">
                      125mm RCC Monolithic Cast Slab (+3.30m)
                    </text>
                  </g>
                </svg>
              </div>

              {/* Engineering Layer Breakdown */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-xs font-mono">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-sky-400 block font-semibold mb-1">01. Substructure</span>
                  <p className="text-slate-400 text-[11px]">
                    Isolated column footings, anti-termite barrier & plinth beam tie.
                  </p>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-indigo-400 block font-semibold mb-1">02. Superstructure</span>
                  <p className="text-slate-400 text-[11px]">
                    200mm external envelope & 100mm acoustic room dividing partitions.
                  </p>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-purple-400 block font-semibold mb-1">03. Roof Diaphragm</span>
                  <p className="text-slate-400 text-[11px]">
                    Two-way slab with integrated slope screed & waterproofing membrane.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center p-8 origin-top-left transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="select-none shadow-2xl rounded-sm"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              <defs>
                {/* CAD Grid Pattern */}
                <pattern
                  id="cadGridSmall"
                  width={scale}
                  height={scale}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${scale} 0 L 0 0 0 ${scale}`}
                    fill="none"
                    stroke={isDarkCAD ? '#0e2b4d' : '#e2dbce'}
                    strokeWidth="0.5"
                  />
                </pattern>
                <pattern
                  id="cadGridLarge"
                  width={scale * 5}
                  height={scale * 5}
                  patternUnits="userSpaceOnUse"
                >
                  <rect width={scale * 5} height={scale * 5} fill="url(#cadGridSmall)" />
                  <path
                    d={`M ${scale * 5} 0 L 0 0 0 ${scale * 5}`}
                    fill="none"
                    stroke={isDarkCAD ? '#1e4875' : '#cfc5b4'}
                    strokeWidth="1"
                  />
                </pattern>

                {/* Driveway Paver Pattern */}
                <pattern
                  id="paverHatch"
                  width="12"
                  height="12"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="12" height="12" fill={isDarkCAD ? '#0b1d33' : '#e8e2d8'} />
                  <path
                    d="M 0 6 L 12 6 M 6 0 L 6 12"
                    stroke={isDarkCAD ? '#1c395e' : '#d1c8b9'}
                    strokeWidth="0.8"
                  />
                </pattern>

                {/* Lawn Grass Pattern */}
                <pattern
                  id="lawnPattern"
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="16" height="16" fill={isDarkCAD ? '#07241f' : '#eaf2ea'} />
                  <circle cx="4" cy="4" r="1" fill={isDarkCAD ? '#10b981' : '#84cc16'} opacity="0.6" />
                  <circle cx="12" cy="12" r="1.2" fill={isDarkCAD ? '#10b981' : '#84cc16'} opacity="0.6" />
                  <path
                    d="M 3 5 L 4 2 L 5 5"
                    stroke={isDarkCAD ? '#10b981' : '#65a30d'}
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.4"
                  />
                </pattern>

                {/* Wall Hatch Pattern */}
                <pattern
                  id="wallHatch"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="8"
                    stroke={isDarkCAD ? '#38bdf8' : '#334155'}
                    strokeWidth="1.2"
                  />
                </pattern>
              </defs>

              {/* Background Canvas with CAD Grid */}
              <rect
                x="0"
                y="0"
                width={svgWidth}
                height={svgHeight}
                fill={isDarkCAD ? '#061426' : '#f8f5ee'}
              />
              <rect
                x="0"
                y="0"
                width={svgWidth}
                height={svgHeight}
                fill="url(#cadGridLarge)"
              />

              {/* PLOT BOUNDARY */}
              <rect
                x={originX}
                y={originY}
                width={plotW * scale}
                height={plotL * scale}
                fill="none"
                stroke={isDarkCAD ? '#38bdf8' : '#475569'}
                strokeWidth="2.5"
                strokeDasharray="10,4"
              />

              {/* Setback Guideline Envelope */}
              <rect
                x={bldgStartX}
                y={bldgStartY}
                width={(plotW - config.plot.sideSetbackLeftFt - config.plot.sideSetbackRightFt) * scale}
                height={(plotL - config.plot.frontSetbackFt - config.plot.rearSetbackFt) * scale}
                fill="none"
                stroke={isDarkCAD ? '#1e3a5f' : '#cbd5e1'}
                strokeWidth="1"
                strokeDasharray="4,4"
              />

              {/* FRONT LAWN / SOFT-SCAPE GARDEN */}
              <rect
                x={originX + 2 * scale}
                y={originY + 2 * scale}
                width={Math.min(22 * scale, (plotW - 14) * scale)}
                height={(config.plot.frontSetbackFt - 4) * scale}
                fill="url(#lawnPattern)"
                stroke={isDarkCAD ? '#10b981' : '#84cc16'}
                strokeWidth="1"
                rx="4"
              />
              <text
                x={originX + 3 * scale}
                y={originY + 4 * scale}
                fill={isDarkCAD ? '#6ee7b7' : '#166534'}
                fontSize="10"
                fontWeight="600"
              >
                FRONT LAWN ({config.exterior.lawnAreaSqFt} SQ.FT)
              </text>

              {/* VEHICULAR DRIVEWAY & CARPORT CLEARANCE */}
              <rect
                x={originX + (plotW - 14) * scale}
                y={originY + 1 * scale}
                width={12 * scale}
                height={(config.plot.frontSetbackFt + 6) * scale}
                fill="url(#paverHatch)"
                stroke={isDarkCAD ? '#0284c7' : '#94a3b8'}
                strokeWidth="1.2"
                rx="4"
              />
              <text
                x={originX + (plotW - 8) * scale}
                y={originY + 4 * scale}
                textAnchor="middle"
                fill={isDarkCAD ? '#7dd3fc' : '#334155'}
                fontSize="10"
                fontWeight="600"
              >
                PARKING / DRIVEWAY
              </text>

              {/* CAR SILHOUETTE */}
              {showFurniture && (
                <g
                  transform={`translate(${originX + (plotW - 10) * scale}, ${originY + 6 * scale})`}
                  opacity={isDarkCAD ? '0.6' : '0.4'}
                >
                  <rect
                    x="0"
                    y="0"
                    width={4 * scale}
                    height={8 * scale}
                    rx="8"
                    fill="none"
                    stroke={isDarkCAD ? '#38bdf8' : '#475569'}
                    strokeWidth="1.5"
                  />
                  {/* Windshield */}
                  <path
                    d={`M ${0.5 * scale} ${2.5 * scale} L ${3.5 * scale} ${2.5 * scale}`}
                    stroke={isDarkCAD ? '#38bdf8' : '#475569'}
                    strokeWidth="1.5"
                  />
                  <path
                    d={`M ${0.5 * scale} ${5.5 * scale} L ${3.5 * scale} ${5.5 * scale}`}
                    stroke={isDarkCAD ? '#38bdf8' : '#475569'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={2 * scale}
                    y={4.5 * scale}
                    textAnchor="middle"
                    fill={isDarkCAD ? '#38bdf8' : '#475569'}
                    fontSize="9"
                  >
                    VEHICLE BAY
                  </text>
                </g>
              )}

              {/* ENTRANCE MAIN GATE */}
              {config.exterior.hasMainGate && (
                <g>
                  <rect
                    x={originX + (plotW - 14) * scale}
                    y={originY - 4}
                    width={12 * scale}
                    height="8"
                    fill={isDarkCAD ? '#f59e0b' : '#d97706'}
                  />
                  <text
                    x={originX + (plotW - 8) * scale}
                    y={originY - 8}
                    textAnchor="middle"
                    fill={isDarkCAD ? '#fbbf24' : '#b45309'}
                    fontSize="9"
                    fontWeight="bold"
                  >
                    [=== ENTRANCE GATE ===]
                  </text>
                </g>
              )}

              {/* SUPERSTRUCTURE PERIMETER WALLS & ROOM PARTITIONS */}
              <g transform={`translate(${bldgStartX}, ${bldgStartY})`}>
                {/* Placed Rooms */}
                {layout.placedRooms.map((room) => {
                  const rx = room.x * scale;
                  const ry = room.y * scale;
                  const rw = room.width * scale;
                  const rl = room.length * scale;
                  const isHovered = hoveredRoom?.id === room.id;
                  const isSelected = selectedRoomId === room.id;

                  return (
                    <g
                      key={room.id}
                      onClick={() => onSelectRoom && onSelectRoom(room)}
                      onMouseEnter={() => setHoveredRoom(room)}
                      onMouseLeave={() => setHoveredRoom(null)}
                      className="cursor-pointer transition-all duration-150"
                    >
                      {/* Room Floor Plane */}
                      <rect
                        x={rx}
                        y={ry}
                        width={rw}
                        height={rl}
                        fill={
                          isSelected
                            ? isDarkCAD
                              ? '#0284c7'
                              : '#bfdbfe'
                            : isHovered
                            ? isDarkCAD
                              ? '#0f3156'
                              : '#e0f2fe'
                            : isDarkCAD
                            ? '#091e38'
                            : '#ffffff'
                        }
                        fillOpacity={isSelected ? 0.4 : isHovered ? 0.35 : 0.85}
                        stroke={isDarkCAD ? '#38bdf8' : '#0f172a'}
                        strokeWidth="3"
                      />

                      {/* Zone Subtle Color Indicator Bar */}
                      {showZoningColor && (
                        <rect
                          x={rx + 4}
                          y={ry + 4}
                          width={rw - 8}
                          height="4"
                          fill={room.color}
                          rx="2"
                          opacity="0.8"
                        />
                      )}

                      {/* Room Furniture Annotations */}
                      {showFurniture && (
                        <g opacity={isDarkCAD ? '0.45' : '0.35'}>
                          {/* Master / Guest Bed */}
                          {(room.type === 'master_bed' ||
                            room.type === 'guest_bed' ||
                            room.type === 'kids_bed') && (
                            <g transform={`translate(${rx + rw / 2 - 24}, ${ry + 16})`}>
                              <rect
                                x="0"
                                y="0"
                                width="48"
                                height="56"
                                rx="4"
                                fill="none"
                                stroke={isDarkCAD ? '#93c5fd' : '#475569'}
                                strokeWidth="1.2"
                              />
                              {/* Pillows */}
                              <rect
                                x="6"
                                y="6"
                                width="15"
                                height="10"
                                rx="2"
                                fill={isDarkCAD ? '#93c5fd' : '#94a3b8'}
                              />
                              <rect
                                x="27"
                                y="6"
                                width="15"
                                height="10"
                                rx="2"
                                fill={isDarkCAD ? '#93c5fd' : '#94a3b8'}
                              />
                            </g>
                          )}

                          {/* Living Sofa */}
                          {room.type === 'living' && (
                            <g transform={`translate(${rx + 16}, ${ry + 20})`}>
                              <rect
                                x="0"
                                y="0"
                                width="56"
                                height="28"
                                rx="4"
                                fill="none"
                                stroke={isDarkCAD ? '#93c5fd' : '#475569'}
                                strokeWidth="1.2"
                              />
                              <rect
                                x="12"
                                y="36"
                                width="32"
                                height="18"
                                rx="2"
                                fill="none"
                                stroke={isDarkCAD ? '#93c5fd' : '#64748b'}
                                strokeWidth="1"
                                strokeDasharray="2,2"
                              />
                            </g>
                          )}

                          {/* Dining Table */}
                          {room.type === 'dining' && (
                            <g transform={`translate(${rx + rw / 2 - 28}, ${ry + rl / 2 - 16})`}>
                              <rect
                                x="0"
                                y="0"
                                width="56"
                                height="32"
                                rx="4"
                                fill="none"
                                stroke={isDarkCAD ? '#93c5fd' : '#475569'}
                                strokeWidth="1.2"
                              />
                              {/* Chairs */}
                              <rect x="8" y="-6" width="12" height="4" rx="1" fill={isDarkCAD ? '#93c5fd' : '#94a3b8'} />
                              <rect x="36" y="-6" width="12" height="4" rx="1" fill={isDarkCAD ? '#93c5fd' : '#94a3b8'} />
                              <rect x="8" y="34" width="12" height="4" rx="1" fill={isDarkCAD ? '#93c5fd' : '#94a3b8'} />
                              <rect x="36" y="34" width="12" height="4" rx="1" fill={isDarkCAD ? '#93c5fd' : '#94a3b8'} />
                            </g>
                          )}

                          {/* Kitchen Counter & Stove */}
                          {room.type === 'kitchen' && (
                            <g transform={`translate(${rx + 8}, ${ry + 8})`}>
                              <path
                                d={`M 0 0 L ${rw - 16} 0 L ${rw - 16} 20 L 20 20 L 20 ${rl - 16} L 0 ${rl - 16} Z`}
                                fill="none"
                                stroke={isDarkCAD ? '#93c5fd' : '#475569'}
                                strokeWidth="1.2"
                              />
                              {/* Stove Burners */}
                              <circle cx="35" cy="10" r="4" fill="none" stroke={isDarkCAD ? '#f59e0b' : '#d97706'} strokeWidth="1" />
                              <circle cx="50" cy="10" r="4" fill="none" stroke={isDarkCAD ? '#f59e0b' : '#d97706'} strokeWidth="1" />
                            </g>
                          )}

                          {/* Bathroom Fixtures (WC & Basin) */}
                          {(room.type === 'attached_bath' || room.type === 'common_bath') && (
                            <g transform={`translate(${rx + 10}, ${ry + 12})`}>
                              {/* WC */}
                              <rect x="0" y="0" width="16" height="10" rx="2" fill="none" stroke={isDarkCAD ? '#93c5fd' : '#64748b'} strokeWidth="1" />
                              <circle cx="8" cy="18" r="8" fill="none" stroke={isDarkCAD ? '#93c5fd' : '#64748b'} strokeWidth="1" />
                              {/* Basin */}
                              <rect x={rw - 34} y="0" width="16" height="12" rx="4" fill="none" stroke={isDarkCAD ? '#93c5fd' : '#64748b'} strokeWidth="1" />
                            </g>
                          )}
                        </g>
                      )}

                      {/* Room Text Labels */}
                      <text
                        x={rx + rw / 2}
                        y={ry + rl / 2 - 4}
                        textAnchor="middle"
                        fill={isDarkCAD ? '#f8fafc' : '#0f172a'}
                        fontSize="11"
                        fontWeight="700"
                        letterSpacing="0.03em"
                      >
                        {room.name.toUpperCase()}
                      </text>

                      {/* Dimensions in Feet & Area in Sq.Ft */}
                      <text
                        x={rx + rw / 2}
                        y={ry + rl / 2 + 12}
                        textAnchor="middle"
                        fill={isDarkCAD ? '#38bdf8' : '#0284c7'}
                        fontSize="9.5"
                        fontWeight="500"
                      >
                        {room.widthFt}&apos;-0&quot; × {room.lengthFt}&apos;-0&quot; (
                        {Math.round(room.widthFt * room.lengthFt)} sq.ft)
                      </text>

                      {/* Ventilation / Daylight marker */}
                      <text
                        x={rx + rw / 2}
                        y={ry + rl / 2 + 25}
                        textAnchor="middle"
                        fill={isDarkCAD ? '#94a3b8' : '#64748b'}
                        fontSize="8.5"
                      >
                        {room.daylightExposure} · {room.naturalVentilation} Vent
                      </text>
                    </g>
                  );
                })}

                {/* ARCHITECTURAL DOORS [D] */}
                {layout.doors.map((door, idx) => {
                  const dx = door.x * scale;
                  const dy = door.y * scale;
                  const doorRadius = 2.8 * scale;

                  return (
                    <g key={`door-${idx}`}>
                      {/* Door swing arc */}
                      <path
                        d={`M ${dx} ${dy} A ${doorRadius} ${doorRadius} 0 0 1 ${dx + doorRadius} ${dy + doorRadius}`}
                        fill="none"
                        stroke={isDarkCAD ? '#38bdf8' : '#0284c7'}
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                      />
                      {/* Door leaf line */}
                      <line
                        x1={dx}
                        y1={dy}
                        x2={dx + doorRadius}
                        y2={dy}
                        stroke={isDarkCAD ? '#38bdf8' : '#0284c7'}
                        strokeWidth="2.5"
                      />
                      {/* [D] Tag */}
                      <rect
                        x={dx + 4}
                        y={dy - 12}
                        width="18"
                        height="12"
                        fill={isDarkCAD ? '#0369a1' : '#bae6fd'}
                        rx="2"
                      />
                      <text
                        x={dx + 13}
                        y={dy - 3}
                        textAnchor="middle"
                        fill={isDarkCAD ? '#ffffff' : '#0369a1'}
                        fontSize="8"
                        fontWeight="bold"
                      >
                        [D]
                      </text>
                    </g>
                  );
                })}

                {/* ARCHITECTURAL WINDOWS [W] */}
                {layout.windows.map((win, idx) => {
                  const wx = win.x * scale;
                  const wy = win.y * scale;
                  const isVert = win.orientation === 'vertical';
                  const wLen = win.width * scale;

                  return (
                    <g key={`win-${idx}`}>
                      {/* Window glass cut double line */}
                      {isVert ? (
                        <g>
                          <rect
                            x={wx - 3}
                            y={wy}
                            width="6"
                            height={wLen}
                            fill={isDarkCAD ? '#0284c7' : '#93c5fd'}
                          />
                          <line
                            x1={wx}
                            y1={wy}
                            x2={wx}
                            y2={wy + wLen}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={wx + (wx === 0 ? -12 : 8)}
                            y={wy + wLen / 2 + 3}
                            fill={isDarkCAD ? '#38bdf8' : '#0369a1'}
                            fontSize="8"
                            fontWeight="bold"
                          >
                            [W]
                          </text>
                        </g>
                      ) : (
                        <g>
                          <rect
                            x={wx}
                            y={wy - 3}
                            width={wLen}
                            height="6"
                            fill={isDarkCAD ? '#0284c7' : '#93c5fd'}
                          />
                          <line
                            x1={wx}
                            y1={wy}
                            x2={wx + wLen}
                            y2={wy}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={wx + wLen / 2}
                            y={wy - 6}
                            textAnchor="middle"
                            fill={isDarkCAD ? '#38bdf8' : '#0369a1'}
                            fontSize="8"
                            fontWeight="bold"
                          >
                            [W]
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* CIRCULATION ARROWS */}
                {showCirculation && (
                  <g opacity="0.6">
                    <line
                      x1={10 * scale}
                      y1={14 * scale}
                      x2={10 * scale}
                      y2={24 * scale}
                      stroke={isDarkCAD ? '#f59e0b' : '#d97706'}
                      strokeWidth="2"
                      strokeDasharray="4,3"
                    />
                    <polygon
                      points={`${10 * scale},${25 * scale} ${9.6 * scale},${23 * scale} ${10.4 * scale},${23 * scale}`}
                      fill={isDarkCAD ? '#f59e0b' : '#d97706'}
                    />
                    <text
                      x={11 * scale}
                      y={19 * scale}
                      fill={isDarkCAD ? '#f59e0b' : '#d97706'}
                      fontSize="8"
                      fontWeight="bold"
                    >
                      CORRIDOR CIRCULATION
                    </text>
                  </g>
                )}
              </g>

              {/* DIMENSION LINES & TICK MARKS */}
              {showDimensions && (
                <g>
                  {/* Top Plot Width Dimension */}
                  <g transform={`translate(${originX}, ${originY - 18})`}>
                    <line
                      x1="0"
                      y1="0"
                      x2={plotW * scale}
                      y2="0"
                      stroke={isDarkCAD ? '#38bdf8' : '#475569'}
                      strokeWidth="1"
                    />
                    {/* Ticks */}
                    <line x1="0" y1="-5" x2="0" y2="5" stroke={isDarkCAD ? '#38bdf8' : '#475569'} strokeWidth="1.5" />
                    <line
                      x1={plotW * scale}
                      y1="-5"
                      x2={plotW * scale}
                      y2="5"
                      stroke={isDarkCAD ? '#38bdf8' : '#475569'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={(plotW * scale) / 2}
                      y="-6"
                      textAnchor="middle"
                      fill={isDarkCAD ? '#7dd3fc' : '#1e293b'}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      PLOT WIDTH: {plotW}&apos;-0&quot;
                    </text>
                  </g>

                  {/* Left Plot Length Dimension */}
                  <g transform={`translate(${originX - 18}, ${originY})`}>
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={plotL * scale}
                      stroke={isDarkCAD ? '#38bdf8' : '#475569'}
                      strokeWidth="1"
                    />
                    {/* Ticks */}
                    <line x1="-5" y1="0" x2="5" y2="0" stroke={isDarkCAD ? '#38bdf8' : '#475569'} strokeWidth="1.5" />
                    <line
                      x1="-5"
                      y1={plotL * scale}
                      x2="5"
                      y2={plotL * scale}
                      stroke={isDarkCAD ? '#38bdf8' : '#475569'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="-8"
                      y={(plotL * scale) / 2}
                      textAnchor="middle"
                      transform={`rotate(-90, -8, ${(plotL * scale) / 2})`}
                      fill={isDarkCAD ? '#7dd3fc' : '#1e293b'}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      PLOT LENGTH: {plotL}&apos;-0&quot;
                    </text>
                  </g>
                </g>
              )}

              {/* COMPASS ROSE (NORTH ARROW) */}
              <g transform={`translate(${svgWidth - 65}, 50)`}>
                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill={isDarkCAD ? '#07182e' : '#f1f5f9'}
                  stroke={isDarkCAD ? '#38bdf8' : '#64748b'}
                  strokeWidth="1.5"
                />
                <polygon points="0,-18 5,0 0,-4 -5,0" fill="#ef4444" />
                <polygon points="0,18 5,0 0,4 -5,0" fill={isDarkCAD ? '#64748b' : '#94a3b8'} />
                <text x="0" y="-8" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">
                  N
                </text>
              </g>

              {/* ARCHITECTURAL TITLE BLOCK & STAMP */}
              <g transform={`translate(${svgWidth - 280}, ${svgHeight - 110})`}>
                <rect
                  x="0"
                  y="0"
                  width="260"
                  height="90"
                  fill={isDarkCAD ? '#07182e' : '#ffffff'}
                  stroke={isDarkCAD ? '#38bdf8' : '#0f172a'}
                  strokeWidth="1.5"
                  rx="4"
                />
                <line
                  x1="0"
                  y1="26"
                  x2="260"
                  y2="26"
                  stroke={isDarkCAD ? '#1e3a5f' : '#e2e8f0'}
                  strokeWidth="1"
                />
                <text
                  x="12"
                  y="18"
                  fill={isDarkCAD ? '#38bdf8' : '#0f172a'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {config.projectName.toUpperCase()}
                </text>
                <text
                  x="12"
                  y="42"
                  fill={isDarkCAD ? '#94a3b8' : '#64748b'}
                  fontSize="8.5"
                >
                  DRAWING: ARCH-01 / RESIDENTIAL BLUEPRINT
                </text>
                <text
                  x="12"
                  y="56"
                  fill={isDarkCAD ? '#94a3b8' : '#64748b'}
                  fontSize="8.5"
                >
                  SCALE: 1/4&quot; = 1&apos;-0&quot; (1:50 METRIC EQ) · G+0
                </text>
                <text
                  x="12"
                  y="72"
                  fill={isDarkCAD ? '#34d399' : '#059669'}
                  fontSize="8.5"
                  fontWeight="bold"
                >
                  CIVIL QUANTITY AUDIT: CERTIFIED
                </text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Selected / Hovered Room Info Tray */}
      {(hoveredRoom || selectedRoomId) && (
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {(() => {
            const activeRoom =
              hoveredRoom ||
              layout.placedRooms.find((r) => r.id === selectedRoomId);
            if (!activeRoom) return null;

            return (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeRoom.color }}
                  />
                  <div>
                    <span className="font-bold text-slate-100 mr-2">
                      {activeRoom.name}
                    </span>
                    <span className="text-slate-400">
                      {activeRoom.widthFt}&apos; × {activeRoom.lengthFt}&apos; (
                      {activeRoom.widthFt * activeRoom.lengthFt} sq.ft /{' '}
                      {(activeRoom.widthFt * activeRoom.lengthFt * 0.0929).toFixed(1)} sq.m)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-300">
                  <span>
                    <span className="text-slate-500">Daylight:</span>{' '}
                    <span className="text-amber-400 font-medium">
                      {activeRoom.daylightExposure}
                    </span>
                  </span>
                  <span>
                    <span className="text-slate-500">Ventilation:</span>{' '}
                    <span className="text-sky-400 font-medium">
                      {activeRoom.naturalVentilation}
                    </span>
                  </span>
                  <span>
                    <span className="text-slate-500">Flooring:</span>{' '}
                    <span className="text-slate-200">
                      {activeRoom.flooringType}
                    </span>
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
