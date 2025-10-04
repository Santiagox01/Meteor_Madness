import { Handler } from '@netlify/functions';

const NASA_API_KEY = process.env.NASA_API_KEY || 'bbPZTSieIbxGv876Tj1ERj22p8pgnJ53feOnVwwO';
const NASA_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Extract NEO ID from path
    const neoId = event.path.split('/').pop();
    
    if (!neoId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'NEO ID is required' }),
      };
    }
    
    const url = `${NASA_BASE_URL}/neo/${encodeURIComponent(neoId)}?api_key=${NASA_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NASA API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching NEO data by ID:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch NEO data from NASA API',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};