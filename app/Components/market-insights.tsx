"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketInsights } from "../hooks/useMarketInsights";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Hash, 
  Users, 
  ArrowDown, 
  ArrowUp, 
  MessageCircle, 
  ThumbsUp, 
  PieChart, 
  Activity, 
  BarChart,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the type for insight with unit property
type InsightWithUnit = {
  id: string;
  title: string;
  description: string;
  value: number;
  change: number;
  changeDirection: "up" | "down" | "neutral";
  category: "onChain" | "market" | "social" | "technical";
  icon: string;
  timestamp: string;
  unit?: string;
};

export function MarketInsights() {
  const { data: insightsData, isLoading, error } = useMarketInsights();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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

  // Update last updated timestamp when data changes
  useEffect(() => {
    if (insightsData) {
      setLastUpdated(new Date());
    }
  }, [insightsData]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "hash":
        return <Hash className="h-5 w-5" />;
      case "users":
        return <Users className="h-5 w-5" />;
      case "arrow-down":
        return <ArrowDown className="h-5 w-5" />;
      case "arrow-up":
        return <ArrowUp className="h-5 w-5" />;
      case "message-circle":
        return <MessageCircle className="h-5 w-5" />;
      case "thumbs-up":
        return <ThumbsUp className="h-5 w-5" />;
      case "pie-chart":
        return <PieChart className="h-5 w-5" />;
      case "activity":
        return <Activity className="h-5 w-5" />;
      case "bar-chart":
        return <BarChart className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getChangeIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getChangeColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "onChain":
        return "bg-blue-500/10 text-blue-500";
      case "market":
        return "bg-purple-500/10 text-purple-500";
      case "social":
        return "bg-green-500/10 text-green-500";
      case "technical":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const formatValue = (value: number, unit?: string) => {
    if (unit === "mentions" || unit === "addresses") {
      return `${value.toLocaleString()} ${unit}`;
    } else if (unit === "score") {
      return value.toFixed(2);
    } else if (unit === "%") {
      return `${value.toFixed(1)}%`;
    } else if (unit === "EH/s" || unit === "T") {
      return `${value.toLocaleString()} ${unit}`;
    } else if (unit === "BTC") {
      return `${value.toLocaleString()} ${unit}`;
    } else {
      return value.toLocaleString();
    }
  };

  const filteredInsights = insightsData?.insights.filter(
    (insight) => activeCategory === "all" || insight.category === activeCategory
  ) || [];

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Market Insights</h2>
          <div className="text-xs text-muted-foreground">
            Loading data...
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Key metrics and on-chain data for cryptocurrency markets
        </p>
        
        <Skeleton className="h-10 w-full mb-6" />
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {"123456".split("").map((_, key) => (
            <motion.div key={key} variants={itemVariants}>
              <Skeleton className="h-[180px] rounded-xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 m-5 bg-destructive/10 border-destructive/20">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h3 className="text-lg font-semibold text-destructive">Error Loading Market Insights</h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </Card>
    );
  }

  if (!insightsData || insightsData.insights.length === 0) {
    return (
      <Card className="p-6 m-5">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h3 className="text-lg font-semibold">No Market Insights Available</h3>
          <p className="text-sm text-muted-foreground">Please check back later for market insights.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Market Insights</h2>
        <div className="text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Key metrics and on-chain data for cryptocurrency markets
      </p>
      
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="onChain">On-Chain</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {filteredInsights.map((insight) => {
          // Cast insight to our extended type that includes the unit property
          const insightWithUnit = insight as InsightWithUnit;
          
          return (
            <motion.div
              key={insight.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                transition: { duration: 0.2 } 
              }}
            >
              <Card className="p-4 overflow-hidden relative rounded-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm group">
                <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[2px] z-0"></div>
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-md ${getCategoryColor(insight.category)}`}>
                    {getIcon(insight.icon)}
                    <span className="text-xs font-medium capitalize">{insight.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-1 relative z-10 group-hover:text-primary transition-colors">
                  {insight.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 relative z-10">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="text-2xl font-bold">
                    {formatValue(insight.value, insightWithUnit.unit)}
                  </div>
                  
                  <div className={`flex items-center gap-1 ${getChangeColor(insight.changeDirection)}`}>
                    {getChangeIcon(insight.changeDirection)}
                    <span className="text-sm font-medium">
                      {insight.change > 0 ? "+" : ""}{insight.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
} 