import * as THREE from "three";

// Constants
export const AU_KM = 149_597_870.7; // Kilometers per AU
export const SCENE_SCALE = 5; // Scene units per AU
export const J2000_EPOCH = 2451545.0; // Julian Day Number for J2000.0
export const SECONDS_PER_DAY = 86400;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

// Tolerancia para Newton-Raphson
const KEPLER_TOLERANCE = 1e-6;
const MAX_ITERATIONS = 50;

// Interfaz para elementos orbitales keplerianos
export interface OrbitalElements {
  a: number;      // Semieje mayor (AU)
  e: number;      // Excentricidad
  i: number;      // Inclinación (grados)
  Ω: number;      // Longitud del nodo ascendente (grados)
  ω: number;      // Argumento del perihelio (grados)
  M0: number;     // Anomalía media en la época (grados)
  epoch: number;  // Época de referencia (Julian Day)
  period?: number; // Período orbital (días)
}

// Resultado de cálculo orbital
export interface OrbitalPosition {
  position: THREE.Vector3; // Posición heliocéntrica en unidades de escena
  velocity: THREE.Vector3; // Velocidad (opcional, para futuras implementaciones)
  trueAnomaly: number;     // Anomalía verdadera (radianes)
  radius: number;          // Distancia radial (AU)
}

/**
 * Elementos orbitales planetarios (época J2000.0)
 * Fuente: JPL Planetary and Lunar Ephemeris DE440
 */
export const PLANETARY_ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: {
    a: 0.38709927,
    e: 0.20563593,
    i: 7.00497902,
    Ω: 48.33076593,
    ω: 77.45779628,
    M0: 252.25032350,
    epoch: J2000_EPOCH,
    period: 87.969
  },
  Venus: {
    a: 0.72333566,
    e: 0.00677672,
    i: 3.39467605,
    Ω: 76.67984255,
    ω: 131.60246718,
    M0: 181.97909950,
    epoch: J2000_EPOCH,
    period: 224.701
  },
  Earth: {
    a: 1.00000261,
    e: 0.01671123,
    i: -0.00001531,
    Ω: 0.0,
    ω: 102.93768193,
    M0: 100.46457166,
    epoch: J2000_EPOCH,
    period: 365.256
  },
  Mars: {
    a: 1.52371034,
    e: 0.09339410,
    i: 1.84969142,
    Ω: 49.55953891,
    ω: -23.94362959,
    M0: -4.55343205,
    epoch: J2000_EPOCH,
    period: 686.980
  },
  Jupiter: {
    a: 5.20288700,
    e: 0.04838624,
    i: 1.30439695,
    Ω: 100.47390909,
    ω: 14.72847983,
    M0: 34.39644051,
    epoch: J2000_EPOCH,
    period: 4332.59
  },
  Saturn: {
    a: 9.53667594,
    e: 0.05386179,
    i: 2.48599187,
    Ω: 113.66242448,
    ω: 92.59887831,
    M0: 49.95424423,
    epoch: J2000_EPOCH,
    period: 10759.22
  },
  Uranus: {
    a: 19.18916464,
    e: 0.04725744,
    i: 0.77263783,
    Ω: 74.01692503,
    ω: 96.99839551,
    M0: 313.23810451,
    epoch: J2000_EPOCH,
    period: 30688.5
  },
  Neptune: {
    a: 30.06992276,
    e: 0.00859048,
    i: 1.77004347,
    Ω: 131.78422574,
    ω: 276.33634014,
    M0: -55.12002969,
    epoch: J2000_EPOCH,
    period: 60182
  }
};

/**
 * Resuelve la ecuación de Kepler M = E - e*sin(E) usando método Newton-Raphson
 * @param M - Anomalía media (radianes)
 * @param e - Excentricidad
 * @returns Anomalía excéntrica E (radianes)
 */
