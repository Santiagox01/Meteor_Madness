import { NEO_BROWSE_SAMPLE } from "@/lib/samples";

const DEFAULT_TIMEOUT = 10000; // Increased to 10 seconds for better reliability

// Type definitions
export interface NEO {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
  orbital_data?: {
    orbit_id: string;
    orbit_determination_date: string;
    first_observation_date: string;
    last_observation_date: string;
    data_arc_in_days: number;
    observations_used: number;
    orbit_uncertainty: string;
    minimum_orbit_intersection: string;
    jupiter_tisserand_invariant: string;
    epoch_osculation: string;
    eccentricity: string;
    semi_major_axis: string;
    inclination: string;
    ascending_node_longitude: string;
    orbital_period: string;
    perihelion_distance: string;
    perihelion_argument: string;
    aphelion_distance: string;
    perihelion_time: string;
    mean_anomaly: string;
    mean_motion: string;
  };
}

export interface AsteroidParams {
  name: string;
  diameterKilometers: number;
  densityKgM3: number;
  velocityKmS: number;
  impactAngleDeg: number;
  impactLat: number;
  impactLon: number;
  isOceanImpact: boolean;
}

export interface DeflectionParams {
  deltaVMS: number;
  leadTimeDays: number;
  direction: string;
}

async function withTimeout(resource: RequestInfo | URL, options: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(resource, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function requestJson<T>(url: string, fallback: T, options?: RequestInit & { timeoutMs?: number }) {
  try {
    const response = await withTimeout(url, { 
      ...options,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...options?.headers
      }
    });
    
    if (!response?.ok) {
      console.warn(`[api] HTTP ${response.status} for ${url}, using fallback data`);
      return fallback;
    }
    
    const data = await response.json();
    
    // Validate and normalize the response data
    if (data && typeof data === 'object') {
      return data as T;
    } else {
      console.warn(`[api] Invalid response format from ${url}, using fallback data`);
      return fallback;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`[api] Request failed for ${url}: ${errorMessage}, using fallback data`);
    return fallback;
  }
}

export async function fetchNeoBrowse(page = 0, size = 20) {
  const fallback = NEO_BROWSE_SAMPLE as any;
  const searchParams = new URLSearchParams({ page: String(page), size: String(size) });
  return requestJson(`/api/neo/browse?${searchParams.toString()}`, fallback);
}

export async function fetchNeoById(id: string) {
  if (!id) return null as any;
  return requestJson(`/api/neo/${encodeURIComponent(id)}`, null as any);
}

export async function fetchElevation(lat: number, lon: number) {
  return requestJson(`/api/usgs/elevation?lat=${lat}&lon=${lon}`, null as any);
}
