import {
  BoqCalculationResult,
  BoqItem,
  HouseProjectConfig,
  LaborItem,
  OverheadPermitItem,
  ValueEngineeringTip,
} from '../types/civil';
import { REGIONAL_RATES } from '../constants/regionalRates';

export function calculateBoq(config: HouseProjectConfig): BoqCalculationResult {
  const { currency, qualityTier, plot, rooms, exterior } = config;
  const rates = REGIONAL_RATES[currency] || REGIONAL_RATES.USD;

  // 1. Calculate Built-Up Area and Areas
  const totalRoomAreaSqFt = rooms.reduce((acc, r) => acc + r.lengthFt * r.widthFt, 0);
  // Add circulation / wall thickness factor (approx 12-15% of room carpet area)
  const wallCirculationAllowance = totalRoomAreaSqFt * 0.14;
  const totalBuiltUpAreaSqFt = Math.round(totalRoomAreaSqFt + wallCirculationAllowance);
  const totalBuiltUpAreaSqM = +(totalBuiltUpAreaSqFt * 0.092903).toFixed(1);

  const totalPlotAreaSqFt = plot.plotWidthFt * plot.plotLengthFt;
  const groundCoverageSqFt = totalBuiltUpAreaSqFt;
  const farRatio = +(totalBuiltUpAreaSqFt / totalPlotAreaSqFt).toFixed(2);

  // Counts
  const totalWindows = rooms.reduce((acc, r) => acc + r.windowsCount, 0);
  const totalDoors = rooms.reduce((acc, r) => acc + r.doorsCount, 0);
  const bathroomCount = rooms.filter((r) => r.type === 'attached_bath' || r.type === 'common_bath').length || 1;
  const bedroomCount = rooms.filter((r) => r.type === 'master_bed' || r.type === 'guest_bed' || r.type === 'kids_bed').length || 1;

  // 2. Structural & Civil Materials
  // Concrete engineering calculations:
  // Cement: standard 0.42 bags / sq.ft (configurable)
  const cementBags = Math.round(totalBuiltUpAreaSqFt * config.cementBagsPerSqFt);
  // Steel: standard 4.0 kg / sq.ft (configurable)
  const steelKg = Math.round(totalBuiltUpAreaSqFt * config.steelRatioKgPerSqFt);
  const steelTons = +(steelKg / 1000).toFixed(2);
  // Sand / Fine aggregate: ~0.075 tons / sq.ft
  const sandTons = Math.round(totalBuiltUpAreaSqFt * 0.075);
  // Coarse aggregate: ~0.062 tons / sq.ft
  const aggregateTons = Math.round(totalBuiltUpAreaSqFt * 0.062);
  // Bricks / AAC blocks: ~9.5 bricks / sq.ft
  const brickCount = Math.round(totalBuiltUpAreaSqFt * 9.5);
  // Ready mix concrete: ~0.041 m3 / sq.ft
  const concreteCuM = Math.round(totalBuiltUpAreaSqFt * 0.041);

  // Quality multiplier for structural materials (e.g. higher grade cement/steel for luxury)
  const structTierMultiplier = qualityTier === 'luxury' ? 1.15 : qualityTier === 'economy' ? 0.92 : 1.0;

  const structuralItems: BoqItem[] = [
    {
      id: 'mat-bricks',
      category: 'structural',
      name: 'Masonry Blocks / Class-A Bricks',
      specification: qualityTier === 'economy' ? 'Standard Red Clay Bricks (190x90x90mm)' : 'AAC High-Density Autoclaved Aerated Blocks',
      quantity: brickCount,
      unit: 'Units',
      unitCost: +(rates.brickUnitCost * structTierMultiplier).toFixed(2),
      totalCost: Math.round(brickCount * rates.brickUnitCost * structTierMultiplier),
      notes: 'Superstructure walling & external perimeter envelope',
    },
    {
      id: 'mat-cement',
      category: 'structural',
      name: 'OPC / PPC Structural Cement',
      specification: qualityTier === 'luxury' ? 'Grade 53 High-Early Strength OPC' : 'Grade 43 Pozzolana Portland Cement (PPC)',
      quantity: cementBags,
      unit: 'Bags (50kg)',
      unitCost: +(rates.cementBagCost * structTierMultiplier).toFixed(2),
      totalCost: Math.round(cementBags * rates.cementBagCost * structTierMultiplier),
      notes: `${config.cementBagsPerSqFt} bags/sq.ft for RCC, brickwork & double-coat plaster`,
    },
    {
      id: 'mat-steel',
      category: 'structural',
      name: 'TMT Reinforcement Steel Rebar',
      specification: 'Fe-550D Corrosion Resistant Thermo-Mechanically Treated Rebar',
      quantity: steelTons,
      unit: 'Metric Tons',
      unitCost: +(rates.steelTonCost * structTierMultiplier).toFixed(2),
      totalCost: Math.round(steelTons * rates.steelTonCost * structTierMultiplier),
      notes: `${config.steelRatioKgPerSqFt} kg/sq.ft for footings, columns, plinth & roof slabs`,
    },
    {
      id: 'mat-sand',
      category: 'structural',
      name: 'Manufactured Fine Aggregate (M-Sand)',
      specification: 'Zone-II Graded Sieve Washed Plastering & Masonry Sand',
      quantity: sandTons,
      unit: 'Tons',
      unitCost: +(rates.sandTonCost * structTierMultiplier).toFixed(2),
      totalCost: Math.round(sandTons * rates.sandTonCost * structTierMultiplier),
      notes: 'Bedding, mortar joints, and internal/external wall plaster',
    },
    {
      id: 'mat-aggregate',
      category: 'structural',
      name: 'Coarse Aggregate / Blue Metal Gravel',
      specification: '12mm & 20mm Machine-Crushed Angular Granite Aggregate',
      quantity: aggregateTons,
      unit: 'Tons',
      unitCost: +(rates.aggregateTonCost * structTierMultiplier).toFixed(2),
      totalCost: Math.round(aggregateTons * rates.aggregateTonCost * structTierMultiplier),
      notes: 'Concrete mix for foundations, lintel bands & roof beams',
    },
    {
      id: 'mat-concrete',
      category: 'structural',
      name: 'Ready-Mix Concrete / Foundation RCC',
      specification: qualityTier === 'luxury' ? 'M30 Grade Pumpable RMC with Waterproofing' : 'M20 / M25 Design Mix Concrete',
      quantity: concreteCuM,
      unit: 'Cubic Meters (m³)',
      unitCost: +(rates.readyMixConcreteCuM * structTierMultiplier).toFixed(2),
      totalCost: Math.round(concreteCuM * rates.readyMixConcreteCuM * structTierMultiplier),
      notes: 'Substructure footings, plinth beam casting, and suspended floor slabs',
    },
  ];

  // 3. Finishing & Architectural Components
  // Tiling area = totalRoomArea + 10% wastage + 12% skirting
  const tilingSqFt = Math.round(totalRoomAreaSqFt * 1.22);
  const windowGlassSqFt = Math.round(totalWindows * 22);
  // Wall painting area ~ 2.9 × built-up area
  const wallPaintSqFt = Math.round(totalBuiltUpAreaSqFt * 2.85);

  const finishingItems: BoqItem[] = [
    {
      id: 'fin-flooring',
      category: 'finishing',
      name: 'Floor Tiling & Skirting',
      specification:
        qualityTier === 'luxury'
          ? 'Imported Italian Marble / Large Format Porcelain Slabs (1200x1800mm)'
          : qualityTier === 'standard'
          ? 'Double-Charged Glazed Vitrified Tiles (800x800mm) + Anti-skid in wet zones'
          : 'Standard Ceramic Glazed Floor Tiles (600x600mm)',
      quantity: tilingSqFt,
      unit: 'sq.ft',
      unitCost: rates.flooringSqFtCost[qualityTier],
      totalCost: Math.round(tilingSqFt * rates.flooringSqFtCost[qualityTier]),
      notes: 'Includes 10% cutting wastage, polymer grout & tile adhesive',
    },
    {
      id: 'fin-windows',
      category: 'finishing',
      name: 'Windows, Glazing & Mosquito Mesh',
      specification:
        qualityTier === 'luxury'
          ? 'Thermal-Break Powder-Coated Aluminum / Triple-Glazed Argon Filled'
          : qualityTier === 'standard'
          ? 'Heavy-Duty UPVC Sliding/Casement Windows with Toughened Clear Glass'
          : 'Standard Aluminum Anodized 2-Track Windows with 5mm Float Glass',
      quantity: windowGlassSqFt,
      unit: 'sq.ft',
      unitCost: rates.windowSqFtCost[qualityTier],
      totalCost: Math.round(windowGlassSqFt * rates.windowSqFtCost[qualityTier]),
      notes: `${totalWindows} architectural window openings with sill weather-stops`,
    },
    {
      id: 'fin-doors',
      category: 'finishing',
      name: 'Internal & Main Doors with Hardware',
      specification:
        qualityTier === 'luxury'
          ? 'Solid Teak Entrance Door + Flush Acoustic Core Timber Doors with SS Mortise Locks'
          : qualityTier === 'standard'
          ? 'Engineered Molded Panel Doors with Hardwood Frame & Brass/SS Fittings'
          : 'Flush Commercial Doors with Laminated Facing & Standard Cylindrical Locks',
      quantity: totalDoors,
      unit: 'Door Sets',
      unitCost: rates.doorUnitCost[qualityTier],
      totalCost: Math.round(totalDoors * rates.doorUnitCost[qualityTier]),
      notes: `${totalDoors} door assemblies including hinges, latch, handles, and stoppers`,
    },
    {
      id: 'fin-putty-primer',
      category: 'finishing',
      name: 'Internal Wall Putty & Acrylic Primer',
      specification: '2-Coats Polymer-Modified White Wall Putty + 1-Coat Deep Penetrating Primer',
      quantity: wallPaintSqFt,
      unit: 'sq.ft',
      unitCost: rates.wallPuttyPrimerSqFtCost[qualityTier],
      totalCost: Math.round(wallPaintSqFt * rates.wallPuttyPrimerSqFtCost[qualityTier]),
      notes: 'Full surface leveling, sanding, and dust sealant preparation',
    },
    {
      id: 'fin-paint',
      category: 'finishing',
      name: 'Architectural Emulsion & Exterior Weather-Coat',
      specification:
        qualityTier === 'luxury'
          ? 'Silicone Luxury Emulsion Interior + High-Sheen Elastomeric Exterior'
          : qualityTier === 'standard'
          ? 'Premium Washable Acrylic Emulsion (2 Coats) + Anti-Fungal Weather-Guard'
          : 'Standard Tractor/Contractor Emulsion (2 Coats) + Exterior Cement Paint',
      quantity: wallPaintSqFt,
      unit: 'sq.ft',
      unitCost: rates.paintSqFtCost[qualityTier],
      totalCost: Math.round(wallPaintSqFt * rates.paintSqFtCost[qualityTier]),
      notes: 'Ceilings, vertical masonry faces, and exterior facade envelope',
    },
    {
      id: 'fin-plumbing',
      category: 'finishing',
      name: 'Sanitary Fixtures, CPVC Water Supply & Drainage',
      specification:
        qualityTier === 'luxury'
          ? 'Concealed Diverters, Wall-Hung Toilets with Pneumatic Flush Plates & Quartz Basin'
          : qualityTier === 'standard'
          ? 'Single-Lever Brass Fixtures, Wall-Hung EWC, Overhead Tanks & Dual-Stack SWR'
          : 'Standard Pillar Cocks, Floor-Mounted EWC, PVC Pipes & Gravity Flow Traps',
      quantity: bathroomCount,
      unit: 'Bath Packages',
      unitCost: rates.plumbingPerBathroomCost[qualityTier],
      totalCost: Math.round(bathroomCount * rates.plumbingPerBathroomCost[qualityTier]),
      notes: `${bathroomCount} bathrooms + kitchen sink supply, geyser points & sewer trap`,
    },
    {
      id: 'fin-electrical',
      category: 'finishing',
      name: 'Concealed Electrical, MCB Panels & LED Lighting',
      specification:
        qualityTier === 'luxury'
          ? 'Smart Automation-Ready Modular Switches, FR-LSH Copper Cables, Sub-DB & DALI Dimming'
          : qualityTier === 'standard'
          ? 'Concealed Heavy PVC Conduits, Fire-Retardant Copper Wiring, Modular Switches & RCCB'
          : 'Standard Rigid PVC Conduits, Copper Wiring, Basic Switch Plates & 32A MCB Box',
      quantity: totalBuiltUpAreaSqFt,
      unit: 'sq.ft',
      unitCost: rates.electricalSqFtCost[qualityTier],
      totalCost: Math.round(totalBuiltUpAreaSqFt * rates.electricalSqFtCost[qualityTier]),
      notes: 'Complete circuit distribution, earthing pits, AC points & LED fixture allowances',
    },
  ];

  // 4. Interior & Basic Furnishing
  const interiorItems: BoqItem[] = [
    {
      id: 'int-kitchen',
      category: 'interior',
      name: 'Modular Kitchen Countertop & Cabinetry',
      specification:
        qualityTier === 'luxury'
          ? 'Quartz Seamless Island Counter, Soft-Close Tandem Drawers, Acrylic Overhead Cabinets'
          : qualityTier === 'standard'
          ? 'Black Jet Granite Countertop (18mm) with Marine-Ply Laminate Shutter Modules'
          : 'Standard Granite Slab Counter with Basic Pre-laminated Box Storage Under Counter',
      quantity: 1,
      unit: 'Complete Set',
      unitCost: rates.modularKitchenBaseCost[qualityTier],
      totalCost: rates.modularKitchenBaseCost[qualityTier],
      notes: 'Includes stainless steel 304 sink, pull-out wire baskets & soft-closing hinges',
    },
    {
      id: 'int-wardrobes',
      category: 'interior',
      name: 'Built-In Bedroom Wardrobes & Woodwork',
      specification:
        qualityTier === 'luxury'
          ? 'Floor-to-Ceiling Wardrobes with Fluted Glass Shutters, Integrated Warm LED & Velvet Drawers'
          : qualityTier === 'standard'
          ? 'MDF/HDF Laminated Wardrobe Units with Concealed Handles (7ft Height)'
          : 'Basic Commercial Ply Wardrobe Framework with Laminate Finish',
      quantity: bedroomCount,
      unit: 'Units',
      unitCost: rates.wardrobePerBedCost[qualityTier],
      totalCost: Math.round(bedroomCount * rates.wardrobePerBedCost[qualityTier]),
      notes: `Custom built-in storage closets for ${bedroomCount} bedrooms`,
    },
  ];

  // 5. Exterior, Landscaping & Parking
  const exteriorItems: BoqItem[] = [
    {
      id: 'ext-driveway',
      category: 'exterior',
      name: 'Driveway & Parking Paving',
      specification:
        qualityTier === 'luxury'
          ? 'Basalt Natural Stone Slabs / Flamed Granite Cobblestones (80mm heavy duty)'
          : qualityTier === 'standard'
          ? 'Interlocking Heavy-Duty Concrete Paver Blocks (60mm zig-zag pattern)'
          : 'Broom-Finished PCC Concrete Driveway Slab with Expansion Joints',
      quantity: exterior.drivewayPavedSqFt,
      unit: 'sq.ft',
      unitCost: rates.drivewayPaverSqFtCost[qualityTier],
      totalCost: Math.round(exterior.drivewayPavedSqFt * rates.drivewayPaverSqFtCost[qualityTier]),
      notes: `Sized for ${exterior.parkingSpots} vehicle parking bay and entry ramp`,
    },
    {
      id: 'ext-lawn',
      category: 'exterior',
      name: 'Lawn Garden, Turfing & Topsoil Bedding',
      specification:
        qualityTier === 'luxury'
          ? 'Bermuda Hybrid Lawn Grass Turf with Automated Drip/Pop-Up Sprinklers & Shrubs'
          : qualityTier === 'standard'
          ? 'Selection-1 Natural Carpet Grass with 100mm Organic Compost Topsoil'
          : 'Standard Buffalo Grass Sodding and Perimeter Garden Edging',
      quantity: exterior.lawnAreaSqFt,
      unit: 'sq.ft',
      unitCost: rates.lawnTurfSqFtCost[qualityTier],
      totalCost: Math.round(exterior.lawnAreaSqFt * rates.lawnTurfSqFtCost[qualityTier]),
      notes: 'Front setback softscaping, grading, drainage sloped to rainwater harvest pit',
    },
    {
      id: 'ext-boundary',
      category: 'exterior',
      name: 'Compound Boundary Wall with RCC Coping',
      specification:
        qualityTier === 'luxury'
          ? 'RCC Frame Boundary Wall with Architectural Groove Plaster & Exterior Accent Uplights'
          : qualityTier === 'standard'
          ? '9" Masonry Compound Wall (5ft height) with PCC Foundation & Weather-Proof Paint'
          : '4.5" Brick Boundary Wall with Plaster Finish and Cement Coping',
      quantity: exterior.boundaryWallLengthFt,
      unit: 'Running Ft',
      unitCost: rates.boundaryWallRftCost[qualityTier],
      totalCost: Math.round(exterior.boundaryWallLengthFt * rates.boundaryWallRftCost[qualityTier]),
      notes: 'Perimeter enclosure around three boundary sides and front clearance',
    },
    {
      id: 'ext-gate',
      category: 'exterior',
      name: 'Main Vehicular & Pedestrian Entrance Gate',
      specification:
        qualityTier === 'luxury'
          ? 'Motorized Laser-Cut Corten / SS-304 Heavy Duty Sliding Gate with Intercom Conduit'
          : qualityTier === 'standard'
          ? 'Fabricated Mild Steel (MS) Powder-Coated Sliding Gate with Wicket Pedestrian Leaf'
          : 'Standard Welded MS Tubular Gate with Primer and Enamel Finish',
      quantity: exterior.hasMainGate ? 1 : 0,
      unit: 'Set',
      unitCost: rates.mainGateCost[qualityTier],
      totalCost: exterior.hasMainGate ? rates.mainGateCost[qualityTier] : 0,
      notes: 'Main clearance for vehicle drive-in and secure wicket door access',
    },
  ];

  // 6. Labor, Supervision & Overhead Costs
  const laborItems: LaborItem[] = [
    {
      id: 'lab-masonry',
      trade: 'Masonry, Foundation Excavation & Civil Labor',
      description: 'Site clearance, footing trench excavation, PCC bedding, brickwork & plastering',
      mandaysOrSqFt: totalBuiltUpAreaSqFt,
      unit: 'sq.ft',
      ratePerUnit: rates.laborCivilMasonryPerSqFt[qualityTier],
      totalCost: Math.round(totalBuiltUpAreaSqFt * rates.laborCivilMasonryPerSqFt[qualityTier]),
    },
    {
      id: 'lab-shuttering',
      trade: 'Formwork Shuttering, Steel Bar Bending & RCC Casting',
      description: 'Steel staging, plywood shuttering, rebar tying & concrete vibrator compaction',
      mandaysOrSqFt: totalBuiltUpAreaSqFt,
      unit: 'sq.ft',
      ratePerUnit: rates.laborShutteringRccPerSqFt[qualityTier],
      totalCost: Math.round(totalBuiltUpAreaSqFt * rates.laborShutteringRccPerSqFt[qualityTier]),
    },
    {
      id: 'lab-mep-finishing',
      trade: 'Electrical, Plumbing, Flooring & Tiling Tradesmen',
      description: 'Concealed line channelling, pipe laying, wire pulling, sanitary fixing & tile grouting',
      mandaysOrSqFt: totalBuiltUpAreaSqFt,
      unit: 'sq.ft',
      ratePerUnit: rates.laborMepFinishingPerSqFt[qualityTier],
      totalCost: Math.round(totalBuiltUpAreaSqFt * rates.laborMepFinishingPerSqFt[qualityTier]),
    },
    {
      id: 'lab-painting',
      trade: 'Surface Preparation, Putty Polish & Painting Labor',
      description: 'Wall grinding, 2-coat putty sanding, primer coat, and finish coat rolling',
      mandaysOrSqFt: totalBuiltUpAreaSqFt,
      unit: 'sq.ft',
      ratePerUnit: rates.laborPaintingPerSqFt[qualityTier],
      totalCost: Math.round(totalBuiltUpAreaSqFt * rates.laborPaintingPerSqFt[qualityTier]),
    },
  ];

  // Professional fees & Municipal permits
  const architectFee = Math.round(totalBuiltUpAreaSqFt * rates.architectFeesPerSqFt);
  const municipalPermits = rates.municipalPermitsFlat;
  const siteSupervisionFee = Math.round(totalBuiltUpAreaSqFt * (rates.architectFeesPerSqFt * 0.65));

  const overheadItems: OverheadPermitItem[] = [
    {
      id: 'ovh-architect',
      title: 'Architectural & Structural Engineering Design',
      description: 'Architectural layout blueprints, 3D structural analysis, RCC bar-bending schedules & CAD stamps',
      basis: `${rates.architectFeesPerSqFt}/sq.ft standard engineering rate`,
      amount: architectFee,
    },
    {
      id: 'ovh-permits',
      title: 'Municipal Building Approvals & Utility Connections',
      description: 'Town planning sanction, environmental clearance, temporary construction electricity & water meter',
      basis: 'Regional standard regulatory docket fee',
      amount: municipalPermits,
    },
    {
      id: 'ovh-supervision',
      title: 'Resident Site Engineer Quality Supervision',
      description: 'Stage-wise concrete cube compressive tests, steel inspection & day-to-day contractor oversight',
      basis: '6 months dedicated milestone auditing',
      amount: siteSupervisionFee,
    },
  ];

  // Totals calculations
  const totalMaterialCost =
    structuralItems.reduce((acc, i) => acc + i.totalCost, 0) +
    finishingItems.reduce((acc, i) => acc + i.totalCost, 0) +
    interiorItems.reduce((acc, i) => acc + i.totalCost, 0) +
    exteriorItems.reduce((acc, i) => acc + i.totalCost, 0);

  const totalLaborCost = laborItems.reduce((acc, i) => acc + i.totalCost, 0);
  const totalOverheadAndPermits = overheadItems.reduce((acc, i) => acc + i.amount, 0);

  const subtotalDirectCost = totalMaterialCost + totalLaborCost + totalOverheadAndPermits;
  const totalContingencyCost = Math.round(subtotalDirectCost * (config.contingencyPercent / 100));

  const grandTotalCost = subtotalDirectCost + totalContingencyCost;
  const costPerSqFt = +(grandTotalCost / totalBuiltUpAreaSqFt).toFixed(1);
  const costPerSqM = +(grandTotalCost / totalBuiltUpAreaSqM).toFixed(1);

  const materialPercentage = +( (totalMaterialCost / grandTotalCost) * 100 ).toFixed(1);
  const laborPercentage = +( (totalLaborCost / grandTotalCost) * 100 ).toFixed(1);
  const overheadPercentage = +( (totalOverheadAndPermits / grandTotalCost) * 100 ).toFixed(1);
  const contingencyPercentage = +( (totalContingencyCost / grandTotalCost) * 100 ).toFixed(1);

  // Practical Value-Engineering Tips
  const valueEngineeringTips: ValueEngineeringTip[] = [
    {
      title: 'Replace Red Clay Bricks with AAC Aerated Blocks',
      category: 'Structural Envelope',
      savingsPotential: '7% - 10% on Wall Construction & Dead Load',
      structuralImpact: 'Approved Equivalent',
      description:
        'Autoclaved Aerated Concrete (AAC) blocks weigh 60% less than conventional red bricks, reducing structural steel reinforcement in columns and footings while requiring 50% less joint mortar and providing 3x superior thermal insulation.',
      recommendation:
        'Specify 600x200x150mm AAC blocks with thin-bed polymer adhesive rather than traditional 1:6 cement-sand mortar.',
    },
    {
      title: 'Optimize Structural Grid Spans & Modular Column Placements',
      category: 'RCC Framework',
      savingsPotential: '8% - 12% on Reinforcement Steel & Formwork',
      structuralImpact: 'Neutral',
      description:
        'Standardizing room clear spans between 12 ft and 16 ft avoids heavy transfer girders, reduces slab thickness from 150mm to 125mm, and minimizes rebar scrap cutoff wastage from 9% down to under 2%.',
      recommendation:
        'Align vertical column axes strictly along load-bearing partition lines to eliminate secondary cantilever beams.',
    },
    {
      title: 'Strategic Finish Specification (Vitrified vs Natural Marble)',
      category: 'Architectural Finishes',
      savingsPotential: '12% - 18% on Flooring & MEP Execution',
      structuralImpact: 'Neutral',
      description:
        'Utilizing 800x1600mm double-charged nano-polished vitrified tiles in place of uncalibrated natural marble eliminates expensive on-site chemical polishing labor, reduces floor dead load by 25 kg/m², and achieves zero porosity staining.',
      recommendation:
        'Reserve premium natural stone or wood exclusively for the master suite and living focal wall, adopting high-grade vitrified tiles elsewhere.',
    },
  ];

  return {
    totalBuiltUpAreaSqFt,
    totalBuiltUpAreaSqM,
    totalPlotAreaSqFt,
    groundCoverageSqFt,
    farRatio,
    structuralItems,
    finishingItems,
    interiorItems,
    exteriorItems,
    laborItems,
    overheadItems,
    totalMaterialCost,
    totalLaborCost,
    totalOverheadAndPermits,
    totalContingencyCost,
    grandTotalCost,
    costPerSqFt,
    costPerSqM,
    materialPercentage,
    laborPercentage,
    overheadPercentage,
    contingencyPercentage,
    valueEngineeringTips,
  };
}
