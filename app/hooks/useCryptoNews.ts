import { useState, useEffect } from "react";
import { z } from "zod";

// Define the schema for news article data
const newsArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  publishedAt: z.string().datetime(),
  summary: z.string(),
  sentiment: z.enum(["positive", "negative", "neutral"]),
  sentimentScore: z.number(),
  imageUrl: z.string().url().optional(),
  category: z.string(),
}).passthrough();

// Define the schema for the API response
export const cryptoNewsSchema = z.object({
  articles: z.array(newsArticleSchema),
  lastUpdated: z.string().datetime(),
});

export type CryptoNewsType = z.infer<typeof cryptoNewsSchema>;

export function useCryptoNews() {
  const [data, setData] = useState<CryptoNewsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, you would use a news API like NewsAPI, CryptoCompare, or similar
        // For this example, we'll simulate the API response with mock data
        const mockNewsData = {
          articles: [
            {
              id: "1",
              title: "Bitcoin Surges Past $50,000 as Institutional Adoption Grows",
              url: "https://example.com/news/bitcoin-surges",
              source: "CryptoNews",
              publishedAt: new Date().toISOString(),
              summary: "Bitcoin has reached a new milestone, surpassing $50,000 for the first time in months as institutional investors continue to show strong interest in the leading cryptocurrency.",
              sentiment: "positive",
              sentimentScore: 0.8,
              imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              category: "Bitcoin"
            },
            {
              id: "2",
              title: "Ethereum 2.0 Upgrade Faces Delays Amid Technical Challenges",
              url: "https://example.com/news/ethereum-delay",
              source: "BlockchainDaily",
              publishedAt: new Date(Date.now() - 3600000).toISOString(),
              summary: "The highly anticipated Ethereum 2.0 upgrade is facing potential delays as developers encounter technical challenges in the final testing phase.",
              sentiment: "negative",
              sentimentScore: -0.3,
              imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              category: "Ethereum"
            },
            {
              id: "3",
              title: "New Regulatory Framework Proposed for Cryptocurrency Exchanges",
              url: "https://example.com/news/crypto-regulation",
              source: "FinanceToday",
              publishedAt: new Date(Date.now() - 7200000).toISOString(),
              summary: "Global regulators have proposed a new framework for cryptocurrency exchanges, aiming to enhance consumer protection while fostering innovation in the digital asset space.",
              sentiment: "neutral",
              sentimentScore: 0.1,
              imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              category: "Regulation"
            },
            {
              id: "4",
              title: "DeFi Projects See Record Growth in Total Value Locked",
              url: "https://example.com/news/defi-growth",
              source: "DeFiInsider",
              publishedAt: new Date(Date.now() - 10800000).toISOString(),
              summary: "Decentralized finance protocols have reached a new all-time high in total value locked, signaling growing confidence in the DeFi ecosystem.",
              sentiment: "positive",
              sentimentScore: 0.6,
              imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              category: "DeFi"
            },
            {
              id: "5",
              title: "Major Tech Company Announces Bitcoin Integration",
              url: "https://example.com/news/tech-bitcoin",
              source: "TechCrunch",
              publishedAt: new Date(Date.now() - 14400000).toISOString(),
              summary: "A leading technology company has announced plans to integrate Bitcoin payments into its platform, further bridging the gap between traditional tech and cryptocurrency.",
              sentiment: "positive",
              sentimentScore: 0.7,
              imageUrl: "https://images.unsplash.com/photo-1516245834210-c4c142787335?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              category: "Adoption"
            },
            {
              id: "6",
              title: "Cryptocurrency Mining Faces Environmental Criticism",
              url: "https://example.com/news/crypto-mining",
              source: "GreenTech",
              publishedAt: new Date(Date.now() - 18000000).toISOString(),
              summary: "Environmental groups are raising concerns about the energy consumption of cryptocurrency mining operations, calling for more sustainable practices.",
              sentiment: "negative",
              sentimentScore: -0.5,
              imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              category: "Environment"
            }
          ],
          lastUpdated: new Date().toISOString(),
        };
        
        // Validate the data with our schema
        const validatedData = cryptoNewsSchema.parse(mockNewsData);
        setData(validatedData);
      } catch (err) {
        console.error("Error fetching crypto news:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up polling to refresh data every 10 minutes
    const intervalId = setInterval(fetchData, 10 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { data, isLoading, error };
} 