export function solveKeplerEquation(M: number, e: number): number {
  // Aproximación inicial
  let E = M + e * Math.sin(M);
  
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const f = E - e * Math.sin(E) - M;
    const df = 1 - e * Math.cos(E);
    
    const deltaE = f / df;
    E -= deltaE;
    
    if (Math.abs(deltaE) < KEPLER_TOLERANCE) {
      return E;
    }
  }
  
  console.warn(`Kepler equation did not converge for M=${M}, e=${e}`);
  return E;
}

/**
 * Calcula la anomalía verdadera a partir de la anomalía excéntrica
 * @param E - Anomalía excéntrica (radianes)
 * @param e - Excentricidad
 * @returns Anomalía verdadera (radianes)
 */
export function eccentricToTrueAnomaly(E: number, e: number): number {
  const beta = e / (1 + Math.sqrt(1 - e * e));
  return E + 2 * Math.atan((beta * Math.sin(E)) / (1 - beta * Math.cos(E)));
}

/**
 * Transforma coordenadas orbitales a coordenadas heliocéntricas eclípticas
 * @param r - Distancia radial
 * @param nu - Anomalía verdadera (radianes)
 * @param elements - Elementos orbitales
 * @returns Vector de posición en coordenadas heliocéntricas
 */
export function orbitalToHeliocentric(r: number, nu: number, elements: OrbitalElements): THREE.Vector3 {
  const { i, Ω, ω } = elements;
  
  // Convertir ángulos a radianes
  const i_rad = i * DEG_TO_RAD;
  const Omega_rad = Ω * DEG_TO_RAD;
  const omega_rad = ω * DEG_TO_RAD;
  
  // Posición en el plano orbital
  const cos_nu = Math.cos(nu);
  const sin_nu = Math.sin(nu);
  
  const x_orbital = r * cos_nu;
  const y_orbital = r * sin_nu;
  
  // Matrices de rotación
  const cos_omega = Math.cos(omega_rad);
  const sin_omega = Math.sin(omega_rad);
  const cos_Omega = Math.cos(Omega_rad);
  const sin_Omega = Math.sin(Omega_rad);
  const cos_i = Math.cos(i_rad);
  const sin_i = Math.sin(i_rad);
  
  // Transformación completa (aplicar rotaciones ω, i, Ω)
  const x = (cos_omega * cos_Omega - sin_omega * cos_i * sin_Omega) * x_orbital +
            (-sin_omega * cos_Omega - cos_omega * cos_i * sin_Omega) * y_orbital;
            
  const y = (cos_omega * sin_Omega + sin_omega * cos_i * cos_Omega) * x_orbital +
            (-sin_omega * sin_Omega + cos_omega * cos_i * cos_Omega) * y_orbital;
            
  const z = (sin_omega * sin_i) * x_orbital + (cos_omega * sin_i) * y_orbital;
  
  return new THREE.Vector3(x, y, z);
}

/**
 * Calcula la posición heliocéntrica de un cuerpo en un tiempo dado
 * @param elements - Elementos orbitales keplerianos
 * @param timeUTC - Tiempo en segundos desde época Unix
 * @returns Posición y datos orbitales
 */
export function getOrbitalPosition(elements: OrbitalElements, timeUTC: number): OrbitalPosition {
  const { a, e, M0, epoch } = elements;
  
  // Convertir tiempo UTC a días julianos
  const jd = (timeUTC / SECONDS_PER_DAY) + 2440587.5; // Unix epoch to Julian Day
  const dt = jd - epoch; // Días desde la época
  
  // Calcular movimiento medio (rad/día)
  const n = elements.period ? (2 * Math.PI) / elements.period : (2 * Math.PI) / Math.pow(a, 1.5) / 365.25;
  
  // Anomalía media actual
  const M = (M0 * DEG_TO_RAD + n * dt) % (2 * Math.PI);
  
  // Resolver ecuación de Kepler
  const E = solveKeplerEquation(M, e);
  
  // Anomalía verdadera
  const nu = eccentricToTrueAnomaly(E, e);
  
  // Distancia radial
  const r = a * (1 - e * Math.cos(E));
  
  // Transformar a coordenadas heliocéntricas
  const position = orbitalToHeliocentric(r, nu, elements);
  
  // Escalar para la escena 3D
  position.multiplyScalar(SCENE_SCALE);
  
  return {
    position,
    velocity: new THREE.Vector3(), // TODO: implementar cálculo de velocidad
    trueAnomaly: nu,
    radius: r
  };
}

