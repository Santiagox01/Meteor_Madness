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

export function runImpactModel(params: AsteroidParams): SimulationResult {
  const massKg = computeMassKg(params.diameterKilometers, params.densityKgM3);
  const E = kineticEnergyJ(massKg, params.velocityKmS);
  const Y_mt = tntMegatonsFromJoules(E);
  const craterDiameterKm = craterDiameterFromEnergyJ(E);
  const blast5psiRadiusKm = blastRadiusKm5psi(Y_mt);
  const lightDamageRadiusKmVal = computeLightDamageRadiusKm(Y_mt);
  const estSeismicMagnitude = estimateSeismicMagnitude(E);
  const torinoScale = torinoScaleFromEnergyMt(Y_mt);
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
