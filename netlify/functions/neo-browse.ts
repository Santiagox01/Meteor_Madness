import { Handler } from '@netlify/functions';

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_NEO_API = 'https://api.nasa.gov/neo/rest/v1';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const { page = '0', size = '20' } = event.queryStringParameters || {};
    
    const url = `${NASA_NEO_API}/neo/browse?page=${page}&size=${size}&api_key=${NASA_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('NEO Browse API Error:', error);
    
    // Fallback sample data
    const fallbackData = {
      links: {
        next: "http://www.neowsapi.com/rest/v1/neo/browse?page=1&size=20&api_key=API_KEY",
        self: "http://www.neowsapi.com/rest/v1/neo/browse?page=0&size=20&api_key=API_KEY"
      },
      page: {
        size: 20,
        total_elements: 34439,
        total_pages: 1722,
        number: 0
      },
      near_earth_objects: [
        {
          id: "2000433",
          neo_reference_id: "2000433",
          name: "433 Eros (A898 PA)",
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
          ]
        }
      ]
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(fallbackData)
    };
  }
};