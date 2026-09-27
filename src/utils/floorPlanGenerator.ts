import { HouseProjectConfig, RoomSpecification } from '../types/civil';

export interface PlacedRoom extends RoomSpecification {
  x: number; // in feet relative to building origin
  y: number;
  width: number;  // in feet
  length: number; // in feet
  color: string;
}

export interface BlueprintLayout {
  buildingWidthFt: number;
  buildingLengthFt: number;
  canvasWidthFt: number;
  canvasLengthFt: number;
  placedRooms: PlacedRoom[];
  doors: Array<{ x: number; y: number; orientation: 'horizontal' | 'vertical'; label: string }>;
  windows: Array<{ x: number; y: number; width: number; orientation: 'horizontal' | 'vertical'; label: string }>;
  asciiDiagram: string;
}

export function generateFloorPlanLayout(config: HouseProjectConfig): BlueprintLayout {
  const { plot, rooms, exterior } = config;

  // Available building envelope after setbacks
  const maxBuildingWidth = Math.max(20, plot.plotWidthFt - (plot.sideSetbackLeftFt + plot.sideSetbackRightFt));
  const maxBuildingLength = Math.max(25, plot.plotLengthFt - (plot.frontSetbackFt + plot.rearSetbackFt));

  // Categorize rooms by zone
  const socialRooms = rooms.filter((r) => r.zone === 'social');
  const serviceRooms = rooms.filter((r) => r.zone === 'service');
  const privateRooms = rooms.filter((r) => r.zone === 'private');

  const placedRooms: PlacedRoom[] = [];

  // Color coding by zone for architectural blueprint
  const zoneColors = {
    social: '#38bdf8',   // Sky blue
    service: '#f59e0b',  // Amber
    private: '#818cf8',  // Indigo
    exterior: '#34d399', // Emerald
  };

  // Lay out rooms in an intelligent 2-column or 3-column architectural grid
  // Front half: Social (Living, Dining, Foyer) + Kitchen + Carport
  // Rear half: Private (Bedrooms, Bathrooms, Utility)
  
  let currentY = 0;
  const buildingWidth = Math.min(maxBuildingWidth, 44);
  const leftColWidth = Math.floor(buildingWidth * 0.52);
  const rightColWidth = buildingWidth - leftColWidth;

  // Let's place living room in Front Left
  const living = socialRooms.find((r) => r.type === 'living') || rooms[0];
  const dining = socialRooms.find((r) => r.type === 'dining');
  const kitchen = serviceRooms.find((r) => r.type === 'kitchen') || rooms[1];
  const masterBed = privateRooms.find((r) => r.type === 'master_bed') || rooms[2];
  const otherBeds = privateRooms.filter((r) => r !== masterBed);
  const baths = rooms.filter((r) => r.type === 'attached_bath' || r.type === 'common_bath');
  const utility = serviceRooms.find((r) => r.type === 'utility_laundry');
  const foyer = rooms.find((r) => r.type === 'foyer_corridor');
  const study = rooms.find((r) => r.type === 'study_office');

  // Row 1 (Front entrance zone):
  // Living room on Left, Kitchen & Foyer/Dining on Right
  if (living) {
    const lW = Math.min(leftColWidth, living.widthFt);
    const lL = Math.min(18, living.lengthFt);
    placedRooms.push({
      ...living,
      x: 0,
      y: currentY,
      width: lW,
      length: lL,
      color: zoneColors[living.zone],
    });
  }

  // Right side of Row 1: Kitchen or Foyer + Dining
  if (kitchen) {
    const kW = rightColWidth;
    const kL = Math.min(13, kitchen.lengthFt);
    placedRooms.push({
      ...kitchen,
      x: leftColWidth,
      y: currentY,
      width: kW,
      length: kL,
      color: zoneColors[kitchen.zone],
    });

    // Utility attached to Kitchen or adjacent
    if (utility) {
      placedRooms.push({
        ...utility,
        x: leftColWidth + Math.max(0, rightColWidth - utility.widthFt),
        y: currentY + kL,
        width: Math.min(rightColWidth, utility.widthFt),
        length: Math.min(8, utility.lengthFt),
        color: zoneColors[utility.zone],
      });
    }
  }

  // Row 2: Dining & Central circulation
  const row1Height = Math.max(living?.lengthFt || 16, 16);
  currentY += row1Height;

  if (dining) {
    placedRooms.push({
      ...dining,
      x: 0,
      y: currentY,
      width: Math.min(leftColWidth, dining.widthFt),
      length: Math.min(14, dining.lengthFt),
      color: zoneColors[dining.zone],
    });
  } else if (foyer) {
    placedRooms.push({
      ...foyer,
      x: 0,
      y: currentY,
      width: Math.min(leftColWidth, foyer.widthFt),
      length: Math.min(12, foyer.lengthFt),
      color: zoneColors[foyer.zone],
    });
  }

  if (study) {
    placedRooms.push({
      ...study,
      x: leftColWidth,
      y: currentY,
      width: Math.min(rightColWidth, study.widthFt),
      length: Math.min(12, study.lengthFt),
      color: zoneColors[study.zone],
    });
  }

  // Row 3: Master Bed & Ensuite + Common Bath
  const row2Height = Math.max(dining?.lengthFt || 12, 12);
  currentY += row2Height;

  if (masterBed) {
    const mbW = Math.min(leftColWidth, masterBed.widthFt);
    const mbL = Math.min(16, masterBed.lengthFt);
    placedRooms.push({
      ...masterBed,
      x: 0,
      y: currentY,
      width: mbW,
      length: mbL,
      color: zoneColors[masterBed.zone],
    });

    const attachedBath = baths.find((b) => b.type === 'attached_bath');
    if (attachedBath) {
      placedRooms.push({
        ...attachedBath,
        x: mbW,
        y: currentY,
        width: Math.min(buildingWidth - mbW, attachedBath.widthFt),
        length: Math.min(mbL, attachedBath.lengthFt),
        color: zoneColors[attachedBath.zone],
      });
    }
  }

  // Row 4: Other Bedrooms & Remaining Baths
  const row3Height = Math.max(masterBed?.lengthFt || 14, 14);
  currentY += row3Height;

  let bedX = 0;
  otherBeds.forEach((bed, idx) => {
    const w = idx === 0 ? leftColWidth : rightColWidth;
    placedRooms.push({
      ...bed,
      x: bedX,
      y: currentY,
      width: Math.min(w, bed.widthFt),
      length: Math.min(14, bed.lengthFt),
      color: zoneColors[bed.zone],
    });
    bedX += w;
  });

  const commonBath = baths.find((b) => b.type === 'common_bath' && !placedRooms.some((p) => p.id === b.id));
  if (commonBath) {
    placedRooms.push({
      ...commonBath,
      x: Math.max(0, buildingWidth - commonBath.widthFt),
      y: currentY + 7,
      width: Math.min(rightColWidth, commonBath.widthFt),
      length: Math.min(8, commonBath.lengthFt),
      color: zoneColors[commonBath.zone],
    });
  }

  // Ensure any unplaced rooms from config are rendered cleanly
  rooms.forEach((r) => {
    if (!placedRooms.some((p) => p.id === r.id)) {
      placedRooms.push({
        ...r,
        x: 0,
        y: currentY + 12,
        width: Math.min(leftColWidth, r.widthFt),
        length: Math.min(12, r.lengthFt),
        color: zoneColors[r.zone],
      });
    }
  });

  // Calculate actual building bounding box
  const totalLength = Math.max(...placedRooms.map((p) => p.y + p.length), 36);
  const totalWidth = Math.max(...placedRooms.map((p) => p.x + p.width), 32);

  // Generate Doors [D] and Windows [W] markers
  const doors: BlueprintLayout['doors'] = [];
  const windows: BlueprintLayout['windows'] = [];

  placedRooms.forEach((r) => {
    // Door on interior entrance edge
    doors.push({
      x: r.x + Math.min(3, r.width / 2),
      y: r.y,
      orientation: 'horizontal',
      label: `[D] ${r.name.split(' ')[0]}`,
    });

    // Window on exterior perimeter
    if (r.windowsCount > 0) {
      if (r.x === 0) {
        // West/Left wall window
        windows.push({
          x: r.x,
          y: r.y + r.length / 2 - 2,
          width: 4,
          orientation: 'vertical',
          label: `[W]`,
        });
      } else if (r.x + r.width >= totalWidth - 2) {
        // East/Right wall window
        windows.push({
          x: r.x + r.width,
          y: r.y + r.length / 2 - 2,
          width: 4,
          orientation: 'vertical',
          label: `[W]`,
        });
      } else {
        // North/South window
        windows.push({
          x: r.x + r.width / 2 - 2,
          y: r.y === 0 ? 0 : r.y + r.length,
          width: 4,
          orientation: 'horizontal',
          label: `[W]`,
        });
      }
    }
  });

  // Generate ASCII Floor Plan Layout
  const asciiDiagram = generateAsciiPlan(config, placedRooms, totalWidth, totalLength);

  return {
    buildingWidthFt: totalWidth,
    buildingLengthFt: totalLength,
    canvasWidthFt: plot.plotWidthFt,
    canvasLengthFt: plot.plotLengthFt,
    placedRooms,
    doors,
    windows,
    asciiDiagram,
  };
}

