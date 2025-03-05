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
    
    // Use the Binance Futures API endpoint as specified by the user
    const binanceUrl = 'https://fapi.binance.com/fapi/v1/ticker/price';
    
    let fetchUrl = binanceUrl;
    
    // If symbols are provided, add them as query parameters
    if (symbols) {
      const symbolList = symbols.split(',');
      // For multiple symbols, we'll make individual requests and combine them
      // as the futures API doesn't support multiple symbols in the same way
      if (symbolList.length > 1) {
        // No need to encode as JSON for this endpoint
        fetchUrl = `${binanceUrl}?symbol=${symbolList[0]}`;
      } else {
        // For a single symbol
        fetchUrl = `${binanceUrl}?symbol=${symbolList[0]}`;
      }
    }
    
    console.log('Fetching from Binance URL:', fetchUrl);
    
    // Fetch data from Binance with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    let formattedData: BinancePrice[] = [];
    
    if (symbols) {
      const symbolList = symbols.split(',');
      
      if (symbolList.length > 1) {
        // For multiple symbols, fetch them in parallel
        const promises = symbolList.map(symbol => 
          fetch(`${binanceUrl}?symbol=${symbol}`, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Crypto-Trade-Tracker/1.0.0'
            },
            next: { revalidate: 30 } // Cache for 30 seconds
          }).then(res => {
            if (!res.ok) {
              console.warn(`Failed to fetch ${symbol}: ${res.status}`);
              return null;
            }
            return res.json();
          }).catch(err => {
            console.warn(`Error fetching ${symbol}:`, err);
            return null;
          })
        );
        
        const results = await Promise.all(promises);
        formattedData = results
          .filter(Boolean)
          .map(item => item as BinancePrice);
      } else {
        // For a single symbol
        const response = await fetch(fetchUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Crypto-Trade-Tracker/1.0.0'
          },
          next: { revalidate: 30 } // Cache for 30 seconds
        });
        
        if (!response.ok) {
          console.error(`Binance API error: ${response.status} - ${response.statusText}`);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Binance API error: ${response.status}`);
        }
        
        const data = await response.json();
        formattedData = [data];
      }
    } else {
      // If no symbols provided, fetch all available prices
      const response = await fetch(fetchUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Crypto-Trade-Tracker/1.0.0'
        },
        next: { revalidate: 30 } // Cache for 30 seconds
      });
      
      if (!response.ok) {
        console.error(`Binance API error: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Binance API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // The futures API returns an array by default when no symbol is specified
      formattedData = Array.isArray(data) ? data : [data];
    }
    
    clearTimeout(timeoutId);
    
    console.log('Binance API response:', JSON.stringify(formattedData).substring(0, 200) + '...');
    
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