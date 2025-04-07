"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrendingCryptos } from "../hooks/useTrendingCryptos";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";

export function TrendingCryptos() {
  const { data: trendingData, isLoading, error } = useTrendingCryptos();

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

  if (isLoading) {
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {"123456".split("").map((_, key) => (
          <motion.div key={key} variants={itemVariants}>
            <Skeleton className="h-[120px] rounded-xl" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 m-5 bg-destructive/10 border-destructive/20">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h3 className="text-lg font-semibold text-destructive">Error Loading Trending Data</h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </Card>
    );
  }

  if (!trendingData || trendingData.coins.length === 0) {
    return (
      <Card className="p-6 m-5">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h3 className="text-lg font-semibold">No Trending Data Available</h3>
          <p className="text-sm text-muted-foreground">Please check back later for trending cryptocurrencies.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Trending Cryptocurrencies</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Top trending cryptocurrencies based on social media activity and market performance
      </p>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {trendingData.coins.map((coin) => (
          <motion.div
            key={coin.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02, 
              transition: { duration: 0.2 } 
            }}
          >
            <Card className="p-4 overflow-hidden relative rounded-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm group">
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[2px] z-0"></div>
              
              <div className="flex items-center gap-3 relative z-10 mb-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {coin.image ? (
                    <Image 
                      src={coin.image} 
                      alt={coin.name} 
                      width={40} 
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold">{coin.symbol.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{coin.name}</h3>
                  <p className="text-xs text-muted-foreground">#{coin.market_cap_rank} by market cap</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Price Change (24h)</p>
                  <div className={`flex items-center gap-1 ${
                    coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {coin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Social Sentiment</p>
                  <div className={`flex items-center gap-1 ${
                    coin.sentiment_score >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {coin.sentiment_score >= 0 ? (
                      <ThumbsUp className="h-4 w-4" />
                    ) : (
                      <ThumbsDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {(coin.sentiment_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Social Volume</p>
                  <div className="flex items-center gap-1 text-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {coin.social_volume.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Market Cap Change</p>
                  <div className={`flex items-center gap-1 ${
                    coin.market_cap_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {coin.market_cap_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {coin.market_cap_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border/50 relative z-10">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Trending Score</p>
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${Math.min(coin.score * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 