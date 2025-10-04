export const AU_KM = 149_597_870.7;
export const SCENE_SCALE = 5; // scene units per AU

const ASTEROID_A_AU = 1.2;
const ASTEROID_E = 0.3;
const EARTH_PERIOD_SEC = 365.25 * 86400;
const ASTEROID_PERIOD_SEC = Math.pow(ASTEROID_A_AU, 1.5) * 365.25 * 86400;

export function getEarthPosition(simTimeSec: number) {
  const angle = (2 * Math.PI * (simTimeSec % EARTH_PERIOD_SEC)) / EARTH_PERIOD_SEC;
  const x = SCENE_SCALE * Math.cos(angle);
  const z = SCENE_SCALE * Math.sin(angle);
  return { x, y: 0, z };
}

export function getAsteroidPosition(simTimeSec: number, deflected = false) {
  const meanAnomaly = (2 * Math.PI * (simTimeSec % ASTEROID_PERIOD_SEC)) / ASTEROID_PERIOD_SEC;
  const trueAnomaly = meanAnomaly; // simplified small-e approximation
  const a = ASTEROID_A_AU * SCENE_SCALE;
  const r = (a * (1 - ASTEROID_E * ASTEROID_E)) / (1 + ASTEROID_E * Math.cos(trueAnomaly));
  const x = r * Math.cos(trueAnomaly) + (deflected ? 0.3 : 0);
  const z = r * Math.sin(trueAnomaly);
  const y = 0.02 * Math.sin(2 * trueAnomaly);
  return { x, y, z };
}

export function sceneUnitsToKm(distanceSceneUnits: number) {
  return (distanceSceneUnits * AU_KM) / SCENE_SCALE;
}
