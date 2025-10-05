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
    console.error('NEO Detail API Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch NEO details' })
    };
  }
};