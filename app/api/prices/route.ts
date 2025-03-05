import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get symbols from query params
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');
    
    // Construct the Binance API URL
    const binanceUrl = 'https://fapi.binance.com/fapi/v1/ticker/price';
    
    // Fetch data from Binance
    const response = await fetch(binanceUrl);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter by symbols if provided
    if (symbols) {
      const symbolList = symbols.split(',');
      const filteredData = data.filter((item: any) => 
        symbolList.includes(item.symbol)
      );
      return NextResponse.json(filteredData);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
} 