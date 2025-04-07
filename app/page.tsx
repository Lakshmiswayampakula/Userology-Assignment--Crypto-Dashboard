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

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Coin Cash Dashboard</h1>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1.1fr] gap-4">
              <div className="space-y-4">
                <PriceCards />
                <CryptoChart />
                <MarketTable />
              </div>
              <div className="space-y-4">
                <CryptoOverview />
                <MarketHighlights />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-4">
            <TrendingCryptos />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-4">
            <MarketInsights />
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
}
