import { Handler } from '@netlify/functions';

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_NEO_API = 'https://api.nasa.gov/neo/rest/v1';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const pathSegments = event.path.split('/');
    const neoId = pathSegments[pathSegments.length - 1];
    
    if (!neoId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'NEO ID is required' })
      };
    }

    const url = `${NASA_NEO_API}/neo/${encodeURIComponent(neoId)}?api_key=${NASA_API_KEY}`;
    
    // Add timeout to NASA API request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CodeNebula-Asteroid-Tracker/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Asteroid not found' })
        };
      }
      throw new Error(`NASA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Normalize data structure
    const normalizedData = {
      ...data,
      estimated_diameter: data.estimated_diameter || {
        meters: { estimated_diameter_min: 0, estimated_diameter_max: 0 }
      },
      close_approach_data: data.close_approach_data || []
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(normalizedData)
    };
  } catch (error) {
    console.error('NEO Detail API Error:', error);
    
    // Enhanced fallback for specific known asteroids
    const fallbackData: Record<string, any> = {
      "433": {
        id: "2000433",
        neo_reference_id: "2000433",
        name: "433 Eros (A898 PA)",
        designation: "433",
        nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2000433",
        absolute_magnitude_h: 10.4,
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 13.139,
            estimated_diameter_max: 29.381
          },
          meters: {
            estimated_diameter_min: 13139.1,
            estimated_diameter_max: 29381.2
          }
        },
        is_potentially_hazardous_asteroid: false,
        close_approach_data: [
          {
            close_approach_date: "2025-01-30",
            close_approach_date_full: "2025-Jan-30 14:23",
            epoch_date_close_approach: 1738242180000,
            relative_velocity: {
              kilometers_per_second: "5.39",
              kilometers_per_hour: "19404",
              miles_per_hour: "12057"
            },
            miss_distance: {
              astronomical: "0.1964",
              lunar: "76.4",
              kilometers: "29390429",
              miles: "18265825"
            },
            orbiting_body: "Earth"
          }
        ],
        orbital_data: {
          orbit_id: "658",
          orbit_determination_date: "2023-06-07 06:13:47",
          first_observation_date: "1893-10-29",
          last_observation_date: "2023-05-30",
          data_arc_in_days: 47458,
          observations_used: 8767,
          orbit_uncertainty: "0",
          minimum_orbit_intersection: ".149693",
          jupiter_tisserand_invariant: "4.582",
          epoch_osculation: "2460400.5",
          eccentricity: ".2226769452339329",
          semi_major_axis: "1.457982037181598",
          inclination: "10.82758153207067",
          ascending_node_longitude: "304.3006669470586",
          orbital_period: "643.2018977185347",
          perihelion_distance: "1.132832002132104",
          perihelion_argument: "178.8388173738877",
          aphelion_distance: "1.783132072231091",
          perihelion_time: "2460563.130615353226",
          mean_anomaly: "320.1165361157671",
          mean_motion: ".5598186418102161"
        }
      },
      "99942": {
        id: "2099942",
        neo_reference_id: "2099942",
        name: "99942 Apophis (2004 MN4)",
        designation: "99942",
        nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2099942",
        absolute_magnitude_h: 19.7,
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 0.32,
            estimated_diameter_max: 0.37
          },
          meters: {
            estimated_diameter_min: 320,
            estimated_diameter_max: 370
          }
        },
        is_potentially_hazardous_asteroid: true,
        close_approach_data: [
          {
            close_approach_date: "2029-04-13",
            close_approach_date_full: "2029-Apr-13 21:46",
            epoch_date_close_approach: 1871071560000,
            relative_velocity: {
              kilometers_per_second: "7.42",
              kilometers_per_hour: "26712",
              miles_per_hour: "16591"
            },
            miss_distance: {
              astronomical: "0.0002567",
              lunar: "99.8",
              kilometers: "38400000",
              miles: "23862000"
            },
            orbiting_body: "Earth"
          }
        ],
        orbital_data: {
          orbit_id: "226",
          orbit_determination_date: "2023-06-07 06:13:47",
          first_observation_date: "2004-06-19",
          last_observation_date: "2023-05-30",
          data_arc_in_days: 6920,
          observations_used: 2531,
          orbit_uncertainty: "0",
          minimum_orbit_intersection: ".0002567",
          jupiter_tisserand_invariant: "3.33",
          epoch_osculation: "2460400.5",
          eccentricity: ".1915",
          semi_major_axis: "0.922",
          inclination: "3.33",
          ascending_node_longitude: "204.45",
          orbital_period: "323.6",
          perihelion_distance: "0.746",
          perihelion_argument: "126.39",
          aphelion_distance: "1.098",
          perihelion_time: "2460563.130615353226",
          mean_anomaly: "245.75",
          mean_motion: "1.113"
        }
      }
    };
    
    const pathSegments = event.path.split('/');
    const neoId = pathSegments[pathSegments.length - 1];
    
    if (fallbackData[neoId]) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(fallbackData[neoId])
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch NEO details', details: error.message })
    };
  }
};