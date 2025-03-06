import { NextResponse } from 'next/server';

// Define the shape of the Binance API response
interface BinancePrice {
  symbol: string;
  price: string;
  time?: number;
}

export async function GET(request: Request) {
  // Set CORS headers for the preflight request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    // Get symbols from query params
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');
    
    // Use the deployed proxy server URL
    const proxyUrl = process.env.PROXY_SERVER_URL || 'https://crypto-trade-tracker-proxy.onrender.com/api/binance/prices';
    
    let fetchUrl = proxyUrl;
    
    // If symbols are provided, add them as query parameters
    if (symbols) {
      fetchUrl = `${proxyUrl}?symbols=${symbols}`;
    }
    
    console.log('Fetching from proxy URL:', fetchUrl);
    
    // Fetch data from proxy with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(fetchUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Crypto-Trade-Tracker/1.0.0'
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Proxy API error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Proxy API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format the data consistently
    const formattedData: BinancePrice[] = Array.isArray(data) ? data : [data];
    
    console.log('API response:', JSON.stringify(formattedData).substring(0, 200) + '...');
    
    // Return the response with CORS headers
    return NextResponse.json(formattedData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    
    // Return error response with CORS headers
    return NextResponse.json(
      { error: 'Failed to fetch prices', message: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
} 