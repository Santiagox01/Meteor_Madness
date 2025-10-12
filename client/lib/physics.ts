import type { AsteroidParams, DeflectionParams } from "@/lib/api";

// Add missing type
export interface SimulationResult {
  outcome: string;
  successProbability: number;
  deflectionAngle: number;
  massKg: number;
  kineticEnergyJ: number;
  tntMegatons: number;
  craterDiameterKm: number;
  blast5psiRadiusKm: number;
  lightDamageRadiusKm: number;
  estSeismicMagnitude: number;
  torinoScale: number;
  thermodynamics?: ThermodynamicsResult;
}

export interface ThermodynamicsResult {
  totalEnergyConserved: number;
  heatEnergyJ: number;
  expansionWorkJ: number;
  seismicEnergyJ: number;
  ejectaEnergyJ: number;
  temperatureIncrease: number;
  entropyIncrease: number;
  heatTransferRate: number;
}

export function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function computeMassKg(diameterKilometers: number, densityKgM3: number) {
  const diameterMeters = diameterKilometers * 1000;
  const r = diameterMeters / 2;
  return (4 / 3) * Math.PI * r * r * r * densityKgM3;
}

export function kineticEnergyJ(massKg: number, velocityKmS: number) {
  const v = velocityKmS * 1000; // to m/s
  return 0.5 * massKg * v * v;
}

export function tntMegatonsFromJoules(E: number) {
  return E / 4.184e15;
}

/**
 * Crater diameter from impact energy (educational):
 * D_km ≈ 1.8 * (E/1e15)^(0.22)
 */
export function craterDiameterFromEnergyJ(E: number) {
  const D = 1.8 * Math.pow(Math.max(E, 0) / 1e15, 0.22);
  return D;
}

/**
 * Nuclear-like blast scaling for 5 psi overpressure radius (educational)
 * R5 ~ 4.5 * Y^(1/3) km, where Y is megatons TNT
 */
export function blastRadiusKm5psi(Y_mt: number) {
  return 4.5 * Math.cbrt(Math.max(Y_mt, 0));
}

export function computeLightDamageRadiusKm(Y_mt: number) {
  return 7.5 * Math.cbrt(Math.max(Y_mt, 0));
}

export function estimateSeismicMagnitude(E_kinetic_J: number) {
  // Very rough coupling fraction from kinetic to seismic energy
  const coupling = 4e-4; // 0.04%
  const E_seis = Math.max(E_kinetic_J * coupling, 1);
  // Gutenberg-Richter like scaling: M ~ 0.67 log10(E) - 5.87 (E in Joules)
  const M = 0.67 * Math.log10(E_seis) - 5.87;
  return Math.max(0, M);
}

export function torinoScaleFromEnergyMt(Y_mt: number) {
  const y = Math.max(Y_mt, 0);
  if (y < 1e-3) return 0;
  if (y < 0.1) return 1;
  if (y < 1) return 2;
  if (y < 10) return 3;
  if (y < 50) return 4;
  if (y < 100) return 5;
  if (y < 300) return 6;
  if (y < 1000) return 7;
  if (y < 5000) return 8;
  if (y < 20000) return 9;
  return 10;
}

/**
 * Primera Ley de la Termodinámica: Cálculo de conservación de energía
 * Analiza cómo la energía cinética del asteroide se transforma en diferentes formas
 */
export function calculateEnergyConservation(kineticEnergyJ: number): ThermodynamicsResult {
  // Fracciones de energía basadas en estudios de impactos (aproximaciones)
  const heatFraction = 0.65; // ~65% se convierte en calor
  const expansionFraction = 0.20; // ~20% trabajo de expansión (ondas de choque)
  const seismicFraction = 0.10; // ~10% ondas sísmicas
  const ejectaFraction = 0.05; // ~5% eyección de material

  const heatEnergyJ = kineticEnergyJ * heatFraction;
  const expansionWorkJ = kineticEnergyJ * expansionFraction;
  const seismicEnergyJ = kineticEnergyJ * seismicFraction;
  const ejectaEnergyJ = kineticEnergyJ * ejectaFraction;

  // Verificación de conservación de energía (Primera Ley)
  const totalEnergyConserved = heatEnergyJ + expansionWorkJ + seismicEnergyJ + ejectaEnergyJ;

  // Cálculo de incremento de temperatura (aproximación)
  // Asumiendo que el calor se distribuye en un volumen esférico
  const temperatureIncrease = calculateTemperatureIncrease(heatEnergyJ);

  // Cálculo de incremento de entropía (transformación irreversible)
  const entropyIncrease = calculateEntropyIncrease(heatEnergyJ, temperatureIncrease);

  // Tasa de transferencia de calor (W/m²)
  const heatTransferRate = calculateHeatTransferRate(heatEnergyJ, temperatureIncrease);

  return {
    totalEnergyConserved,
    heatEnergyJ,
    expansionWorkJ,
    seismicEnergyJ,
    ejectaEnergyJ,
    temperatureIncrease,
    entropyIncrease,
    heatTransferRate,
  };
}