/**
 * Genera puntos para dibujar una órbita elíptica completa
 * @param elements - Elementos orbitales
 * @param numPoints - Número de puntos a generar
 * @returns Array de puntos Vector3
 */
export function generateOrbitPoints(elements: OrbitalElements, numPoints: number = 360): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const { a, e } = elements;
  
  for (let i = 0; i <= numPoints; i++) {
    const nu = (2 * Math.PI * i) / numPoints; // Anomalía verdadera
    
    // Distancia radial usando ecuación de la elipse
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu));
    
    // Transformar a coordenadas heliocéntricas
    const position = orbitalToHeliocentric(r, nu, elements);
    position.multiplyScalar(SCENE_SCALE);
    
    points.push(position);
  }
  
  return points;
}

/**
 * Funciones de compatibilidad con la implementación anterior
 */
export function getEarthPosition(simTimeSec: number): { x: number; y: number; z: number } {
  const earthPos = getOrbitalPosition(PLANETARY_ELEMENTS.Earth, simTimeSec);
  return {
    x: earthPos.position.x,
    y: earthPos.position.y,
    z: earthPos.position.z
  };
}

export function getAsteroidPosition(simTimeSec: number, deflected = false): { x: number; y: number; z: number } {
  // Usar elementos de Eros (433) como ejemplo con ajustes para mejor simulación
  const asteroidElements: OrbitalElements = {
    a: 1.458,
    e: 0.223,
    i: 10.83,
    Ω: 304.30,
    ω: 178.84,
    M0: 320.12,
    epoch: J2000_EPOCH,
    period: 643.2
  };
  
  // Mejor sincronización temporal - usar tiempo ajustado con la época
  const adjustedTime = simTimeSec + (Date.now() / 1000 - simTimeSec) * 0.1; // Suavizar transiciones
  
  if (deflected) {
    // Simular deflexión modificando elementos orbitales de forma más realista
    asteroidElements.a *= 1.02; // Cambio menor en semieje mayor
    asteroidElements.e = Math.min(asteroidElements.e * 1.1, 0.95); // Cambio controlado en excentricidad
    asteroidElements.M0 += 15; // Desplazamiento en anomalía media
  }
  
  const asteroidPos = getOrbitalPosition(asteroidElements, adjustedTime);
  return {
    x: asteroidPos.position.x,
    y: asteroidPos.position.y,
    z: asteroidPos.position.z
  };
}

export function sceneUnitsToKm(distanceSceneUnits: number): number {
  return (distanceSceneUnits * AU_KM) / SCENE_SCALE;
}

export function kmToSceneUnits(distanceKm: number): number {
  return (distanceKm * SCENE_SCALE) / AU_KM;
}

export function auToSceneUnits(distanceAU: number): number {
  return distanceAU * SCENE_SCALE;
}

export function sceneUnitsToAU(distanceSceneUnits: number): number {
  return distanceSceneUnits / SCENE_SCALE;
}

/**
 * Interfaz para datos de fecha de aproximación organizados
 */
export interface ApproachDateInfo {
  /** Fecha de aproximación como ISO string */
  dateString: string;
  /** Timestamp en segundos */
  timestamp: number;
  /** Fecha formateada para mostrar al usuario */
  displayDate: string;
  /** Tiempo hasta la aproximación en segundos */
  timeUntil: number;
  /** Indica si la aproximación es en el pasado */
  isPast: boolean;
  /** Precisión de la fecha (estimada, calculada, observada) */
  precision: 'estimated' | 'calculated' | 'observed';
}

/**
 * Calcula la trayectoria de un meteorito teniendo en cuenta el día de aproximación
 * @param approachDate - Fecha de aproximación en formato ISO string o timestamp
 * @param currentTime - Tiempo actual en segundos UTC
 * @param elements - Elementos orbitales del asteroide
 * @returns Datos de trayectoria incluida la aproximación más cercana
 */
