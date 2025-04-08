"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
// import { Separator } from "@/components/ui/separator";

import { BiCategory } from "react-icons/bi";
import { useAllCategories } from "../hooks/useAllCategories";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useExchanges } from "../hooks/useAllExchanges";
import { Exchange } from "../data/exchanges";
import { IoStorefrontOutline } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";

type Category = { name: string }; // Define type for category

// Type guard to check if an object is a Category
function isCategory(category: unknown): category is Category {
  return (
    typeof category === "object" &&
    category !== null &&
    "name" in category &&
    typeof (category as Category).name === "string"
  );
}

export function MarketHighlights() {
  const {
    data: allCategoriesData,
    isLoading: isCategoryLoading,
  } = useAllCategories();

  const {
    data: allExchanges,
    isLoading: isExchangesLoading,
  } = useExchanges();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [totalPairs, setTotalPairs] = useState<number | null>(null);

  //This use effect fetch the all categories data
  useEffect(() => {
    if (allCategoriesData) {
      const formattedData = allCategoriesData
        .slice(0, 3)
        .map((category: unknown) => {
          if (isCategory(category)) {
            return { name: category.name };
          }

          return null;
        })
        .filter((item): item is Category => item !== null);
      setCategories(formattedData);
    }
  }, [allCategoriesData]);
  // This useEffect fetches the exchanges data
  useEffect(() => {
    if (allExchanges && Array.isArray(allExchanges)) {
      const totalPairs = (allExchanges as Exchange[]).reduce(
        (sum: number, exchange) => sum + exchange.trade_volume_24h_btc,
        0
      );

      setTotalPairs(totalPairs); // Save total pairs in state
    }
  }, [allExchanges]);

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

  // Fallback category data
  const fallbackCategories: Category[] = [
    { name: "DeFi" },
    { name: "NFT" },
    { name: "Metaverse" }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="p-6 space-y-6 rounded-xl shadow-sm overflow-hidden border-none bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Market Highlights</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary/50 to-primary rounded-full"></div>
        </div>

        {/* Show Categories - With Fallback */}
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          {isCategoryLoading ? (
            <Skeleton className="w-full h-28 rounded-xl" />
          ) : (
            <CryptoCategories categories={categories || fallbackCategories} />
          )}
        </motion.div>

        {/* Show Market Pairs - With Fallback */}
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          {isExchangesLoading ? (
            <Skeleton className="w-full h-11 rounded-xl" />
          ) : (
            <MarketPaires totalPairs={totalPairs || 1800000} />
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}

function MarketPaires({ totalPairs }: { totalPairs: number | null }) {
  const formattedNumber = (num: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);

  return (
    <Card className="p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 border-none bg-gradient-to-br from-background to-background/80 group">
      <div className="flex items-center gap-3">
        <div className="bg-primary/15 size-10 flex items-center justify-center text-primary rounded-full group-hover:bg-primary/20 transition-colors duration-300">
          <IoStorefrontOutline className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium">Market Pairs</p>
          <p className="text-xs text-muted-foreground">Total trading pairs across exchanges</p>
        </div>
      </div>
      <div className="text-lg font-bold text-primary group-hover:scale-110 transition-transform duration-300">
        {formattedNumber(totalPairs || 0)}
      </div>
    </Card>
  );
}

function CryptoCategories({ categories }: { categories: Category[] }) {
  return (
    <Card className="p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 border-none bg-gradient-to-br from-background to-background/80">
      <div className="flex items-center gap-3">
        <div className="bg-primary/15 size-10 flex items-center justify-center text-primary rounded-full">
          <BiCategory className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium">Top Categories</p>
          <p className="text-xs text-muted-foreground">Most popular cryptocurrency categories</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-1">
        {categories.map((category, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors duration-300"
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