/**
 * Cálculo de incremento de temperatura por transferencia de calor
 * ΔT = Q / (m * c_p) donde Q es calor, m es masa, c_p es calor específico
 */
export function calculateTemperatureIncrease(heatEnergyJ: number): number {
  // Aproximaciones para material rocoso/atmosférico
  const affectedMass = 1e12; // kg (masa aproximada de material afectado)
  const specificHeat = 800; // J/(kg·K) (calor específico promedio)
  
  return heatEnergyJ / (affectedMass * specificHeat);
}

/**
 * Cálculo de incremento de entropía
 * ΔS = Q/T (para procesos irreversibles)
 */
export function calculateEntropyIncrease(heatEnergyJ: number, temperatureK: number): number {
  const baseTemperature = 288; // K (temperatura base de la Tierra ~15°C)
  const avgTemperature = baseTemperature + temperatureK / 2;
  
  return heatEnergyJ / avgTemperature;
}

/**
 * Cálculo de tasa de transferencia de calor
 * q = h * A * ΔT donde h es coeficiente de transferencia, A es área
 */
export function calculateHeatTransferRate(heatEnergyJ: number, temperatureDiff: number): number {
  const heatTransferCoeff = 25; // W/(m²·K) (coeficiente aproximado)
  const impactArea = Math.PI * Math.pow(1000, 2); // m² (área de impacto ~1km radio)
  const timeFrame = 3600; // s (1 hora)
  
  // Potencia térmica promedio considerando diferencia de temperatura
  const thermalPower = heatEnergyJ / timeFrame;
  const baseHeatFlux = thermalPower / impactArea;
  
  // Ajustar por diferencia de temperatura (factor de transferencia)
  const temperatureFactor = Math.max(0.1, temperatureDiff / 1000); // Normalizado
  
  return baseHeatFlux * (1 + temperatureFactor * heatTransferCoeff / 100);
}

/**
 * Balance de energía total del sistema
 * Verifica que la suma de todas las formas de energía igual la energía inicial
 */
export function validateEnergyBalance(
  initialKineticEnergy: number,
  thermodynamicsResult: ThermodynamicsResult
): { isBalanced: boolean; errorPercentage: number } {
  const totalTransformed = thermodynamicsResult.totalEnergyConserved;
  const difference = Math.abs(initialKineticEnergy - totalTransformed);
  const errorPercentage = (difference / initialKineticEnergy) * 100;
  
  // Considerar balanceado si el error es menor al 1%
  const isBalanced = errorPercentage < 1.0;
  
  return { isBalanced, errorPercentage };
}

export function runImpactModel(params: AsteroidParams): SimulationResult {
  const massKg = computeMassKg(params.diameterKilometers, params.densityKgM3);
  const E = kineticEnergyJ(massKg, params.velocityKmS);
  const Y_mt = tntMegatonsFromJoules(E);
  const craterDiameterKm = craterDiameterFromEnergyJ(E);
  const blast5psiRadiusKm = blastRadiusKm5psi(Y_mt);
  const lightDamageRadiusKmVal = computeLightDamageRadiusKm(Y_mt);
  const estSeismicMagnitude = estimateSeismicMagnitude(E);
  const torinoScale = torinoScaleFromEnergyMt(Y_mt);
  
  // Cálculos termodinámicos
  const thermodynamics = calculateEnergyConservation(E);
  
  return {
    outcome: "impact",
    successProbability: 1.0,
    deflectionAngle: 0,
    massKg,
    kineticEnergyJ: E,
    tntMegatons: Y_mt,
    craterDiameterKm,
    blast5psiRadiusKm,
    lightDamageRadiusKm: lightDamageRadiusKmVal,
    estSeismicMagnitude,
    torinoScale,
    thermodynamics,
  };
}

/**
 * Simple deflection outcome estimate: approximates along-track displacement
 * s ≈ Δv * t (assuming small change and near-linearized motion). If s exceeds
 * Earth radius projected at encounter (~6371 km), we consider a miss.
 */
export function estimateDeflectionOutcome(
  def: DeflectionParams,
  encounterDistanceKm = 6371
) {
  const t = def.leadTimeDays * 86400; // seconds
  const s = Math.abs(def.deltaVMS) * t; // meters
  const s_km = s / 1000;
  return {
    alongTrackShiftKm: s_km,
    avoidsImpact: s_km > encounterDistanceKm,
  };
}
