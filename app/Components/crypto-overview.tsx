"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGlobalMarket } from "../hooks/useGlobalMarket";
import { marketGlobalSchema } from "../data/marketGlobalSchema";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Coins, Bitcoin } from "lucide-react";

type GlobalData = {
  activeCryptos: number;
  totalMarketCap: number;
  totalVolume: number;
  bitCoinDominance: number;
  marketCapChange: number;
};

// Fallback global data in case API fails
const fallbackGlobalData: GlobalData = {
  activeCryptos: 10523,
  totalMarketCap: 2834900000000,
  totalVolume: 129660000000,
  bitCoinDominance: 51.2,
  marketCapChange: 0.04,
};

export function CryptoOverview() {
  const [globalData, setGlobalData] = useState<GlobalData>(fallbackGlobalData);
  const { data: globalMarketData, isLoading } = useGlobalMarket();

  useEffect(() => {
    // Only process data when loading is complete and data exists
    if (!isLoading && globalMarketData) {
      try {
        // Directly access the data property
        const parsedData = marketGlobalSchema.parse(globalMarketData);

        if (!parsedData?.data) {
          console.error("Parsed data is empty");
          return;
        }

        const {
          total_market_cap = {},
          total_volume = {},
          active_cryptocurrencies = 0,
          market_cap_percentage = {},
          market_cap_change_percentage_24h_usd = 0,
        } = parsedData.data;

        // Use reduce to sum up the values
        const totalMarketCapSum = Object.values(total_market_cap).reduce(
          (sum, value) => sum + value,
          0
        );

        const totalVolumeSum = Object.values(total_volume).reduce(
          (sum, value) => sum + value,
          0
        );

        const bitCoinDominance = market_cap_percentage.btc
          ? parseFloat(market_cap_percentage.btc.toFixed(2))
          : 0;

        const formattedData: GlobalData = {
          activeCryptos: active_cryptocurrencies,
          totalMarketCap: totalMarketCapSum,
          totalVolume: totalVolumeSum,
          bitCoinDominance,
          marketCapChange: market_cap_change_percentage_24h_usd,
        };

        setGlobalData(formattedData);
      } catch (error) {
        console.error("Error parsing market data:", error);

        // If it's a ZodError, log more details
        if (error instanceof z.ZodError) {
          console.error(
            "Zod Error Details:",
            JSON.stringify(error.errors, null, 2)
          );
        }
      }
    }
  }, [globalMarketData, isLoading]);
  
  const formattedNumber = (num: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10 
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="p-6 space-y-6 rounded-xl shadow-sm overflow-hidden border-none bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Market Overview</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary/50 to-primary rounded-full"></div>
        </div>

        {/* Top Metrics Section */}
        <motion.div 
          className="grid gap-4 sm:grid-cols-2 pb-4 pt-3"
          variants={containerVariants}
        >
          {isLoading ? (
            <>
              <Skeleton className="h-[120px] rounded-xl" />
              <Skeleton className="h-[120px] rounded-xl" />
            </>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <Card className="p-4 py-6 flex flex-col items-center gap-3 justify-center shadow-sm hover:shadow-md transition-all duration-300 border-none bg-gradient-to-br from-background to-background/80 group">
                  <div className={`flex items-center gap-2 p-2 px-4 rounded-full ${globalData.marketCapChange >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {globalData.marketCapChange >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {globalData.marketCapChange.toFixed(2)}%
                    </span>
                  </div>

                  <p className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    ${formattedNumber(globalData.totalMarketCap)}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Market Cap
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-4 py-6 flex flex-col items-center gap-3 justify-center shadow-sm hover:shadow-md transition-all duration-300 border-none bg-gradient-to-br from-background to-background/80 group">
                  <div className="flex items-center gap-2 p-2 px-4 rounded-full bg-primary/10 text-primary">
                    <Bitcoin className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      BTC {globalData.bitCoinDominance}%
                    </span>
                  </div>

                  <p className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    ${formattedNumber(globalData.totalVolume)}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    24h Trading Volume
                  </p>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Bottom Section */}
        <motion.div variants={itemVariants}>
          <Card className="p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 border-none bg-gradient-to-br from-background to-background/80 group">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 size-10 flex items-center justify-center text-primary rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Cryptocurrencies</p>
                <p className="text-xs text-muted-foreground">Total number of active coins</p>
              </div>
            </div>
            <div className="text-lg font-bold text-primary group-hover:scale-110 transition-transform duration-300">
              {globalData.activeCryptos.toLocaleString()}
            </div>
          </Card>
        </motion.div>
      </Card>
    </motion.div>
  );
}
