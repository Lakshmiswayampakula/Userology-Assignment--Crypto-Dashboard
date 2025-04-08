// https://api.coingecko.com/api/v3/global

import { MarketGlobalType, marketGlobalSchema } from "./marketGlobalSchema";

// Fallback data when API fails
const fallbackGlobalData: MarketGlobalType = {
  data: {
    active_cryptocurrencies: 10523,
    ongoing_icos: 49,
    total_market_cap: {
      btc: 42158000,
      eth: 690500000,
      ltc: 18293000000,
      usd: 2834900000000
    },
    total_volume: {
      btc: 1926400,
      eth: 31557000,
      ltc: 836140000,
      usd: 129660000000
    },
    market_cap_percentage: {
      btc: 51.2,
      eth: 18.7,
      usdt: 4.2,
      bnb: 3.1,
      sol: 2.4
    },
    market_cap_change_percentage_24h_usd: 0.04
  }
};

export async function fetchMarketGlobal(): Promise<MarketGlobalType> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_COINGECKO_GLOBAL_API as string}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error("Failed to fetch global market data");
    }

    const data = await response.json();

    // Validate the data against the schema
    const parsedData = marketGlobalSchema.parse(data);

    return parsedData;
  } catch (error) {
    console.error("Error fetching global market data:", error);
    // Return fallback data when API fails
    return fallbackGlobalData;
  }
}
