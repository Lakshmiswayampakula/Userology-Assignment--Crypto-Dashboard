"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSound } from "@/components/sound-provider";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink } from "lucide-react";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface NewsDataResponse {
  results: Array<{
    title: string;
    link: string;
    source_id: string;
    pubDate: string;
  }>;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSound } = useSound();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using NewsData.io API
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=pub_78691416757669690261122edab23d709a382&q=cryptocurrency&language=en`
        );
        const data = (await response.json()) as NewsDataResponse;
        
        // Transform the data to match our interface
        const transformedNews = data.results.slice(0, 5).map((item) => ({
          title: item.title,
          url: item.link,
          source: item.source_id,
          publishedAt: item.pubDate,
        }));
        
        setNews(transformedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading latest news...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 border-b pb-4 sm:pb-6">
        <Newspaper className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Latest Crypto News
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Stay updated with the latest cryptocurrency news and market insights
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {news.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group-hover:text-primary transition-colors"
                    onClick={playSound}
                  >
                    <span className="line-clamp-2 sm:line-clamp-none">{item.title}</span>
                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 text-sm">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium w-fit">
                    {item.source}
                  </span>
                  <time className="text-muted-foreground" dateTime={item.publishedAt}>
                    {new Date(item.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 