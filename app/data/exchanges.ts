import { z } from "zod";

const ExchangeSchema = z.object({
  id: z.string(),
  name: z.string(),
  year_established: z.number().optional(),
  country: z.string().nullable(),
  description: z.string().nullable(),
  url: z.string(),
  image: z.string(),
  has_trading_incentive: z.boolean().nullable(), // Accepts boolean or null
  trust_score: z.number(),
  trust_score_rank: z.number(),
  trade_volume_24h_btc: z.number(),
  trade_volume_24h_btc_normalized: z.number(),
});

export type Exchange = z.infer<typeof ExchangeSchema>;

// Fallback data for when API fails
const fallbackExchanges: Exchange[] = [
  {
    id: "binance",
    name: "Binance",
    year_established: 2017,
    country: "Cayman Islands",
    description: null,
    url: "https://www.binance.com",
    image: "https://assets.coingecko.com/markets/images/52/small/binance.jpg",
    has_trading_incentive: false,
    trust_score: 10,
    trust_score_rank: 1,
    trade_volume_24h_btc: 450000,
    trade_volume_24h_btc_normalized: 450000
  },
  {
    id: "coinbase",
    name: "Coinbase Exchange",
    year_established: 2012,
    country: "United States",
    description: null,
    url: "https://www.coinbase.com",
    image: "https://assets.coingecko.com/markets/images/23/small/Coinbase_Coin_Primary.png",
    has_trading_incentive: null,
    trust_score: 10,
    trust_score_rank: 2,
    trade_volume_24h_btc: 250000,
    trade_volume_24h_btc_normalized: 250000
  }
];

export async function fetchExchanges(): Promise<Exchange[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_COINGECKO_EXCHANGES_API as string}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch exchanges: ${response.statusText}`);
    }

    const data = await response.json();
    const result = ExchangeSchema.array().safeParse(data);

    if (result.success) {
      return result.data; // Return validated data
    } else {
      console.error("Validation failed:", result.error);
      throw new Error("Invalid data structure from API");
    }
  } catch (error) {
    console.error("Error fetching exchanges:", error);
    return fallbackExchanges; // Return fallback data
  }
}
