"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CoinCombobox, CryptoComboBox } from "./coin-combobox";
import { useAllCryptos } from "../hooks/useAllCryptos";
import { fetchCryptoPrices } from "../data/allCoinPrices";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

type ChartData = {
  date: string;
  price: string;
};

export function CryptoChart() {
  const { data: cryptos, isLoading, isError } = useAllCryptos();
  const [value, setValue] = useState<string>("");
  const [formattedPrice, setFormattedPrice] = useState("");
  const [priceChange, setPriceChange] = useState<number>(0);

  const [selectedPeriod, setSelectedPeriod] = useState("7D");
  const [comboBoxCoins, setComboBoxCoins] = useState<CryptoComboBox[]>([]);
  const selectedCoin = comboBoxCoins?.find((coin) => coin.value === value);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // each time the data array from the useAllCryptos hook is updated,
  //format the data and get only the propreties that we need, and
  //then update the comboBoxCoins

  useEffect(() => {
    if (cryptos) {
      const formattedData: CryptoComboBox[] = (cryptos as unknown[])
        .map((crypto: unknown) => {
          if (
            typeof crypto === "object" &&
            crypto !== null &&
            "id" in crypto &&
            "symbol" in crypto &&
            "name" in crypto &&
            "current_price" in crypto &&
            "image" in crypto &&
            "price_change_percentage_24h" in crypto
          ) {
            return {
              value: crypto.id as string,
              label: crypto.name as string,
              icon: crypto.image as string,
              price: String(crypto.current_price),
              change: (crypto.price_change_percentage_24h as number).toFixed(2),
            };
          } else {
            throw new Error("Invalid API response structure.");
          }
        });

      setComboBoxCoins(formattedData);
    }
  }, [cryptos]);

  useEffect(() => {
    if (value) {
      async function fetchPrices() {
        try {
          const data = await fetchCryptoPrices(value);
          const prices = data.prices;
          
          // Filter data based on the selected period
          let filteredPrices: [number, number][] = [];
          const now = Date.now();
          const oneDayMs = 24 * 60 * 60 * 1000;
          
          switch (selectedPeriod) {
            case "1D":
              filteredPrices = prices.filter(([timestamp]) => 
                now - timestamp < oneDayMs
              );
              break;
            case "7D":
              filteredPrices = prices.filter(([timestamp]) => 
                now - timestamp < 7 * oneDayMs
              );
              break;
            case "30D":
              filteredPrices = prices.filter(([timestamp]) => 
                now - timestamp < 30 * oneDayMs
              );
              break;
            case "1Y":
              filteredPrices = prices.filter(([timestamp]) => 
                now - timestamp < 365 * oneDayMs
              );
              break;
            default:
              filteredPrices = prices;
          }
          
          const formattedData: ChartData[] = filteredPrices.map(([timestamp, price]) => {
            return {
              date: new Date(timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              price: price.toFixed(2),
            };
          });

          setChartData(formattedData);
          
          // Calculate price change percentage
          if (formattedData.length > 1) {
            const firstPrice = parseFloat(formattedData[0].price);
            const lastPrice = parseFloat(formattedData[formattedData.length - 1].price);
            const change = ((lastPrice - firstPrice) / firstPrice) * 100;
            setPriceChange(change);
          }
          
          if (selectedCoin) {
            const numericPrice = parseFloat(selectedCoin.price);
            setFormattedPrice(
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(numericPrice)
            );
          }
        } catch (error) {
          console.error("Error fetching prices:", error);
        }
      }

      fetchPrices();
    }
  }, [value, selectedPeriod, selectedCoin]);

  useEffect(() => {
    const fetchData = async () => {
      if (cryptos && cryptos.length > 0) {
        const firstCrypto = cryptos[0];
        if (
          typeof firstCrypto === "object" &&
          firstCrypto !== null &&
          "id" in firstCrypto
        ) {
          setValue(firstCrypto.id as string);
        }
      }
    };

    fetchData();
  }, [cryptos]);

  function onChangeToggleGroup(item: string) {
    setSelectedPeriod(item);
  }

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
      <Card className="col-span-3 rounded-xl shadow-sm overflow-hidden border-none bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-3 rounded-xl shadow-sm overflow-hidden border-none bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Error loading chart data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-center">
            There was an error loading the chart data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="col-span-3"
    >
      <Card className="rounded-xl shadow-sm overflow-hidden border-none bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                {selectedCoin?.label || "Select a cryptocurrency"}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  {formattedPrice || "Price will appear here"}
                </p>
                {chartData.length > 1 && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {priceChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(priceChange).toFixed(2)}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <CoinCombobox
                coins={comboBoxCoins}
                isLoading={isLoading}
                isError={isError}
                value={value}
                setValue={setValue}
              />
              <ToggleGroup
                type="single"
                value={selectedPeriod}
                onValueChange={onChangeToggleGroup}
                className="justify-start bg-muted/50 p-1 rounded-lg"
              >
                <ToggleGroupItem value="1D" aria-label="1 day" className="data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm">
                  1D
                </ToggleGroupItem>
                <ToggleGroupItem value="7D" aria-label="7 days" className="data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm">
                  7D
                </ToggleGroupItem>
                <ToggleGroupItem value="30D" aria-label="30 days" className="data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm">
                  30D
                </ToggleGroupItem>
                <ToggleGroupItem value="1Y" aria-label="1 year" className="data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm">
                  1Y
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="h-[300px] w-full"
            variants={itemVariants}
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    activeDot={{ r: 6, fill: "var(--primary)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