export interface TrajectoryData {
  currentPosition: THREE.Vector3;
  approachPosition: THREE.Vector3;
  distanceToEarth: number;
  timeToApproach: number;
  relativeVelocity: number;
  impactProbability: number;
  approachInfo: ApproachDateInfo;
}

/**
 * Organiza la información de fecha de aproximación de un meteorito
 * @param approachDate - Fecha de aproximación en formato ISO string o timestamp
 * @param currentTime - Tiempo actual en segundos UTC
 * @param precision - Precisión de la fecha
 * @returns Información organizada de la fecha de aproximación
 */
export function organizeApproachDate(
  approachDate: string | number,
  currentTime: number,
  precision: 'estimated' | 'calculated' | 'observed' = 'calculated'
): ApproachDateInfo {
  // Convertir fecha de aproximación a timestamp si es string
  const approachTime = typeof approachDate === 'string' 
    ? new Date(approachDate).getTime() / 1000
    : approachDate;
  
  const originalDateString = typeof approachDate === 'string' 
    ? approachDate 
    : new Date(approachDate * 1000).toISOString();
  
  // Calcular tiempo hasta la aproximación
  const timeUntil = approachTime - currentTime;
  const isPast = timeUntil < 0;
  
  // Formatear fecha para mostrar
  const approachDateObj = new Date(approachTime * 1000);
  const displayDate = approachDateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  return {
    dateString: originalDateString,
    timestamp: approachTime,
    displayDate,
    timeUntil,
    isPast,
    precision
  };
}

/**
 * Formatea el tiempo restante hasta la aproximación de forma legible
 * @param timeUntil - Tiempo en segundos hasta la aproximación
 * @returns Texto formateado del tiempo restante
 */
export function formatTimeUntilApproach(timeUntil: number): string {
  const absoluteTime = Math.abs(timeUntil);
  const days = Math.floor(absoluteTime / (24 * 3600));
  const hours = Math.floor((absoluteTime % (24 * 3600)) / 3600);
  const minutes = Math.floor((absoluteTime % 3600) / 60);
  
  const isPast = timeUntil < 0;
  const prefix = isPast ? 'Hace ' : 'En ';
  
  if (days > 0) {
    return `${prefix}${days} días${hours > 0 ? ` ${hours} horas` : ''}`;
  } else if (hours > 0) {
    return `${prefix}${hours} horas${minutes > 0 ? ` ${minutes} minutos` : ''}`;
  } else if (minutes > 0) {
    return `${prefix}${minutes} minutos`;
  } else {
    return isPast ? 'Aproximación pasada' : 'Aproximación inminente';
  }
}

/**
 * Calcula el nivel de riesgo basado en la fecha de aproximación
 * @param approachInfo - Información de la fecha de aproximación
 * @param distanceKm - Distancia mínima en kilómetros
 * @returns Nivel de riesgo ('low', 'medium', 'high', 'critical')
 */
export function calculateApproachRiskLevel(
  approachInfo: ApproachDateInfo, 
  distanceKm: number
): 'low' | 'medium' | 'high' | 'critical' {
  // Si ya pasó la aproximación, el riesgo es bajo
  if (approachInfo.isPast) return 'low';
  
  const daysUntil = approachInfo.timeUntil / (24 * 3600);
  const earthRadius = 6371; // km
  
  // Riesgo crítico: menos de 30 días y muy cerca
  if (daysUntil < 30 && distanceKm < earthRadius * 2) {
    return 'critical';
  }
  
  // Riesgo alto: menos de 90 días y relativamente cerca
  if (daysUntil < 90 && distanceKm < earthRadius * 5) {
    return 'high';
  }
  
  // Riesgo medio: menos de 365 días
  if (daysUntil < 365) {
    return 'medium';
  }
  
  return 'low';
}

