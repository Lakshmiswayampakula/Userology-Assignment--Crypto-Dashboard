"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllCryptos } from "../hooks/useAllCryptos";
import { useEffect, useState } from "react";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export type PriceCardsData = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: string;
  changeDirection: string;
  icon: React.ReactNode;
  bgColor: string;
};

export function PriceCards() {
  const { data: cryptocurrencies, isLoading } = useAllCryptos();
  const [threeTopCurrencies, setThreeTopCurrencies] = useState<
    PriceCardsData[]
  >([]);

  useEffect(() => {
    if (cryptocurrencies) {
      try {
        // Validate the structure at runtime
        const formatData: PriceCardsData[] = (cryptocurrencies as unknown[])
          .slice(0, 3)
          .map((coin) => {
            if (
              typeof coin === "object" &&
              coin !== null &&
              "id" in coin &&
              "symbol" in coin &&
              "current_price" in coin &&
              "name" in coin &&
              "price_change_percentage_24h" in coin
            ) {
              return {
                id: coin.id as string,
                symbol: coin.symbol as string,
                price: coin.current_price as number,
                name: coin.name as string,
                change: `${(coin.price_change_percentage_24h as number).toFixed(
                  2
                )}%`,
                changeDirection:
                  (coin.price_change_percentage_24h as number) >= 0
                    ? "up"
                    : "down",
                icon:
                  coin.id === "bitcoin" ? (
                    <BsCurrencyBitcoin className="text-orange-600 text-xl" />
                  ) : coin.id === "ethereum" ? (
                    <FaEthereum className="text-blue-600 text-xl" />
                  ) : (
                    <SiTether className="text-gray-600 text-xl" />
                  ),
                bgColor:
                  coin.id === "bitcoin"
                    ? "bg-gradient-to-br from-orange-100 to-orange-50"
                    : coin.id === "ethereum"
                    ? "bg-gradient-to-br from-blue-100 to-blue-50"
                    : "bg-gradient-to-br from-gray-100 to-gray-50",
              };
            } else {
              throw new Error("Invalid API response structure.");
            }
          });

        setThreeTopCurrencies(formatData);
      } catch (error) {
        console.error("Error processing data:", error);
      }
    }
  }, [cryptocurrencies]);

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
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-5 pt-5 gap-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {"123".split("").map((_, key) => (
          <motion.div key={key} variants={itemVariants}>
            <Skeleton className="h-[85px] rounded-xl" />
          </motion.div>
        ))}
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {threeTopCurrencies?.map((crypto: PriceCardsData, index: number) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02, 
            transition: { duration: 0.2 } 
          }}
        >
          <Card
            className="shadow-sm border-none overflow-hidden relative rounded-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm group p-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[2px] z-0"></div>
            <div className="relative z-10 p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center ${crypto.bgColor} rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300`}
                >
                  {crypto.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {crypto.name}
                  </p>
                  <p className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short"
                    }).format(crypto.price)}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-1 flex-shrink-0 ${
                  crypto.changeDirection === "up"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {crypto.changeDirection === "down" ? (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{crypto.change}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
