import { useState, useEffect } from "react";
import { z } from "zod";

// Define the schema for trending coin data
const trendingCoinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string().url(),
  market_cap_rank: z.number(),
  score: z.number(),
  sentiment_score: z.number(),
  social_volume: z.number(),
  price_change_percentage_24h: z.number(),
  market_cap_change_percentage_24h: z.number(),
  last_updated: z.string().datetime(),
}).passthrough();

// Define the schema for the API response
export const trendingCryptosSchema = z.object({
  coins: z.array(trendingCoinSchema),
  last_updated: z.string().datetime(),
});

export type TrendingCryptosType = z.infer<typeof trendingCryptosSchema>;

export function useTrendingCryptos() {
  const [data, setData] = useState<TrendingCryptosType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Using CoinGecko API for trending coins
        const response = await fetch(
          "https://api.coingecko.com/api/v3/search/trending"
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const rawData = await response.json();
        
        // Transform the data to match our schema
        const transformedData = {
          coins: rawData.coins.map((coin: { 
            item: { 
              id: string; 
              symbol: string; 
              name: string; 
              small: string; 
              market_cap_rank?: number; 
              score?: number; 
            } 
          }) => ({
            id: coin.item.id,
            symbol: coin.item.symbol,
            name: coin.item.name,
            image: coin.item.small,
            market_cap_rank: coin.item.market_cap_rank || 0,
            score: coin.item.score || 0,
            // Generate mock sentiment data (in a real app, you'd use a sentiment analysis API)
            sentiment_score: Math.random() * 2 - 1, // Random value between -1 and 1
            social_volume: Math.floor(Math.random() * 10000), // Random social volume
            price_change_percentage_24h: Math.random() * 20 - 10, // Random price change
            market_cap_change_percentage_24h: Math.random() * 15 - 7.5, // Random market cap change
            last_updated: new Date().toISOString(),
          })),
          last_updated: new Date().toISOString(),
        };
        
        // Validate the data with our schema
        const validatedData = trendingCryptosSchema.parse(transformedData);
        setData(validatedData);
      } catch (err) {
        console.error("Error fetching trending cryptos:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up polling to refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { data, isLoading, error };
} 