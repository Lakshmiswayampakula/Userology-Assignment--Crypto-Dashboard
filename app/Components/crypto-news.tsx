"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCryptoNews } from "../hooks/useCryptoNews";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Minus, ExternalLink, Clock } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export function CryptoNews() {
  const { data: newsData, isLoading, error } = useCryptoNews();

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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {"123456".split("").map((_, key) => (
          <motion.div key={key} variants={itemVariants}>
            <Skeleton className="h-[300px] rounded-xl" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 m-5 bg-destructive/10 border-destructive/20">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h3 className="text-lg font-semibold text-destructive">Error Loading News</h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </Card>
    );
  }

  if (!newsData || newsData.articles.length === 0) {
    return (
      <Card className="p-6 m-5">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h3 className="text-lg font-semibold">No News Available</h3>
          <p className="text-sm text-muted-foreground">Please check back later for the latest cryptocurrency news.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Cryptocurrency News</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Latest news from the cryptocurrency world with sentiment analysis
      </p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {newsData.articles.map((article) => (
          <motion.div
            key={article.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02, 
              transition: { duration: 0.2 } 
            }}
          >
            <Card className="overflow-hidden relative rounded-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm group h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[2px] z-0"></div>
              
              <div className="relative z-10 h-40 overflow-hidden">
                {article.imageUrl ? (
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title} 
                    width={500} 
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-bold text-muted-foreground">{article.category}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                  <span className="text-xs font-medium">{article.category}</span>
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-grow relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{article.source}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 ${getSentimentColor(article.sentiment)}`}>
                      {getSentimentIcon(article.sentiment)}
                      <span className="text-xs font-medium capitalize">{article.sentiment}</span>
                    </div>
                    <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          article.sentiment === "positive" 
                            ? "bg-green-500" 
                            : article.sentiment === "negative" 
                              ? "bg-red-500" 
                              : "bg-yellow-500"
                        }`}
                        style={{ 
                          width: `${Math.abs(article.sentimentScore * 100)}%`,
                          marginLeft: article.sentimentScore < 0 ? "auto" : "0"
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Read More
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 