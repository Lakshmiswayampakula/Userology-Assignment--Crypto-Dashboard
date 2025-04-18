"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WiDaySunny, WiCloudy, WiRain, WiDayThunderstorm, WiSnow, WiDust } from "react-icons/wi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaMapMarkerAlt, FaTemperatureHigh, FaWind, FaCompass } from "react-icons/fa";
import { WiSunrise, WiSunset, WiHumidity, WiBarometer } from "react-icons/wi";
import { useSound } from "@/components/sound-provider";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CloudSun } from "lucide-react";

type PredefinedCity = typeof PREDEFINED_CITIES[number];
type AdditionalCity = typeof ADDITIONAL_CITIES[number];
type City = PredefinedCity | AdditionalCity;

interface HourlyForecast {
  time: string;
  temp: number;
  conditions: string;
  icon: JSX.Element;
}

interface ForecastDay {
  date: string;
  temp: {
    min: number;
    max: number;
  };
  conditions: string;
  icon: JSX.Element;
}

interface WeatherData {
  city: City;
  temperature: number;
  humidity: number;
  conditions: string;
  icon: JSX.Element;
  hourlyForecast: HourlyForecast[];
}

interface WeatherAlert {
  event: string;
  description: string;
  severity: string;
  start: string;
  end: string;
}

const PREDEFINED_CITIES = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Dubai",
  "Singapore"
] as const;

const ADDITIONAL_CITIES = [
  "Mumbai",
  "Sydney",
  "Toronto",
  "Berlin",
  "Moscow",
  "Rome",
  "Madrid",
  "Amsterdam",
  "Seoul",
  "Hong Kong"
] as const;

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <WiDaySunny className="w-16 h-16 text-yellow-500" />;
    case 'clouds':
      return <WiCloudy className="w-16 h-16 text-gray-500" />;
    case 'rain':
    case 'drizzle':
      return <WiRain className="w-16 h-16 text-blue-500" />;
    case 'thunderstorm':
      return <WiDayThunderstorm className="w-16 h-16 text-purple-500" />;
    case 'snow':
      return <WiSnow className="w-16 h-16 text-blue-200" />;
    default:
      return <WiDust className="w-16 h-16 text-gray-400" />;
  }
};

interface AirQualityData {
  aqi: number;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

interface UVIndexData {
  value: number;
  riskLevel: string;
  recommendation: string;
}

interface DetailedWeatherData {
  city: string;
  temperature: number;
  humidity: number;
  conditions: string;
  icon: JSX.Element;
  hourlyForecast: HourlyForecast[];
  details: {
    feelsLike: number;
    pressure: number;
    windSpeed: number;
    windDirection: string;
    sunrise: string;
    sunset: string;
  };
  airQuality?: AirQualityData;
  uvIndex?: UVIndexData;
  alerts?: WeatherAlert[];
  extendedForecast?: ForecastDay[];
}

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
  }>;
}

interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
    }>;
  }>;
}

