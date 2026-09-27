import { CurrencyCode, QualityTier } from '../types/civil';

export interface MaterialCostDatabase {
  // Structural (Unit prices in local currency for standard tier)
  brickUnitCost: number; // per brick or AAC block
  cementBagCost: number; // per 50kg bag
  sandTonCost: number;   // per ton
  aggregateTonCost: number; // per ton
  steelTonCost: number;  // per metric ton TMT
  readyMixConcreteCuM: number; // per m3 ready mix M20/M25

  // Finishes
  flooringSqFtCost: Record<QualityTier, number>;
  windowSqFtCost: Record<QualityTier, number>;
  doorUnitCost: Record<QualityTier, number>;
  wallPuttyPrimerSqFtCost: Record<QualityTier, number>;
  paintSqFtCost: Record<QualityTier, number>;
  plumbingPerBathroomCost: Record<QualityTier, number>;
  electricalSqFtCost: Record<QualityTier, number>;

  // Interiors
  modularKitchenBaseCost: Record<QualityTier, number>;
  wardrobePerBedCost: Record<QualityTier, number>;

  // Exterior
  drivewayPaverSqFtCost: Record<QualityTier, number>;
  lawnTurfSqFtCost: Record<QualityTier, number>;
  boundaryWallRftCost: Record<QualityTier, number>;
  mainGateCost: Record<QualityTier, number>;

  // Labor rates per sq.ft of built-up area
  laborCivilMasonryPerSqFt: Record<QualityTier, number>;
  laborShutteringRccPerSqFt: Record<QualityTier, number>;
  laborMepFinishingPerSqFt: Record<QualityTier, number>;
  laborPaintingPerSqFt: Record<QualityTier, number>;

  // Professional fees
  architectFeesPerSqFt: number;
  municipalPermitsFlat: number;
}

