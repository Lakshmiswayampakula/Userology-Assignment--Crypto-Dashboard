"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSound } from "@/components/sound-provider";
import { motion } from "framer-motion";
import { TrendingUp, Activity, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Types
type WeatherHistory = {
  date: string;
  temperature: number;
  humidity: number;
  conditions?: string;
};

type CryptoHistory = {
  date: string;
  price: number;
  volume: number;
  marketCap: number;
};

interface WeatherData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather?: {
    main: string;
  }[];
}

interface WeatherResponse {
  list: WeatherData[];
}

export default function DetailsPage() {
  // State for weather data
  const [weatherHistory, setWeatherHistory] = useState<WeatherHistory[]>([]);
  const [selectedCity, setSelectedCity] = useState("London");
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const { playSound } = useSound();

  // State for crypto data
  const [cryptoHistory, setCryptoHistory] = useState<CryptoHistory[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [loadingCrypto, setLoadingCrypto] = useState(true);

  const fetchWeatherHistory = async () => {
    try {
      setLoadingWeather(true);
      setWeatherError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Weather API Error: ${errorData.message || 'Failed to fetch weather data'}`);
      }
      
      const data = (await response.json()) as WeatherResponse;

      const history = data.list.map((item: WeatherData) => ({
        date: new Date(item.dt * 1000).toLocaleDateString(),
        temperature: Math.round(item.main.temp),
        humidity: item.main.humidity,
        conditions: item.weather?.[0]?.main,
      }));

      setWeatherHistory(history);
    } catch (error) {
      console.error("Error fetching weather history:", error);
      setWeatherError(error instanceof Error ? error.message : 'Failed to load weather data');
    } finally {
      setLoadingWeather(false);
    }
  };

  // Use fetchWeatherHistory in useEffect
  useEffect(() => {
    fetchWeatherHistory();
  }, [selectedCity]);

  // Fetch crypto history
  useEffect(() => {
    const fetchCryptoHistory = async () => {
      try {
        setLoadingCrypto(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart?vs_currency=usd&days=30&interval=daily`
        );
        const data = await response.json();

        const history = data.prices.map(([timestamp, price]: [number, number], index: number) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price,
          volume: data.total_volumes[index][1],
          marketCap: data.market_caps[index][1],
        }));

        setCryptoHistory(history);
      } catch (error) {
        console.error("Error fetching crypto history:", error);
      } finally {
        setLoadingCrypto(false);
      }
    };

    fetchCryptoHistory();
  }, [selectedCrypto]);

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 border-b pb-3 sm:pb-4">
        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Detailed Analysis
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            In-depth weather and cryptocurrency data analysis
          </p>
        </div>
      </div>

      <Tabs defaultValue="weather" className="space-y-3 sm:space-y-4" onValueChange={playSound}>
        <TabsList className="grid w-full max-w-sm grid-cols-2 mx-auto">
          <TabsTrigger value="weather" className="text-sm">Weather Analysis</TabsTrigger>
          <TabsTrigger value="crypto" className="text-sm">Crypto Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="weather" className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Weather History</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Temperature and humidity trends</p>
            </div>
            <Select 
              value={selectedCity} 
              onValueChange={(value) => {
                playSound();
                setSelectedCity(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="London">London</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Tokyo">Tokyo</SelectItem>
                <SelectItem value="Paris">Paris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader className="p-2 sm:p-3 md:p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <div>
                      <CardTitle className="text-sm sm:text-base">Temperature Trend</CardTitle>
                      <CardDescription className="text-xs">
                        Temperature variation over the next 24 hours
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-4">
                  <div className="h-[160px] sm:h-[200px] md:h-[250px] w-full">
                    {loadingWeather ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="w-full h-full" />
                      </div>
                    ) : weatherError ? (
                      <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                        <p className="text-red-500 text-sm">{weatherError}</p>
                        <button 
                          onClick={() => fetchWeatherHistory()}
                          className="text-xs px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={weatherHistory}
                          margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 8 }}
                            interval="preserveStartEnd"
                            height={30}
                          />
                          <YAxis 
                            tick={{ fontSize: 8 }}
                            width={25}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              borderRadius: '6px',
                              border: 'none',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              fontSize: '11px',
                              padding: '4px 8px'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="hsl(var(--primary))"
                            strokeWidth={1.5}
                            dot={{ fill: "hsl(var(--primary))", r: 2 }}
                            name="Temperature (°C)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader className="p-2 sm:p-3 md:p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <div>
                      <CardTitle className="text-sm sm:text-base">Weather Data Table</CardTitle>
                      <CardDescription className="text-xs">
                        Detailed weather information by date
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-2">
                  {loadingWeather ? (
                    <Skeleton className="w-full h-[200px] sm:h-[250px]" />
                  ) : (
                    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                      <table className="w-full divide-y divide-border text-xs sm:text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th scope="col" className="px-2 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-2 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">
                              Temp
                            </th>
                            <th scope="col" className="px-2 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">
                              Humid
                            </th>
                            <th scope="col" className="px-2 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">
                              Cond
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                          {weatherHistory.slice(0, 5).map((item, index) => (
                            <tr 
                              key={index} 
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-2 py-2 whitespace-nowrap">
                                {item.date}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap">
                                {item.temperature}°C
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap">
                                {item.humidity}%
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap">
                                {item.conditions || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Cryptocurrency History</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Price and volume trends</p>
            </div>
            <Select 
              value={selectedCrypto} 
              onValueChange={(value) => {
                playSound();
                setSelectedCrypto(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Select crypto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="dogecoin">Dogecoin</SelectItem>
                <SelectItem value="ripple">Ripple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader className="p-2 sm:p-3 md:p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <div>
                      <CardTitle className="text-sm sm:text-base">Price Trend</CardTitle>
                      <CardDescription className="text-xs">
                        Price variation over the last 30 days
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-4">
                  <div className="h-[160px] sm:h-[200px] md:h-[250px] w-full">
                    {loadingCrypto ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="w-full h-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                          data={cryptoHistory}
                          margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 8 }}
                            interval="preserveStartEnd"
                            height={30}
                          />
                          <YAxis 
                            tick={{ fontSize: 8 }}
                            width={45}
                            tickFormatter={(value) => `$${value.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              borderRadius: '6px',
                              border: 'none',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              fontSize: '11px',
                              padding: '4px 8px'
                            }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary)/0.2)"
                            strokeWidth={1.5}
                            name="Price (USD)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader className="p-2 sm:p-3 md:p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <div>
                      <CardTitle className="text-sm sm:text-base">Crypto Data Table</CardTitle>
                      <CardDescription className="text-xs">
                        Detailed cryptocurrency information by date
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-2">
                  {loadingCrypto ? (
                    <Skeleton className="w-full h-[200px] sm:h-[250px]" />
                  ) : (
                    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                      <table className="w-full divide-y divide-border text-xs sm:text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th scope="col" className="px-2 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-2 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-2 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">
                              Vol
                            </th>
                            <th scope="col" className="px-2 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">
                              MCap
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                          {cryptoHistory.slice(0, 5).map((item, index) => (
                            <tr 
                              key={index} 
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-2 py-2 whitespace-nowrap">
                                {item.date}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap">
                                ${item.price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap">
                                ${(item.volume / 1e6).toFixed(1)}M
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap">
                                ${(item.marketCap / 1e9).toFixed(1)}B
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 