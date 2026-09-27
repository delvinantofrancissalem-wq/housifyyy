import React from 'react';
import { RoomSpecification, UnitSystem } from '../types/civil';
import { Wind, Sun, Compass, Maximize } from 'lucide-react';

interface ZoningTableProps {
  rooms: RoomSpecification[];
  unitSystem: UnitSystem;
  onSelectRoom?: (room: RoomSpecification) => void;
  selectedRoomId?: string | null;
}

export const ZoningTable: React.FC<ZoningTableProps> = ({
  rooms,
  unitSystem,
  onSelectRoom,
  selectedRoomId,
}) => {
  const isMetric = unitSystem === 'metric';

  const zoneBadge = (zone: RoomSpecification['zone']) => {
    switch (zone) {
      case 'social':
        return <span className="text-xs font-medium text-sky-400">Social Zone</span>;
      case 'service':
        return <span className="text-xs font-medium text-amber-400">Service Core</span>;
      case 'private':
        return <span className="text-xs font-medium text-indigo-400">Private Zone</span>;
      case 'exterior':
        return <span className="text-xs font-medium text-emerald-400">Exterior</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>01. Architectural Zoning & Spatial Dimension Schedule</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Recommended room dimensions (L × W × H), cross-ventilation flow, and daylight orientation
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Social
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Service
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" /> Private
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Space / Room</th>
              <th className="py-3 px-3">Zoning Class</th>
              <th className="py-3 px-3">Recommended Dimensions (L × W × H)</th>
              <th className="py-3 px-3 text-right">Floor Area</th>
              <th className="py-3 px-3">Daylight Exposure</th>
              <th className="py-3 px-3">Natural Ventilation</th>
              <th className="py-3 px-3">Openings</th>
              <th className="py-3 px-4">Recommended Flooring</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rooms.map((room) => {
              const areaSqFt = room.lengthFt * room.widthFt;
              const areaSqM = +(areaSqFt * 0.0929).toFixed(1);
              const isSelected = selectedRoomId === room.id;

              return (
                <tr
                  key={room.id}
                  onClick={() => onSelectRoom && onSelectRoom(room)}
                  className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                    isSelected ? 'bg-sky-500/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {room.name}
                  </td>
                  <td className="py-3 px-3">{zoneBadge(room.zone)}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {isMetric ? (
                      <>
                        {(room.lengthFt * 0.3048).toFixed(1)}m × {(room.widthFt * 0.3048).toFixed(1)}m ×{' '}
                        {(room.heightFt * 0.3048).toFixed(1)}m
                      </>
                    ) : (
                      <>
                        {room.lengthFt}&apos;-0&quot; × {room.widthFt}&apos;-0&quot; × {room.heightFt}&apos;-0&quot;
                      </>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-sky-400 font-semibold">
                    {isMetric ? `${areaSqM} m²` : `${areaSqFt} sq.ft`}
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                      <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {room.daylightExposure}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      {room.naturalVentilation}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    [D:{room.doorsCount}] [W:{room.windowsCount}]
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px] truncate max-w-[200px]" title={room.flooringType}>
                    {room.flooringType}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