export const REGIONAL_RATES: Record<CurrencyCode, MaterialCostDatabase> = {
  USD: {
    brickUnitCost: 0.95,
    cementBagCost: 14.5,
    sandTonCost: 38.0,
    aggregateTonCost: 32.0,
    steelTonCost: 1150.0,
    readyMixConcreteCuM: 135.0,

    flooringSqFtCost: { economy: 4.5, standard: 8.5, luxury: 19.0 },
    windowSqFtCost: { economy: 24.0, standard: 45.0, luxury: 95.0 },
    doorUnitCost: { economy: 180.0, standard: 380.0, luxury: 850.0 },
    wallPuttyPrimerSqFtCost: { economy: 1.2, standard: 2.1, luxury: 3.8 },
    paintSqFtCost: { economy: 1.8, standard: 3.2, luxury: 6.5 },
    plumbingPerBathroomCost: { economy: 1600.0, standard: 3200.0, luxury: 7500.0 },
    electricalSqFtCost: { economy: 6.0, standard: 11.5, luxury: 22.0 },

    modularKitchenBaseCost: { economy: 4200.0, standard: 9500.0, luxury: 24000.0 },
    wardrobePerBedCost: { economy: 1200.0, standard: 2600.0, luxury: 6200.0 },

    drivewayPaverSqFtCost: { economy: 6.0, standard: 11.0, luxury: 22.0 },
    lawnTurfSqFtCost: { economy: 2.5, standard: 4.5, luxury: 9.0 },
    boundaryWallRftCost: { economy: 35.0, standard: 65.0, luxury: 120.0 },
    mainGateCost: { economy: 850.0, standard: 1800.0, luxury: 4200.0 },

    laborCivilMasonryPerSqFt: { economy: 22.0, standard: 32.0, luxury: 48.0 },
    laborShutteringRccPerSqFt: { economy: 14.0, standard: 20.0, luxury: 30.0 },
    laborMepFinishingPerSqFt: { economy: 16.0, standard: 24.0, luxury: 38.0 },
    laborPaintingPerSqFt: { economy: 6.0, standard: 9.0, luxury: 15.0 },

    architectFeesPerSqFt: 6.5,
    municipalPermitsFlat: 2800.0,
  },
  EUR: {
    brickUnitCost: 0.90,
    cementBagCost: 13.5,
    sandTonCost: 35.0,
    aggregateTonCost: 30.0,
    steelTonCost: 1080.0,
    readyMixConcreteCuM: 125.0,

    flooringSqFtCost: { economy: 4.2, standard: 8.0, luxury: 18.0 },
    windowSqFtCost: { economy: 22.0, standard: 42.0, luxury: 88.0 },
    doorUnitCost: { economy: 170.0, standard: 360.0, luxury: 800.0 },
    wallPuttyPrimerSqFtCost: { economy: 1.1, standard: 2.0, luxury: 3.5 },
    paintSqFtCost: { economy: 1.7, standard: 3.0, luxury: 6.0 },
    plumbingPerBathroomCost: { economy: 1500.0, standard: 3000.0, luxury: 7000.0 },
    electricalSqFtCost: { economy: 5.8, standard: 10.8, luxury: 20.5 },

    modularKitchenBaseCost: { economy: 4000.0, standard: 9000.0, luxury: 22000.0 },
    wardrobePerBedCost: { economy: 1100.0, standard: 2400.0, luxury: 5800.0 },

    drivewayPaverSqFtCost: { economy: 5.5, standard: 10.5, luxury: 20.0 },
    lawnTurfSqFtCost: { economy: 2.2, standard: 4.2, luxury: 8.5 },
    boundaryWallRftCost: { economy: 32.0, standard: 60.0, luxury: 110.0 },
    mainGateCost: { economy: 800.0, standard: 1700.0, luxury: 3900.0 },

    laborCivilMasonryPerSqFt: { economy: 20.0, standard: 30.0, luxury: 45.0 },
    laborShutteringRccPerSqFt: { economy: 13.0, standard: 19.0, luxury: 28.0 },
    laborMepFinishingPerSqFt: { economy: 15.0, standard: 22.0, luxury: 35.0 },
    laborPaintingPerSqFt: { economy: 5.5, standard: 8.5, luxury: 14.0 },

    architectFeesPerSqFt: 6.0,
    municipalPermitsFlat: 2500.0,
  },
  GBP: {
    brickUnitCost: 0.85,
    cementBagCost: 11.5,
    sandTonCost: 32.0,
    aggregateTonCost: 28.0,
    steelTonCost: 980.0,
    readyMixConcreteCuM: 115.0,

    flooringSqFtCost: { economy: 3.8, standard: 7.5, luxury: 16.5 },
    windowSqFtCost: { economy: 20.0, standard: 38.0, luxury: 80.0 },
    doorUnitCost: { economy: 150.0, standard: 320.0, luxury: 720.0 },
    wallPuttyPrimerSqFtCost: { economy: 1.0, standard: 1.8, luxury: 3.2 },
    paintSqFtCost: { economy: 1.5, standard: 2.8, luxury: 5.5 },
    plumbingPerBathroomCost: { economy: 1350.0, standard: 2700.0, luxury: 6200.0 },
    electricalSqFtCost: { economy: 5.2, standard: 9.8, luxury: 18.5 },

    modularKitchenBaseCost: { economy: 3600.0, standard: 8200.0, luxury: 20000.0 },
    wardrobePerBedCost: { economy: 1000.0, standard: 2200.0, luxury: 5200.0 },

    drivewayPaverSqFtCost: { economy: 5.0, standard: 9.5, luxury: 18.5 },
    lawnTurfSqFtCost: { economy: 2.0, standard: 3.8, luxury: 7.8 },
    boundaryWallRftCost: { economy: 30.0, standard: 55.0, luxury: 100.0 },
    mainGateCost: { economy: 720.0, standard: 1550.0, luxury: 3600.0 },

    laborCivilMasonryPerSqFt: { economy: 19.0, standard: 28.0, luxury: 42.0 },
    laborShutteringRccPerSqFt: { economy: 12.0, standard: 17.5, luxury: 26.0 },
    laborMepFinishingPerSqFt: { economy: 14.0, standard: 21.0, luxury: 32.0 },
    laborPaintingPerSqFt: { economy: 5.0, standard: 7.8, luxury: 13.0 },

    architectFeesPerSqFt: 5.5,
    municipalPermitsFlat: 2200.0,
  },
  INR: {
    brickUnitCost: 8.5,       // ₹8.5 per red brick / AAC block
    cementBagCost: 395.0,     // ₹395 per 50kg bag (OPC/PPC)
    sandTonCost: 1450.0,      // ₹1450 per ton M-sand
    aggregateTonCost: 1150.0, // ₹1150 per ton 20mm
    steelTonCost: 68000.0,    // ₹68,000 per ton Fe-550D TMT
    readyMixConcreteCuM: 4600.0, // ₹4600 per m3 M25 RMC

    flooringSqFtCost: { economy: 55.0, standard: 110.0, luxury: 280.0 }, // vitrified / marble
    windowSqFtCost: { economy: 320.0, standard: 580.0, luxury: 1250.0 }, // UPVC / Alum
    doorUnitCost: { economy: 4500.0, standard: 9500.0, luxury: 24000.0 }, // flush / teak
    wallPuttyPrimerSqFtCost: { economy: 14.0, standard: 26.0, luxury: 48.0 },
    paintSqFtCost: { economy: 20.0, standard: 38.0, luxury: 75.0 }, // Royale / exterior
    plumbingPerBathroomCost: { economy: 18000.0, standard: 36000.0, luxury: 85000.0 },
    electricalSqFtCost: { economy: 65.0, standard: 125.0, luxury: 260.0 },

    modularKitchenBaseCost: { economy: 65000.0, standard: 165000.0, luxury: 450000.0 },
    wardrobePerBedCost: { economy: 22000.0, standard: 48000.0, luxury: 120000.0 },

    drivewayPaverSqFtCost: { economy: 60.0, standard: 110.0, luxury: 220.0 },
    lawnTurfSqFtCost: { economy: 35.0, standard: 65.0, luxury: 140.0 },
    boundaryWallRftCost: { economy: 450.0, standard: 850.0, luxury: 1800.0 },
    mainGateCost: { economy: 18000.0, standard: 42000.0, luxury: 95000.0 },

    laborCivilMasonryPerSqFt: { economy: 220.0, standard: 340.0, luxury: 520.0 },
    laborShutteringRccPerSqFt: { economy: 140.0, standard: 210.0, luxury: 320.0 },
    laborMepFinishingPerSqFt: { economy: 160.0, standard: 240.0, luxury: 390.0 },
    laborPaintingPerSqFt: { economy: 55.0, standard: 85.0, luxury: 140.0 },

    architectFeesPerSqFt: 55.0,
    municipalPermitsFlat: 45000.0,
  },
  CAD: {
    brickUnitCost: 1.3,
    cementBagCost: 19.5,
    sandTonCost: 52.0,
    aggregateTonCost: 44.0,
    steelTonCost: 1550.0,
    readyMixConcreteCuM: 185.0,

    flooringSqFtCost: { economy: 6.0, standard: 11.5, luxury: 25.0 },
    windowSqFtCost: { economy: 32.0, standard: 60.0, luxury: 128.0 },
    doorUnitCost: { economy: 240.0, standard: 520.0, luxury: 1150.0 },
    wallPuttyPrimerSqFtCost: { economy: 1.6, standard: 2.8, luxury: 5.1 },
    paintSqFtCost: { economy: 2.4, standard: 4.3, luxury: 8.8 },
    plumbingPerBathroomCost: { economy: 2100.0, standard: 4300.0, luxury: 10200.0 },
    electricalSqFtCost: { economy: 8.2, standard: 15.5, luxury: 29.5 },

    modularKitchenBaseCost: { economy: 5800.0, standard: 12800.0, luxury: 32000.0 },
    wardrobePerBedCost: { economy: 1600.0, standard: 3500.0, luxury: 8400.0 },

    drivewayPaverSqFtCost: { economy: 8.0, standard: 15.0, luxury: 30.0 },
    lawnTurfSqFtCost: { economy: 3.4, standard: 6.1, luxury: 12.2 },
    boundaryWallRftCost: { economy: 48.0, standard: 88.0, luxury: 160.0 },
    mainGateCost: { economy: 1150.0, standard: 2450.0, luxury: 5600.0 },

    laborCivilMasonryPerSqFt: { economy: 29.0, standard: 43.0, luxury: 64.0 },
    laborShutteringRccPerSqFt: { economy: 19.0, standard: 27.0, luxury: 41.0 },
    laborMepFinishingPerSqFt: { economy: 21.0, standard: 32.0, luxury: 51.0 },
    laborPaintingPerSqFt: { economy: 8.0, standard: 12.0, luxury: 20.0 },

    architectFeesPerSqFt: 8.8,
    municipalPermitsFlat: 3800.0,
  },
  AUD: {
    brickUnitCost: 1.45,
    cementBagCost: 22.0,
    sandTonCost: 58.0,
    aggregateTonCost: 49.0,
    steelTonCost: 1720.0,
    readyMixConcreteCuM: 205.0,

    flooringSqFtCost: { economy: 6.8, standard: 13.0, luxury: 28.5 },
    windowSqFtCost: { economy: 36.0, standard: 68.0, luxury: 145.0 },
    doorUnitCost: { economy: 270.0, standard: 580.0, luxury: 1300.0 },
    wallPuttyPrimerSqFtCost: { economy: 1.8, standard: 3.2, luxury: 5.8 },
    paintSqFtCost: { economy: 2.7, standard: 4.8, luxury: 9.8 },
    plumbingPerBathroomCost: { economy: 2400.0, standard: 4900.0, luxury: 11500.0 },
    electricalSqFtCost: { economy: 9.2, standard: 17.5, luxury: 33.5 },

    modularKitchenBaseCost: { economy: 6400.0, standard: 14500.0, luxury: 36000.0 },
    wardrobePerBedCost: { economy: 1800.0, standard: 3900.0, luxury: 9400.0 },

    drivewayPaverSqFtCost: { economy: 9.0, standard: 16.8, luxury: 33.5 },
    lawnTurfSqFtCost: { economy: 3.8, standard: 6.8, luxury: 13.8 },
    boundaryWallRftCost: { economy: 53.0, standard: 98.0, luxury: 180.0 },
    mainGateCost: { economy: 1300.0, standard: 2750.0, luxury: 6400.0 },

    laborCivilMasonryPerSqFt: { economy: 33.0, standard: 48.0, luxury: 72.0 },
    laborShutteringRccPerSqFt: { economy: 21.0, standard: 30.0, luxury: 46.0 },
    laborMepFinishingPerSqFt: { economy: 24.0, standard: 36.0, luxury: 58.0 },
    laborPaintingPerSqFt: { economy: 9.0, standard: 13.5, luxury: 22.5 },

    architectFeesPerSqFt: 9.8,
    municipalPermitsFlat: 4200.0,
  },
  AED: {
    brickUnitCost: 3.5,
    cementBagCost: 26.0,
    sandTonCost: 85.0,
    aggregateTonCost: 75.0,
    steelTonCost: 2850.0,
    readyMixConcreteCuM: 320.0,

    flooringSqFtCost: { economy: 12.0, standard: 24.0, luxury: 55.0 },
    windowSqFtCost: { economy: 65.0, standard: 120.0, luxury: 260.0 },
    doorUnitCost: { economy: 480.0, standard: 1050.0, luxury: 2400.0 },
    wallPuttyPrimerSqFtCost: { economy: 3.2, standard: 5.8, luxury: 10.5 },
    paintSqFtCost: { economy: 4.8, standard: 8.8, luxury: 18.0 },
    plumbingPerBathroomCost: { economy: 4200.0, standard: 8800.0, luxury: 21000.0 },
    electricalSqFtCost: { economy: 16.0, standard: 31.0, luxury: 60.0 },

    modularKitchenBaseCost: { economy: 11000.0, standard: 25000.0, luxury: 65000.0 },
    wardrobePerBedCost: { economy: 3200.0, standard: 7000.0, luxury: 16800.0 },

    drivewayPaverSqFtCost: { economy: 16.0, standard: 30.0, luxury: 60.0 },
    lawnTurfSqFtCost: { economy: 6.8, standard: 12.5, luxury: 25.0 },
    boundaryWallRftCost: { economy: 95.0, standard: 175.0, luxury: 320.0 },
    mainGateCost: { economy: 2300.0, standard: 4900.0, luxury: 11500.0 },

    laborCivilMasonryPerSqFt: { economy: 42.0, standard: 62.0, luxury: 95.0 },
    laborShutteringRccPerSqFt: { economy: 28.0, standard: 39.0, luxury: 60.0 },
    laborMepFinishingPerSqFt: { economy: 31.0, standard: 47.0, luxury: 75.0 },
    laborPaintingPerSqFt: { economy: 12.0, standard: 18.0, luxury: 30.0 },

    architectFeesPerSqFt: 14.0,
    municipalPermitsFlat: 6500.0,
  },
};
