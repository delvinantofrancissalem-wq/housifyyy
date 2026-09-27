/**
 * Architron Civil & BOQ Estimator - Domain Types
 */

export type UnitSystem = 'imperial' | 'metric'; // sq.ft / feet vs sq.m / meters
export type QualityTier = 'economy' | 'standard' | 'luxury';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateMultiplierToUSD: number; // For baseline calculations
  locale: string;
}

export type RoomType =
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'master_bed'
  | 'guest_bed'
  | 'kids_bed'
  | 'attached_bath'
  | 'common_bath'
  | 'utility_laundry'
  | 'foyer_corridor'
  | 'study_office'
  | 'patio_balcony'
  | 'carport_garage'
  | 'lawn_garden';

export interface RoomSpecification {
  id: string;
  name: string;
  type: RoomType;
  zone: 'social' | 'service' | 'private' | 'exterior';
  lengthFt: number; // in feet
  widthFt: number;  // in feet
  heightFt: number; // in feet (default 10)
  windowsCount: number;
  doorsCount: number;
  naturalVentilation: 'High' | 'Moderate' | 'Mechanical';
  daylightExposure: 'North' | 'South' | 'East' | 'West' | 'Dual Aspect';
  flooringType: string;
}

export interface ExteriorFeatures {
  lawnAreaSqFt: number;
  parkingSpots: number; // 1 or 2 cars
  drivewayPavedSqFt: number;
  boundaryWallLengthFt: number;
  patioDeckSqFt: number;
  hasMainGate: boolean;
}

export interface PlotSpecification {
  plotWidthFt: number;
  plotLengthFt: number;
  frontSetbackFt: number;
  rearSetbackFt: number;
  sideSetbackLeftFt: number;
  sideSetbackRightFt: number;
  floorsCount: number; // 1 (Ground) or 2 (G+1)
}

export interface HouseProjectConfig {
  projectName: string;
  clientName: string;
  location: string;
  unitSystem: UnitSystem;
  currency: CurrencyCode;
  qualityTier: QualityTier;
  steelRatioKgPerSqFt: number; // default ~4.0
  cementBagsPerSqFt: number;   // default ~0.42
  contingencyPercent: number;  // default 7%
  plot: PlotSpecification;
  rooms: RoomSpecification[];
  exterior: ExteriorFeatures;
}

export interface BoqItem {
  id: string;
  category: 'structural' | 'finishing' | 'interior' | 'exterior';
  name: string;
  specification: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  notes?: string;
}

export interface LaborItem {
  id: string;
  trade: string;
  description: string;
  mandaysOrSqFt: number;
  unit: string;
  ratePerUnit: number;
  totalCost: number;
}

export interface OverheadPermitItem {
  id: string;
  title: string;
  description: string;
  basis: string;
  amount: number;
}

export interface ValueEngineeringTip {
  title: string;
  category: string;
  savingsPotential: string;
  structuralImpact: 'Neutral' | 'Approved Equivalent' | 'Requires Structural Check';
  description: string;
  recommendation: string;
}

export interface BoqCalculationResult {
  totalBuiltUpAreaSqFt: number;
  totalBuiltUpAreaSqM: number;
  totalPlotAreaSqFt: number;
  groundCoverageSqFt: number;
  farRatio: number; // Floor Area Ratio
  
  structuralItems: BoqItem[];
  finishingItems: BoqItem[];
  interiorItems: BoqItem[];
  exteriorItems: BoqItem[];

  laborItems: LaborItem[];
  overheadItems: OverheadPermitItem[];

  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadAndPermits: number;
  totalContingencyCost: number;
  
  grandTotalCost: number;
  costPerSqFt: number;
  costPerSqM: number;

  materialPercentage: number;
  laborPercentage: number;
  overheadPercentage: number;
  contingencyPercentage: number;

  valueEngineeringTips: ValueEngineeringTip[];
}
