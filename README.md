# CryptoCoins Dashboard WebApp

A modern Next.js application for tracking cryptocurrency markets, news, and related financial data with beautiful visualizations.

## Features

- **Crypto Market Overview**: Real-time price tracking and market data
- **Interactive Charts**: Detailed cryptocurrency price history visualization
- **Market Insights**: Comprehensive market analysis and trends
- **News Integration**: Latest cryptocurrency news updates
- **Currency Conversion**: Support for multiple currency views
- **Weather Information**: Additional weather data feature
- **Responsive UI**: Fully responsive design with dark/light mode support
- **Data Tables**: Organized presentation of crypto market data

## Technologies Used

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS with animations
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack)
- **UI Components**: Radix UI, Lucide Icons, Recharts
- **Form Validation**: Zod
- **Animation**: Framer Motion
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/crypto-coins-dashboard.git
```

2. Navigate to the project directory:
```bash
cd crypto-coins-dashboard
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

### Running the Application

- Development mode:
```bash
npm run dev
# or
yarn dev
```

- Production build:
```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure

```
crypto-coins-dashboard/
├── app/                    # Next.js app router directory
│   ├── Components/         # Reusable UI components
│   │   ├── crypto-chart.tsx
│   │   ├── crypto-news.tsx
│   │   ├── market-table.tsx
│   │   └── ... (other components)
│   ├── data/               # Data fetching and schemas
│   ├── hooks/              # Custom React hooks
│   ├── currency/           # Currency conversion pages
│   ├── news/               # News section
│   ├── weather/            # Weather section
│   └── ... (other app directories)
├── components/             # Shared UI components
├── lib/                    # Utility functions
├── public/                 # Static assets
└── ... (config files)
```

## Configuration

The application can be configured through the following files:

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_KEY=your_crypto_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
```

## Available Scripts

- `dev`: Runs the app in development mode
- `build`: Creates an optimized production build
- `start`: Starts the production server
- `lint`: Runs ESLint for code quality checks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
