# Crypto Trade Tracker

A simple yet powerful web application to track your cryptocurrency trades and monitor performance in real-time.

## Features

- Add and manage cryptocurrency trades with ticker, entry price, leverage, and margin size
- Real-time price updates from Binance API
- Automatic PnL (Profit and Loss) calculations
- Sort and filter trades by various criteria
- Track account balance
- Responsive design for desktop and mobile
- Dark mode support

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- Binance API

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-trade-tracker.git
cd crypto-trade-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Set your initial account balance by clicking "Update" in the Account Balance card
2. Add trades by filling out the form in the "Add New Trade" section
3. View your trades in the table, which will automatically update with current prices
4. Sort trades by clicking on column headers
5. Filter trades by ticker using the filter input above the table

## Data Storage

All data is stored locally in your browser's localStorage. No data is sent to any server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Binance API](https://binance-docs.github.io/apidocs/) for real-time cryptocurrency price data
- [Next.js](https://nextjs.org/) for the React framework
- [TailwindCSS](https://tailwindcss.com/) for styling

## Deployment Configuration

### Setting up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add the following environment variable:
   - Name: `PROXY_SERVER_URL`
   - Value: `https://crypto-trade-tracker-proxy.onrender.com/api/binance/prices`
5. Select "Production" and "Preview" environments
6. Click "Save"
7. Redeploy your application for the changes to take effect

### Local Development

For local development, the `.env.local` file contains the necessary environment variables.

```
npm run dev
```

## Proxy Server

This application uses a proxy server deployed at:
`https://crypto-trade-tracker-proxy.onrender.com`

The proxy server relays requests to the Binance API from a region where it's accessible, allowing the application to work properly when deployed in regions where Binance API is restricted (like the US).

If the proxy server needs to be updated or redeployed, see the instructions in the `proxy-server` directory.