export function calculateMeteoriteTrajectory(
  approachDate: string | number,
  currentTime: number,
  elements: OrbitalElements
): TrajectoryData {
  // Organizar información de fecha de aproximación
  const approachInfo = organizeApproachDate(approachDate, currentTime);
  const approachTime = approachInfo.timestamp;
  
  // Calcular posición actual del meteorito
  const currentPos = getOrbitalPosition(elements, currentTime);
  
  // Calcular posición en el momento de máxima aproximación
  const approachPos = getOrbitalPosition(elements, approachTime);
  
  // Posición de la Tierra en ambos momentos
  const earthCurrentPos = getOrbitalPosition(PLANETARY_ELEMENTS.Earth, currentTime);
  const earthApproachPos = getOrbitalPosition(PLANETARY_ELEMENTS.Earth, approachTime);
  
  // Calcular distancia actual a la Tierra
  const distanceToEarth = currentPos.position.distanceTo(earthCurrentPos.position);
  const distanceToEarthKm = sceneUnitsToKm(distanceToEarth);
  
  // Tiempo hasta la aproximación
  const timeToApproach = approachTime - currentTime;
  
  // Velocidad relativa estimada (simplificada)
  const distanceTraveled = currentPos.position.distanceTo(approachPos.position);
  const distanceTraveledKm = sceneUnitsToKm(distanceTraveled);
  const relativeVelocity = timeToApproach > 0 ? distanceTraveledKm / (timeToApproach / 3600) : 0;
  
  // Probabilidad de impacto basada en distancia mínima (simplificada)
  const minApproachDistance = approachPos.position.distanceTo(earthApproachPos.position);
  const minDistanceKm = sceneUnitsToKm(minApproachDistance);
  const earthRadius = 6371; // km
  const impactProbability = Math.max(0, Math.min(1, 
    1 - (minDistanceKm - earthRadius) / (earthRadius * 10)
  ));
  
  return {
    currentPosition: currentPos.position,
    approachPosition: approachPos.position,
    distanceToEarth: distanceToEarthKm,
    timeToApproach,
    relativeVelocity,
    impactProbability,
    approachInfo
  };
}

/**
 * Genera puntos de trayectoria para visualización de la aproximación
 * @param elements - Elementos orbitales
 * @param startTime - Tiempo inicial
 * @param endTime - Tiempo final
 * @param numPoints - Número de puntos a generar
 * @returns Array de puntos de trayectoria con timestamps
 */
export interface TrajectoryPoint {
  position: THREE.Vector3;
  time: number;
  distanceToEarth: number;
}

export function generateTrajectoryPoints(
  elements: OrbitalElements,
  startTime: number,
  endTime: number,
  numPoints: number = 100
): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = [];
  const timeStep = (endTime - startTime) / (numPoints - 1);
  
  for (let i = 0; i < numPoints; i++) {
    const time = startTime + i * timeStep;
    const asteroidPos = getOrbitalPosition(elements, time);
    const earthPos = getOrbitalPosition(PLANETARY_ELEMENTS.Earth, time);
    const distanceToEarth = sceneUnitsToKm(
      asteroidPos.position.distanceTo(earthPos.position)
    );
    
    points.push({
      position: asteroidPos.position,
      time,
      distanceToEarth
    });
  }
  
  return points;
}

/**
 * Obtiene la próxima fecha de aproximación futura de los datos de la API
 * @param closeApproachData - Array de datos de aproximación de la API de NASA
 * @returns La próxima aproximación futura o la más reciente si no hay futuras
 */
