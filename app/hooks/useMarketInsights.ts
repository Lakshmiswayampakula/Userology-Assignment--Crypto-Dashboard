import { useState, useEffect } from "react";
import { z } from "zod";

// Define the schema for market insight data
const marketInsightSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  value: z.number(),
  change: z.number(),
  changeDirection: z.enum(["up", "down", "neutral"]),
  category: z.enum(["onChain", "market", "social", "technical"]),
  icon: z.string(),
  timestamp: z.string().datetime(),
}).passthrough();

// Define the schema for the API response
export const marketInsightsSchema = z.object({
  insights: z.array(marketInsightSchema),
  lastUpdated: z.string().datetime(),
});

// Type inference
export type MarketInsightsType = z.infer<typeof marketInsightsSchema>;

// Mock insights data for fallback
const mockInsightsData: MarketInsightsType = {
  insights: [
    {
      id: "1",
      title: "Bitcoin Network Hash Rate",
      description: "The total computational power used to mine and process transactions on the Bitcoin network",
      value: 450.2,
      change: 5.8,
      changeDirection: "up",
      category: "onChain",
      icon: "hash",
      timestamp: new Date().toISOString(),
      unit: "EH/s"
    },
    {
      id: "2",
      title: "Active Bitcoin Addresses",
      description: "The number of unique addresses that participated in transactions on the Bitcoin network",
      value: 1050000,
      change: -2.3,
      changeDirection: "down",
      category: "onChain",
      icon: "users",
      timestamp: new Date().toISOString(),
      unit: "addresses"
    },
    {
      id: "3",
      title: "Exchange Inflow Volume",
      description: "The total volume of Bitcoin flowing into exchanges, indicating potential selling pressure",
      value: 12500,
      change: 0.5,
      changeDirection: "neutral",
      category: "market",
      icon: "arrow-down",
      timestamp: new Date().toISOString(),
      unit: "BTC"
    },
    {
      id: "4",
      title: "Exchange Outflow Volume",
      description: "The total volume of Bitcoin flowing out of exchanges, indicating potential accumulation",
      value: 13200,
      change: 3.2,
      changeDirection: "up",
      category: "market",
      icon: "arrow-up",
      timestamp: new Date().toISOString(),
      unit: "BTC"
    },
    {
      id: "5",
      title: "Social Media Mentions",
      description: "The number of mentions of Bitcoin across major social media platforms",
      value: 285000,
      change: 12.5,
      changeDirection: "up",
      category: "social",
      icon: "message-circle",
      timestamp: new Date().toISOString(),
      unit: "mentions"
    },
    {
      id: "6",
      title: "Social Sentiment Score",
      description: "The overall sentiment of social media discussions about Bitcoin",
      value: 0.65,
      change: 0.08,
      changeDirection: "up",
      category: "social",
      icon: "thumbs-up",
      timestamp: new Date().toISOString(),
      unit: "score"
    },
    {
      id: "7",
      title: "BTC Dominance",
      description: "Bitcoin's market capitalization as a percentage of the total cryptocurrency market",
      value: 42.8,
      change: -1.2,
      changeDirection: "down",
      category: "market",
      icon: "pie-chart",
      timestamp: new Date().toISOString(),
      unit: "%"
    },
    {
      id: "8",
      title: "Mining Difficulty",
      description: "A measure of how difficult it is to find a new block compared to the easiest it can ever be",
      value: 58.3,
      change: 4.1,
      changeDirection: "up",
      category: "onChain",
      icon: "activity",
      timestamp: new Date().toISOString(),
      unit: "T"
    },
    {
      id: "9",
      title: "Transaction Volume",
      description: "The total value of all transactions on the Bitcoin network in the last 24 hours",
      value: 28500,
      change: 7.3,
      changeDirection: "up",
      category: "onChain",
      icon: "bar-chart",
      timestamp: new Date().toISOString(),
      unit: "BTC"
    }
  ],
  lastUpdated: new Date().toISOString(),
};

export function useMarketInsights() {
  const [data, setData] = useState<MarketInsightsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, you would use APIs like Glassnode, Santiment, or similar
        // For this example, we'll use the mock data directly
        // Simulate delay to mimic API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data directly instead of API call
        const validatedData = marketInsightsSchema.parse(mockInsightsData);
        setData(validatedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching market insights:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        // Set fallback data even on error
        setData(mockInsightsData);
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