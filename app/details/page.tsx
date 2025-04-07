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
  const { playSound } = useSound();

  // State for crypto data
  const [cryptoHistory, setCryptoHistory] = useState<CryptoHistory[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [loadingCrypto, setLoadingCrypto] = useState(true);

  // Fetch weather history
  useEffect(() => {
    const fetchWeatherHistory = async () => {
      try {
        setLoadingWeather(true);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
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
      } finally {
        setLoadingWeather(false);
      }
    };

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
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 border-b pb-4 sm:pb-6">
        <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Detailed Analysis
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            In-depth weather and cryptocurrency data analysis
          </p>
        </div>
      </div>

      <Tabs defaultValue="weather" className="space-y-4 sm:space-y-6" onValueChange={playSound}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
          <TabsTrigger value="weather" className="text-sm sm:text-base">Weather Analysis</TabsTrigger>
          <TabsTrigger value="crypto" className="text-sm sm:text-base">Crypto Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="weather" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Weather History</h2>
              <p className="text-sm text-muted-foreground">Temperature and humidity trends</p>
            </div>
            <Select 
              value={selectedCity} 
              onValueChange={(value) => {
                playSound();
                setSelectedCity(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
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

          <div className="grid gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Temperature Trend</CardTitle>
                      <CardDescription className="text-sm">
                        Temperature variation over the next 24 hours
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-[200px] sm:h-[250px] md:h-[350px]">
                    {loadingWeather ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="w-full h-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weatherHistory}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis 
                            tick={{ fontSize: 10 }}
                            width={30}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                              fontSize: '12px'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))", r: 3 }}
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
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Weather Data Table</CardTitle>
                      <CardDescription className="text-sm">
                        Detailed weather information by date
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {loadingWeather ? (
                    <Skeleton className="w-full h-[300px]" />
                  ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                              <tr>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Temperature
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Humidity
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Conditions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-background divide-y divide-border">
                              {weatherHistory.map((item, index) => (
                                <tr 
                                  key={index} 
                                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                                  onClick={playSound}
                                >
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    {item.date}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    {item.temperature}°C
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    {item.humidity}%
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    {item.conditions || 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Cryptocurrency History</h2>
              <p className="text-sm text-muted-foreground">Price and volume trends</p>
            </div>
            <Select 
              value={selectedCrypto} 
              onValueChange={(value) => {
                playSound();
                setSelectedCrypto(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="dogecoin">Dogecoin</SelectItem>
                <SelectItem value="ripple">Ripple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Price Trend</CardTitle>
                      <CardDescription className="text-sm">
                        Price variation over the last 30 days
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-[200px] sm:h-[250px] md:h-[350px]">
                    {loadingCrypto ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="w-full h-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cryptoHistory}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis 
                            tick={{ fontSize: 10 }}
                            width={40}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                              fontSize: '12px'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary)/0.2)"
                            strokeWidth={2}
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
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Crypto Data Table</CardTitle>
                      <CardDescription className="text-sm">
                        Detailed cryptocurrency information by date
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {loadingCrypto ? (
                    <Skeleton className="w-full h-[300px]" />
                  ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                              <tr>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Price
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Volume
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Market Cap
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-background divide-y divide-border">
                              {cryptoHistory.map((item, index) => (
                                <tr 
                                  key={index} 
                                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                                  onClick={playSound}
                                >
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    {item.date}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    ${item.price.toLocaleString()}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    ${item.volume.toLocaleString()}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    ${item.marketCap.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
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