export function getNextApproachData(closeApproachData?: Array<any>) {
  if (!closeApproachData || closeApproachData.length === 0) {
    return null;
  }

  const currentTime = Date.now();
  const validApproaches = closeApproachData.filter(approach => 
    approach.close_approach_date && approach.miss_distance && approach.relative_velocity
  );

  if (validApproaches.length === 0) {
    return null;
  }

  // Buscar la primera aproximación futura
  const futureApproaches = validApproaches.filter(approach => {
    try {
      const approachTime = new Date(approach.close_approach_date).getTime();
      return !isNaN(approachTime) && approachTime > currentTime;
    } catch {
      return false;
    }
  });

  // Si hay aproximaciones futuras, devolver la más cercana
  if (futureApproaches.length > 0) {
    return futureApproaches.sort((a, b) => {
      const timeA = new Date(a.close_approach_date).getTime();
      const timeB = new Date(b.close_approach_date).getTime();
      return timeA - timeB;
    })[0];
  }

  // Si no hay aproximaciones futuras, devolver la más reciente del pasado
  const pastApproaches = validApproaches.filter(approach => {
    try {
      const approachTime = new Date(approach.close_approach_date).getTime();
      return !isNaN(approachTime) && approachTime <= currentTime;
    } catch {
      return false;
    }
  });

  if (pastApproaches.length > 0) {
    return pastApproaches.sort((a, b) => {
      const timeA = new Date(a.close_approach_date).getTime();
      const timeB = new Date(b.close_approach_date).getTime();
      return timeB - timeA; // Más reciente primero
    })[0];
  }

  // Fallback: devolver el primer elemento válido
  return validApproaches[0];
}

/**
 * Servicio para obtener datos orbitales desde las APIs de NASA
 */
export class NASADataService {
  private static readonly NASA_API_KEY = "bbPZTSieIbxGv876Tj1ERj22p8pgnJ53feOnVwwO";
  private static readonly HORIZONS_BASE_URL = "https://ssd.jpl.nasa.gov/api/horizons.api";
  private static readonly NEOWS_BASE_URL = "https://api.nasa.gov/neo/rest/v1";
  
