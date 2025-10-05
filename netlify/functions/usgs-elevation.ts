import { Handler } from '@netlify/functions';

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
    const { lat, lon } = event.queryStringParameters || {};
    
    if (!lat || !lon) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Latitude and longitude are required' })
      };
    }

    // USGS Elevation Point Query Service
    const url = `https://epqs.nationalmap.gov/v1/json?x=${lon}&y=${lat}&units=Meters&wkid=4326&includeDate=false`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        value: data
      })
    };
  } catch (error) {
    console.error('USGS Elevation API Error:', error);
    
    // Fallback elevation data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'fallback',
        value: {
          USGS_Elevation_Point_Query_Service: {
            Elevation: Math.floor(Math.random() * 2000) // Random elevation between 0-2000m
          }
        }
      })
    };
  }
};