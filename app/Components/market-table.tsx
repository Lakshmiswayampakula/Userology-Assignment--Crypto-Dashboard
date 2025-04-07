import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useAllCryptos } from "../hooks/useAllCryptos";

import { allCryptosSchema, allCryptosType } from "../data/allCryptos";

import Image from "next/image";
import CryptoTableDialog from "./crypto-dialog/crypto-dialog";
import { TrendingUp } from "lucide-react";

interface TopCurrencies {
  name: string;
  price: string;
  change: string;
  volume: string;
  marketRank: number;
  isPositive: boolean;
  icon: string;
}

export function MarketTable() {
  const { data: allCoinsData, isLoading, isError } = useAllCryptos();

  const [topFiveCurrencies, setTopFiveCurrencies] = useState<TopCurrencies[]>(
    []
  );

  const [allCoins, setAllCoins] = useState<allCryptosType>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        if (allCoinsData) {
          const validateSchema = allCryptosSchema.parse(allCoinsData);

          const mappedData: TopCurrencies[] = validateSchema
            .slice(0, 5)
            .map((coin) => ({
              name: coin.name,
              price: `$${coin.current_price.toLocaleString()}`,
              change: `${coin.price_change_percentage_24h.toFixed(2)}%`,
              volume: `$${coin.total_volume.toLocaleString()}`,
              marketRank: coin.market_cap_rank,
              isPositive: coin.price_change_percentage_24h >= 0,
              icon: coin.image,
            }));
          // Update state with the parsed data
          setAllCoins(validateSchema); // Matches `allCryptosType` directly
          setTopFiveCurrencies(mappedData);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };
    fetchMarketData();
  }, [allCoinsData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="space-y-4 p-6 mx-5 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Market Value</h2>
            <p className="text-xs text-muted-foreground mt-1">Top 5 Cryptocurrencies by Market Cap</p>
          </div>
          {/* crypto dialog */}
          <div className="mt-4 sm:mt-0">
            <CryptoTableDialog allCoins={allCoins} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium text-muted-foreground">Name</TableHead>
                <TableHead className="font-medium text-muted-foreground">Price</TableHead>
                <TableHead className="font-medium text-muted-foreground">Change</TableHead>
                <TableHead className="font-medium text-muted-foreground">Volume</TableHead>
                <TableHead className="font-medium text-muted-foreground text-center">Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">
                    Failed to fetch market data
                  </TableCell>
                </TableRow>
              )}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="h-9 w-full mb-2" />
                    ))}
                  </TableCell>
                </TableRow>
              ) : (
                topFiveCurrencies.map((item, index) => (
                  <motion.tr
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell className="flex items-center gap-3 py-4">
                      <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-background to-background/80 shadow-sm group-hover:shadow-md transition-all duration-200">
                        {item && (
                          <Image
                            src={item.icon}
                            alt={`${item.name} icon`}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        )}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </TableCell>
                    <TableCell className="font-medium">{item.price}</TableCell>
                    <TableCell
                      className={
                        item.isPositive
                          ? "text-green-500 font-medium"
                          : "text-red-500 font-medium"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {item.isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingUp className="h-4 w-4 rotate-180" />
                        )}
                        {item.change}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono">
                      {item.volume}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted text-xs font-medium">
                        {item.marketRank}
                      </span>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
}