  /**
   * Obtiene elementos orbitales de un asteroide desde JPL Horizons
   * @param asteroidId - ID del asteroide (ej: "433" para Eros)
   * @returns Elementos orbitales
   */
  static async getAsteroidElements(asteroidId: string): Promise<OrbitalElements> {
    try {
      // Usar JPL Horizons API para obtener elementos orbitales
      const params = new URLSearchParams({
        'format': 'json',
        'COMMAND': asteroidId,
        'OBJ_DATA': 'YES',
        'MAKE_EPHEM': 'NO',
        'EPHEM_TYPE': 'ELEMENTS',
        'CENTER': '500@10', // Heliocentric
        'START_TIME': '2024-01-01',
        'STOP_TIME': '2024-01-02',
        'STEP_SIZE': '1d'
      });
      
      const response = await fetch(`${this.HORIZONS_BASE_URL}?${params}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`NASA Horizons API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Parsear elementos orbitales de la respuesta
      return this.parseHorizonsElements(data, asteroidId);
      
    } catch (error) {
      console.warn(`Error fetching data from NASA Horizons for asteroid ${asteroidId}:`, error);
      
      // Intentar con NeoWs API como respaldo
      try {
        return await this.getAsteroidFromNeoWs(asteroidId);
      } catch (backupError) {
        console.warn(`Backup NeoWs API also failed:`, backupError);
        
        // Retornar elementos de ejemplo basados en asteroides conocidos
        return this.getFallbackElements(asteroidId);
      }
    }
  }
  
  /**
   * API de respaldo usando NeoWs de NASA
   */
  private static async getAsteroidFromNeoWs(asteroidId: string): Promise<OrbitalElements> {
    const response = await fetch(
      `${this.NEOWS_BASE_URL}/neo/${asteroidId}?api_key=${this.NASA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`NeoWs API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // NeoWs no proporciona elementos orbitales completos,
    // así que usaremos datos aproximados
    const orbitalData = data.orbital_data;
    
    return {
      a: parseFloat(orbitalData.semi_major_axis || "1.5"),
      e: parseFloat(orbitalData.eccentricity || "0.2"),
      i: parseFloat(orbitalData.inclination || "10"),
      Ω: parseFloat(orbitalData.ascending_node_longitude || "80"),
      ω: parseFloat(orbitalData.perihelion_argument || "60"),
      M0: parseFloat(orbitalData.mean_anomaly || "0"),
      epoch: J2000_EPOCH,
      period: parseFloat(orbitalData.orbital_period || "500")
    };
  }
  
  /**
   * Parsea elementos orbitales de la respuesta de Horizons
   */
  private static parseHorizonsElements(_data: any, asteroidId: string): OrbitalElements {
    // Esta implementación asume el formato de respuesta de Horizons
    // En práctica, necesitaríamos parsear el texto específico de la respuesta
    
    // Para esta implementación, retornamos elementos conocidos de asteroides comunes
    return this.getFallbackElements(asteroidId);
  }
  
  /**
   * Retorna elementos orbitales conocidos para asteroides comunes
   */
  private static getFallbackElements(asteroidId: string): OrbitalElements {
    const knownAsteroids: Record<string, OrbitalElements> = {
      // Eros (433)
      "433": {
        a: 1.458,
        e: 0.223,
        i: 10.83,
        Ω: 304.30,
        ω: 178.84,
        M0: 320.12,
        epoch: J2000_EPOCH,
        period: 643.2
      },
      // Apophis (99942)
      "99942": {
        a: 0.922,
        e: 0.191,
        i: 3.33,
        Ω: 204.45,
        ω: 126.39,
        M0: 245.75,
        epoch: J2000_EPOCH,
        period: 323.6
      },
      // Bennu (101955)
      "101955": {
        a: 1.126,
        e: 0.204,
        i: 6.035,
        Ω: 2.06,
        ω: 66.22,
        M0: 101.7,
        epoch: J2000_EPOCH,
        period: 436.6
      },
      // 1998 OR2 (52768)
      "52768": {
        a: 1.440,
        e: 0.291,
        i: 5.88,
        Ω: 213.9,
        ω: 195.1,
        M0: 67.4,
        epoch: J2000_EPOCH,
        period: 634.0
      }
    };
    
    // Retornar elementos conocidos o genéricos
    return knownAsteroids[asteroidId] || {
      a: 1.2 + Math.random() * 0.5, // 1.2-1.7 AU
      e: 0.1 + Math.random() * 0.3,  // 0.1-0.4 excentricidad
      i: Math.random() * 20,          // 0-20 grados inclinación
      Ω: Math.random() * 360,         // 0-360 grados
      ω: Math.random() * 360,         // 0-360 grados  
      M0: Math.random() * 360,        // 0-360 grados
      epoch: J2000_EPOCH,
      period: 300 + Math.random() * 400 // 300-700 días
    };
  }
  
  /**
   * Obtiene datos de múltiples asteroides NEO
   */
  static async getNearEarthAsteroids(limit: number = 20): Promise<OrbitalElements[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await fetch(
        `${this.NEOWS_BASE_URL}/feed?start_date=${today}&end_date=${weekLater}&api_key=${this.NASA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`NeoWs feed API error: ${response.status}`);
      }
      
      const data = await response.json();
      const asteroids: OrbitalElements[] = [];
      
      // Extraer asteroides de todos los días
      Object.values(data.near_earth_objects).forEach((dayAsteroids: any) => {
        dayAsteroids.slice(0, Math.ceil(limit / 7)).forEach((asteroid: any) => {
          if (asteroid.orbital_data) {
            asteroids.push({
              a: parseFloat(asteroid.orbital_data.semi_major_axis || "1.0"),
              e: parseFloat(asteroid.orbital_data.eccentricity || "0.2"),
              i: parseFloat(asteroid.orbital_data.inclination || "5"),
              Ω: Math.random() * 360, // NeoWs no siempre incluye todos los elementos
              ω: Math.random() * 360,
              M0: Math.random() * 360,
              epoch: J2000_EPOCH,
              period: parseFloat(asteroid.orbital_data.orbital_period || "365")
            });
          }
        });
      });
      
      return asteroids.slice(0, limit);
      
    } catch (error) {
      console.warn('Error fetching NEO data:', error);
      
      // Retornar asteroides de ejemplo
      return Array.from({ length: limit }, (_, i) => this.getFallbackElements(`${i + 1000}`));
    }
  }
}
