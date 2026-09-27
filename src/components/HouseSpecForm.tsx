import React, { useState } from 'react';
import {
  HouseProjectConfig,
  QualityTier,
  CurrencyCode,
  UnitSystem,
  RoomSpecification,
} from '../types/civil';
import { HOUSE_PRESETS } from '../constants/presets';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';
import {
  SlidersHorizontal,
  Home,
  Plus,
  Trash2,
  Maximize2,
  DollarSign,
  Layers,
  Settings2,
  MapPin,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface HouseSpecFormProps {
  config: HouseProjectConfig;
  onChange: (newConfig: HouseProjectConfig) => void;
  onApplyPreset: (presetId: string) => void;
}

export const HouseSpecForm: React.FC<HouseSpecFormProps> = ({
  config,
  onChange,
  onApplyPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'plot' | 'exterior' | 'engineering'>('rooms');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<RoomSpecification['type']>('guest_bed');

  const updateField = <K extends keyof HouseProjectConfig>(
    field: K,
    val: HouseProjectConfig[K]
  ) => {
    onChange({ ...config, [field]: val });
  };

  const updatePlot = <K extends keyof HouseProjectConfig['plot']>(
    field: K,
    val: HouseProjectConfig['plot'][K]
  ) => {
    onChange({
      ...config,
      plot: { ...config.plot, [field]: val },
    });
  };

  const updateExterior = <K extends keyof HouseProjectConfig['exterior']>(
    field: K,
    val: HouseProjectConfig['exterior'][K]
  ) => {
    onChange({
      ...config,
      exterior: { ...config.exterior, [field]: val },
    });
  };

  const updateRoom = (id: string, updates: Partial<RoomSpecification>) => {
    const updated = config.rooms.map((r) => (r.id === id ? { ...r, ...updates } : r));
    onChange({ ...config, rooms: updated });
  };

  const removeRoom = (id: string) => {
    if (config.rooms.length <= 2) return;
    const updated = config.rooms.filter((r) => r.id !== id);
    onChange({ ...config, rooms: updated });
  };

  const addRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom: RoomSpecification = {
      id: `room-${Date.now()}`,
      name: newRoomName.trim(),
      type: newRoomType,
      zone:
        newRoomType.includes('bed') || newRoomType.includes('bath')
          ? 'private'
          : newRoomType === 'kitchen' || newRoomType.includes('utility')
          ? 'service'
          : 'social',
      lengthFt: 12,
      widthFt: 10,
      heightFt: 10,
      windowsCount: 1,
      doorsCount: 1,
      naturalVentilation: 'High',
      daylightExposure: 'East',
      flooringType: 'Vitrified Tiles',
    };
    onChange({ ...config, rooms: [...config.rooms, newRoom] });
    setNewRoomName('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Presets & Global Parameters Bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-semibold text-slate-100">
              House Project Configuration & Specifications
            </span>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Load Preset:</span>
            <div className="flex items-center gap-1.5">
              {HOUSE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onApplyPreset(p.id)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Quality Tier */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Quality Tier</label>
            <select
              value={config.qualityTier}
              onChange={(e) => updateField('qualityTier', e.target.value as QualityTier)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="economy">Economy / Budget</option>
              <option value="standard">Standard Quality</option>
              <option value="luxury">Luxury / Premium</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Currency / Region</label>
            <select
              value={config.currency}
              onChange={(e) => updateField('currency', e.target.value as CurrencyCode)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 font-medium font-mono"
            >
              {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol.trim()}) - {c.name.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Unit System */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Measurement Unit</label>
            <select
              value={config.unitSystem}
              onChange={(e) => updateField('unitSystem', e.target.value as UnitSystem)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="imperial">Imperial (sq.ft / feet)</option>
              <option value="metric">Metric (sq.m / meters)</option>
            </select>
          </div>

          {/* Contingency */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Contingency Reserve</label>
            <select
              value={config.contingencyPercent}
              onChange={(e) => updateField('contingencyPercent', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 font-medium font-mono"
            >
              <option value="5">5% (Minimal Risk)</option>
              <option value="7">7% (Standard Civil Buffer)</option>
              <option value="10">10% (High Inflation Hedge)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center px-4 bg-slate-950/40 border-b border-slate-800 text-xs gap-2">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'rooms'
              ? 'border-sky-500 text-sky-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Room Breakdown ({config.rooms.length} Spaces)
        </button>
        <button
          onClick={() => setActiveTab('plot')}
          className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'plot'
              ? 'border-sky-500 text-sky-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Plot Dimensions & Setbacks
        </button>
        <button
          onClick={() => setActiveTab('exterior')}
          className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'exterior'
              ? 'border-sky-500 text-sky-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Lawn, Parking & Driveway
        </button>
        <button
          onClick={() => setActiveTab('engineering')}
          className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'engineering'
              ? 'border-sky-500 text-sky-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Civil Engineering Ratios
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4">
        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {config.rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                      className="bg-transparent font-semibold text-xs text-slate-100 focus:outline-none focus:border-b border-sky-500 flex-1 mr-2"
                    />
                    <button
                      onClick={() => removeRoom(room.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Remove Space"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Length (ft)</span>
                      <input
                        type="number"
                        min="5"
                        max="40"
                        value={room.lengthFt}
                        onChange={(e) =>
                          updateRoom(room.id, { lengthFt: Math.max(4, Number(e.target.value)) })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Width (ft)</span>
                      <input
                        type="number"
                        min="4"
                        max="35"
                        value={room.widthFt}
                        onChange={(e) =>
                          updateRoom(room.id, { widthFt: Math.max(4, Number(e.target.value)) })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Windows [W]</span>
                      <input
                        type="number"
                        min="0"
                        max="6"
                        value={room.windowsCount}
                        onChange={(e) =>
                          updateRoom(room.id, { windowsCount: Number(e.target.value) })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Doors [D]</span>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={room.doorsCount}
                        onChange={(e) =>
                          updateRoom(room.id, { doorsCount: Number(e.target.value) })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-center"
                      />
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Area: <strong className="text-sky-400 font-mono">{room.lengthFt * room.widthFt} sq.ft</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={room.daylightExposure}
                        onChange={(e) =>
                          updateRoom(room.id, {
                            daylightExposure: e.target.value as RoomSpecification['daylightExposure'],
                          })
                        }
                        className="bg-slate-900 border border-slate-800 text-[10px] rounded px-1 py-0.5 text-slate-300"
                      >
                        <option value="East">East Exposure</option>
                        <option value="North">North Exposure</option>
                        <option value="South">South Exposure</option>
                        <option value="West">West Exposure</option>
                        <option value="Dual Aspect">Dual Aspect</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Room Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="New room name (e.g. Home Theater, Study, Nursery)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                onKeyDown={(e) => e.key === 'Enter' && addRoom()}
              />
              <select
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value as RoomSpecification['type'])}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                <option value="guest_bed">Bedroom</option>
                <option value="attached_bath">Attached Bath</option>
                <option value="common_bath">Common Restroom</option>
                <option value="study_office">Study / Office</option>
                <option value="utility_laundry">Utility / Laundry</option>
                <option value="patio_balcony">Patio / Balcony</option>
              </select>
              <button
                onClick={addRoom}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Space
              </button>
            </div>
          </div>
        )}

        {activeTab === 'plot' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Plot Width (ft)</label>
              <input
                type="number"
                min="25"
                max="150"
                value={config.plot.plotWidthFt}
                onChange={(e) => updatePlot('plotWidthFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Plot Length (ft)</label>
              <input
                type="number"
                min="35"
                max="200"
                value={config.plot.plotLengthFt}
                onChange={(e) => updatePlot('plotLengthFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Front Setback (ft)</label>
              <input
                type="number"
                min="8"
                max="35"
                value={config.plot.frontSetbackFt}
                onChange={(e) => updatePlot('frontSetbackFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Rear Setback (ft)</label>
              <input
                type="number"
                min="5"
                max="25"
                value={config.plot.rearSetbackFt}
                onChange={(e) => updatePlot('rearSetbackFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Left Setback (ft)</label>
              <input
                type="number"
                min="3"
                max="20"
                value={config.plot.sideSetbackLeftFt}
                onChange={(e) => updatePlot('sideSetbackLeftFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Right Setback (ft)</label>
              <input
                type="number"
                min="3"
                max="20"
                value={config.plot.sideSetbackRightFt}
                onChange={(e) => updatePlot('sideSetbackRightFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>
        )}

        {activeTab === 'exterior' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Lawn Area (sq.ft)</label>
              <input
                type="number"
                min="50"
                max="3000"
                value={config.exterior.lawnAreaSqFt}
                onChange={(e) => updateExterior('lawnAreaSqFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Driveway Paving (sq.ft)</label>
              <input
                type="number"
                min="100"
                max="2000"
                value={config.exterior.drivewayPavedSqFt}
                onChange={(e) => updateExterior('drivewayPavedSqFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Parking Bay Spots</label>
              <input
                type="number"
                min="1"
                max="4"
                value={config.exterior.parkingSpots}
                onChange={(e) => updateExterior('parkingSpots', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Boundary Wall Length (ft)</label>
              <input
                type="number"
                min="80"
                max="600"
                value={config.exterior.boundaryWallLengthFt}
                onChange={(e) => updateExterior('boundaryWallLengthFt', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>
        )}

        {activeTab === 'engineering' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <label className="text-sky-400 font-semibold block mb-1">
                TMT Steel Reinforcement Ratio
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Standard regional design ratio: 3.5 to 4.5 kg per sq.ft of built-up area
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="3.2"
                  max="4.8"
                  step="0.1"
                  value={config.steelRatioKgPerSqFt}
                  onChange={(e) => updateField('steelRatioKgPerSqFt', Number(e.target.value))}
                  className="flex-1 accent-sky-500"
                />
                <span className="text-sky-300 font-bold tabular-nums w-16 text-right">
                  {config.steelRatioKgPerSqFt} kg/ft²
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <label className="text-amber-400 font-semibold block mb-1">
                Cement Bags Consumption Ratio
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Standard regional design ratio: 0.38 to 0.45 bags per sq.ft of built-up area
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.35"
                  max="0.48"
                  step="0.01"
                  value={config.cementBagsPerSqFt}
                  onChange={(e) => updateField('cementBagsPerSqFt', Number(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-amber-300 font-bold tabular-nums w-16 text-right">
                  {config.cementBagsPerSqFt} bags/ft²
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