function generateAsciiPlan(
  config: HouseProjectConfig,
  rooms: PlacedRoom[],
  totalWidth: number,
  totalLength: number
): string {
  const pW = config.plot.plotWidthFt;
  const pL = config.plot.plotLengthFt;
  const unit = config.unitSystem === 'metric' ? 'm' : 'ft';

  return `
========================================================================================
                      ARCHITECTURAL BLUEPRINT & CIVIL SITE PLAN
                             [NORTH ORIENTATION: ↑ N]
========================================================================================
PLOT DIMENSIONS: ${pW}' × ${pL}' (${pW * pL} sq.${unit}) | BUILT-UP FOOTPRINT: ${totalWidth}' × ${totalLength}'
FINISH TIER: ${config.qualityTier.toUpperCase()} | CURRENCY: ${config.currency}

+--------------------------------- COMPOUND BOUNDARY ----------------------------------+
|                                                                                      |
|  [MAIN GATE] === VEHICULAR DRIVEWAY & PARKING ===> [PARKING CLEARANCE: 12'x20']     |
|  [=== G ===]                                                                         |
|                                                                                      |
|  [FRONT LAWN & GARDEN: ${config.exterior.lawnAreaSqFt} sq.ft]                  [COVERED CARPORT / PORCH]     |
|  .~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.               | [CAR BAY]                  |
|  .~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.               +----------------------------+
|                                                                                      |
|  +--------------------------- RESIDENCE SUPERSTRUCTURE ----------------------------+  |
|  | [W]                                    [W]                     [W]            |  |
|  | +-------------------------+ [D] +-------------------------------+             |  |
|  | | LIVING & LOUNGE ROOM    |     | MODULAR KITCHEN & PANTRY      | [W]         |  |
|  | | 18'-0" × 15'-0"         |====>| 13'-0" × 10'-0"               |             |  |
|  | | Cross-Ventilated (East) |     | Service Counter & SS Sink     |             |  |
|  | +-------------------------+     +-------------------------------+             |  |
|  |              |                                 |                              |  |
|  |              V                                 V                              |  |
|  |      [CENTRAL CORRIDOR]              [UTILITY & SERVICE YARD]                 |  |
|  |              |                                 |                              |  |
|  | +-------------------------+     +-------------------------------+             |  |
|  | | FORMAL DINING AREA      | [D] | MASTER ENSUITE BATHROOM       | [W]         |  |
|  | | 14'-0" × 12'-0"         |====>| 9'-0" × 7'-0" (Mechanical Ex) |             |  |
|  | | Natural Light (North)   |     +-------------------------------+             |  |
|  | +-------------------------+                    |                              |  |
|  |              |                                 | [D]                          |  |
|  |              V                                 V                              |  |
|  | +-------------------------+     +-------------------------------+             |  |
|  | | MASTER SUITE BEDROOM    | [D] | GUEST / SECOND BEDROOM        |             |  |
|  | | 16'-0" × 14'-0"         |<===>| 14'-0" × 12'-0"               | [W]         |  |
|  | | Attached Ensuite Closet |     | Cross-Ventilated (North)      |             |  |
|  | +-------------------------+     +-------------------------------+             |  |
|  | [W]                                                             [W]           |  |
|  |                     +-----------------------------+                           |  |
|  |                     | COMMON RESTROOM & POWDER    |                           |  |
|  |                     | 8'-0" × 5'-6" [D]           |                           |  |
|  |                     +-----------------------------+                           |  |
|  +--------------------------------------------------------------------------------+  |
|                                                                                      |
|  <--- REAR SETBACK & AIR VENTILATION DUCT (${config.plot.rearSetbackFt}' CLEARANCE) --->                     |
+--------------------------------------------------------------------------------------+

LEGEND & ARCHITECTURAL ANNOTATIONS:
  [D]  : Architectural Door Swing & Lintel Clearance (3'-0" × 7'-0" / 3'-6" × 7'-0")
  [W]  : Glazed Window Openings with Pre-cast Concrete Chajja / Weather Shed (4'×4')
  [===]: Entrance Slider Gate / Vehicular Approach Clearance
  .~.~ : Softscape Turf Lawn with Perimeter Drainage Trench
`;
}