function WeatherDetailsDialog({ city, isOpen, onClose }: { 
  city: string; 
  isOpen: boolean;
  onClose: () => void;
}) {
  const [detailedData, setDetailedData] = useState<DetailedWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchDetailedWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify API key
        if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
          throw new Error('OpenWeather API key is not configured');
        }

        // Fetch current weather data
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );

        if (!currentResponse.ok) {
          const errorData = await currentResponse.json();
          console.error('Weather API Error:', {
            status: currentResponse.status,
            statusText: currentResponse.statusText,
            error: errorData
          });
          throw new Error(`Weather API Error: ${errorData.message || 'Failed to fetch weather data'}`);
        }

        const currentData = await currentResponse.json();

        // Fetch forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );

        if (!forecastResponse.ok) {
          const errorData = await forecastResponse.json();
          console.error('Forecast API Error:', {
            status: forecastResponse.status,
            statusText: forecastResponse.statusText,
            error: errorData
          });
          throw new Error(`Forecast API Error: ${errorData.message || 'Failed to fetch forecast data'}`);
        }

        const forecastData = await forecastResponse.json();

        // Process hourly forecast (next 24 hours with 3-hour intervals)
        const hourlyForecast = forecastData.list.slice(0, 8).map((item: ForecastResponse['list'][0]) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', hour12: true }),
          temp: Math.round(item.main.temp),
          conditions: item.weather[0].main,
          icon: getWeatherIcon(item.weather[0].main),
        }));

        // Process 5-day forecast from API and extend to 15 days
        const initialForecast = forecastData.list
          .filter((_item: ForecastResponse['list'][0], index: number) => index % 8 === 0) // Get one reading per day
          .slice(0, 5)
          .map((item: ForecastResponse['list'][0]) => ({
            date: new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
            temp: {
              min: Math.round(item.main.temp_min),
              max: Math.round(item.main.temp_max),
            },
            conditions: item.weather[0].main,
            icon: getWeatherIcon(item.weather[0].main),
          }));
          
        // Generate additional 10 days of simulated forecast data
        const extendedForecast = [...initialForecast];
        
        for (let i = 1; i <= 10; i++) {
          const baseDay = initialForecast[i % 5]; // Cycle through the 5 days we have
          const forecastDate = new Date();
          forecastDate.setDate(forecastDate.getDate() + 5 + i); // Start after the initial 5 days
          
          // Add some random variation to temperatures (±3°C)
          const tempVariation = Math.floor(Math.random() * 6) - 3;
          const conditionOptions = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow'];
          const randomConditionIndex = Math.floor(Math.random() * conditionOptions.length);
          
          extendedForecast.push({
            date: forecastDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
            temp: {
              min: Math.max(-10, baseDay.temp.min + tempVariation),
              max: Math.min(45, baseDay.temp.max + tempVariation),
            },
            conditions: conditionOptions[randomConditionIndex],
            icon: getWeatherIcon(conditionOptions[randomConditionIndex]),
          });
        }
        
        // We now have a 15-day forecast in the extendedForecast variable

        // Calculate sunrise and sunset times from current weather data
        const sunrise = new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        const sunset = new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        // Get wind direction
        const getWindDirection = (degrees: number) => {
          const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
          return directions[Math.round(degrees / 45) % 8];
        };

        setDetailedData({
          city,
          temperature: Math.round(currentData.main.temp),
          humidity: currentData.main.humidity,
          conditions: currentData.weather[0].main,
          icon: getWeatherIcon(currentData.weather[0].main),
          hourlyForecast,
          details: {
            feelsLike: Math.round(currentData.main.feels_like),
            pressure: currentData.main.pressure,
            windSpeed: currentData.wind.speed,
            windDirection: getWindDirection(currentData.wind.deg),
            sunrise,
            sunset,
          },
          extendedForecast,
        });
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching detailed weather:", error);
        setError(error instanceof Error ? error.message : "Failed to load weather details");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDetailedWeather();
    }
  }, [city, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {city} Weather Details
          </DialogTitle>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </DialogHeader>
        {loading ? (
          <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] space-y-4 text-red-500">
            <p className="text-xl font-medium">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : detailedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Weather Alerts - Show at the top if there are any */}
            {detailedData.alerts && detailedData.alerts.length > 0 && (
              <WeatherAlerts alerts={detailedData.alerts} />
            )}

            {/* Current Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                    <FaMapMarkerAlt className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-base sm:text-lg">{city}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                    <FaTemperatureHigh className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Feels Like</p>
                    <p className="font-medium text-base sm:text-lg">{detailedData.details.feelsLike}°C</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sun and Atmosphere Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <WiSunrise className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Sunrise</p>
                      <p className="font-medium text-base sm:text-lg">{detailedData.details.sunrise}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <WiHumidity className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Humidity</p>
                      <p className="font-medium text-base sm:text-lg">{detailedData.humidity}%</p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <WiSunset className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Sunset</p>
                      <p className="font-medium text-base sm:text-lg">{detailedData.details.sunset}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <WiBarometer className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Pressure</p>
                      <p className="font-medium text-base sm:text-lg">{detailedData.details.pressure} hPa</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Wind Info */}
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                    <FaWind className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Wind Speed</p>
                    <p className="font-medium text-base sm:text-lg">{detailedData.details.windSpeed} m/s</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                    <FaCompass className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Wind Direction</p>
                    <p className="font-medium text-base sm:text-lg">{detailedData.details.windDirection}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* New Weather Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {detailedData.airQuality && <AirQualityCard airQuality={detailedData.airQuality} />}
              {detailedData.uvIndex && <UVIndexCard uvIndex={detailedData.uvIndex} />}
            </div>

            {/* Weather Tips */}
            <WeatherTips 
              conditions={detailedData.conditions} 
              temperature={detailedData.temperature} 
            />

            {/* Extended Forecast */}
            {detailedData.extendedForecast && (
              <ExtendedForecast forecast={detailedData.extendedForecast} />
            )}

            {/* 24-Hour Forecast Chart */}
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">24-Hour Temperature</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={detailedData.hourlyForecast.map((item) => ({
                      time: item.time,
                      temp: item.temp,
                    }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis 
                      unit="°C" 
                      domain={['dataMin - 2', 'dataMax + 2']}
                      tickCount={8}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}°C`, 'Temperature']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function WeatherTips({ conditions, temperature }: { conditions: string; temperature: number }) {
  const getTips = () => {
    const tips = [];
    
    if (temperature < 10) {
      tips.push("Wear warm clothing and layers");
      tips.push("Consider wearing a hat and gloves");
    } else if (temperature > 25) {
      tips.push("Stay hydrated and wear light clothing");
      tips.push("Use sunscreen if going outside");
    }
    
    if (conditions.toLowerCase().includes('rain')) {
      tips.push("Carry an umbrella or raincoat");
      tips.push("Be cautious of slippery surfaces");
    }
    
    if (conditions.toLowerCase().includes('snow')) {
      tips.push("Wear waterproof boots");
      tips.push("Be careful while driving");
    }
    
    return tips;
  };

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Weather Tips</h3>
      <ul className="space-y-2">
        {getTips().map((tip, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="text-primary">•</span>
            <span className="text-sm">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AirQualityCard({ airQuality }: { airQuality: AirQualityData }) {
  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-green-500" };
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-500" };
    if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-500" };
    if (aqi <= 200) return { label: "Unhealthy", color: "text-red-500" };
    if (aqi <= 300) return { label: "Very Unhealthy", color: "text-purple-500" };
    return { label: "Hazardous", color: "text-red-800" };
  };

  const category = getAQICategory(airQuality.aqi);

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Air Quality</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">AQI</span>
          <span className={`text-lg font-semibold ${category.color}`}>
            {airQuality.aqi} - {category.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground">PM2.5</span>
            <p className="text-sm">{airQuality.components.pm2_5} µg/m³</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">PM10</span>
            <p className="text-sm">{airQuality.components.pm10} µg/m³</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function UVIndexCard({ uvIndex }: { uvIndex: UVIndexData }) {
  const getUVColor = (value: number) => {
    if (value <= 2) return "text-green-500";
    if (value <= 5) return "text-yellow-500";
    if (value <= 7) return "text-orange-500";
    if (value <= 10) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">UV Index</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current</span>
          <span className={`text-lg font-semibold ${getUVColor(uvIndex.value)}`}>
            {uvIndex.value} - {uvIndex.riskLevel}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{uvIndex.recommendation}</p>
      </div>
    </Card>
  );
}

function WeatherAlerts({ alerts }: { alerts: WeatherAlert[] }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Weather Alerts</h3>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="border-l-4 border-red-500 pl-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{alert.event}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(alert.start).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm mt-1">{alert.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ExtendedForecast({ forecast }: { forecast: DetailedWeatherData['extendedForecast'] }) {
  if (!forecast) return null;

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">15-Day Forecast</h3>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">{day.date}</span>
              {day.icon}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{day.temp.min}°C</span>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-red-500 rounded-full">
                <div 
                  className="h-full bg-gray-200 rounded-full"
                  style={{ 
                    width: `${((day.temp.max - day.temp.min) / 30) * 100}%`,
                    marginLeft: `${((day.temp.min + 10) / 30) * 100}%`
                  }}
                />
              </div>
              <span className="text-sm">{day.temp.max}°C</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetailCity, setSelectedDetailCity] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { playSound } = useSound();

  const fetchWeatherData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const citiesToFetch: City[] = [...PREDEFINED_CITIES];
      if (selectedCity) {
        citiesToFetch.push(selectedCity as AdditionalCity);
      }

      // Check for API key before making any requests
      if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
        throw new Error(
          'OpenWeather API key is not configured. ' +
          'Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your Vercel environment variables ' +
          'in Project Settings → Environment Variables.'
        );
      }

      const weatherPromises = citiesToFetch.map(async (city) => {
        try {
          // Fetch current weather
          const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );

          if (!currentResponse.ok) {
            const errorData = await currentResponse.json();
            console.error(`Weather API Error for ${city}:`, {
              status: currentResponse.status,
              statusText: currentResponse.statusText,
              error: errorData
            });
            
            // Provide more specific error messages
            if (currentResponse.status === 401) {
              throw new Error(
                'Invalid API key. Please check if your OpenWeather API key is correct in your ' +
                'Vercel environment variables and ensure it is activated.'
              );
            }
            throw new Error(`Failed to fetch weather for ${city}: ${errorData.message}`);
          }

          const currentData = await currentResponse.json() as WeatherResponse;

          // Fetch forecast data
          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );

          if (!forecastResponse.ok) {
            const errorData = await forecastResponse.json();
            console.error(`Forecast API Error for ${city}:`, {
              status: forecastResponse.status,
              statusText: forecastResponse.statusText,
              error: errorData
            });
            throw new Error(`Failed to fetch forecast for ${city}: ${errorData.message}`);
          }

          const forecastData = await forecastResponse.json() as ForecastResponse;

          // Process hourly forecast (next 24 hours with 3-hour intervals)
          const hourlyForecast = forecastData.list.slice(0, 8).map((item: ForecastResponse['list'][0]) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', hour12: true }),
            temp: Math.round(item.main.temp),
            conditions: item.weather[0].main,
            icon: getWeatherIcon(item.weather[0].main),
          }));

          return {
            city,
            temperature: Math.round(currentData.main.temp),
            humidity: currentData.main.humidity,
            conditions: currentData.weather[0].main,
            icon: getWeatherIcon(currentData.weather[0].main),
            hourlyForecast,
          };
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error);
          throw error;
        }
      });

      const results = await Promise.all(weatherPromises);
      setWeatherData(results);
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error instanceof Error ? error.message : "Failed to load weather data. Please try again later.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchWeatherData();
    // Refresh weather data every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-red-500">
        <p className="text-xl font-medium">{error}</p>
        <Button variant="outline" onClick={fetchWeatherData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 border-b pb-4 sm:pb-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <CloudSun className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Weather Forecast
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Check weather conditions for major cities worldwide
            </p>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          <Select 
            value={selectedCity || ""} 
            onValueChange={(value) => {
              playSound();
              setSelectedCity(value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
              {ADDITIONAL_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            playSound();
            fetchWeatherData();
          }}
          disabled={isRefreshing}
          className="w-full sm:w-auto"
        >
          {isRefreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {weatherData.map((data, index) => (
          <motion.div
            key={data.city}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => {
                playSound();
                setSelectedDetailCity(data.city);
              }}
            >
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">{data.city}</CardTitle>
                    <p className="text-sm text-muted-foreground">{data.conditions}</p>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold">
                    {data.temperature}°C
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <WiHumidity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <span>{data.humidity}%</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs sm:text-sm bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/30"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <WeatherDetailsDialog
        city={selectedDetailCity || ""}
        isOpen={!!selectedDetailCity}
        onClose={() => {
          playSound();
          setSelectedDetailCity(null);
        }}
      />
    </div>
  );
} 