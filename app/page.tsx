"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PriceCards } from "./Components/price-cards";
import { CryptoChart } from "./Components/crypto-chart";
import { CryptoOverview } from "./Components/crypto-overview";
import { MarketHighlights } from "./Components/market-highlights";
import { MarketTable } from "./Components/market-table";
import { TrendingCryptos } from "./Components/trending-cryptos";
import { MarketInsights } from "./Components/market-insights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update the timestamp every 5 minutes to match the API data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 min-h-screen">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Coin Cash Dashboard
          </h1>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        
        <Tabs defaultValue="trending" className="space-y-4">
          <TabsList className="grid w-full max-w-sm mx-auto grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending">
            <TrendingCryptos />
          </TabsContent>
          
          <TabsContent value="insights">
            <MarketInsights />
          </TabsContent>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-background/50 rounded-xl p-2 sm:p-3">
                  <PriceCards />
                </div>
                <div className="bg-background/50 rounded-xl p-2 sm:p-3">
                  <CryptoChart />
                </div>
                <div className="bg-background/50 rounded-xl p-2 sm:p-3">
                  <MarketTable />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-background/50 rounded-xl p-2 sm:p-3">
                  <CryptoOverview />
                </div>
                <div className="bg-background/50 rounded-xl p-2 sm:p-3">
                  <MarketHighlights />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
}
