"use client";

import { Card } from "@/components/ui/card";
import { FaMoneyBillWave } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function CurrencyPage() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update timestamp every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary/15 size-10 flex items-center justify-center text-primary rounded-md">
            <FaMoneyBillWave className="text-xl" />
          </div>
          <h1 className="text-2xl font-semibold">Currency Exchange</h1>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-0">
          Last updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
      
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Currency Converter</h2>
        {/* Add currency converter component here */}
        <p className="text-muted-foreground">Currency converter coming soon...</p>
      </Card>
    </div>
  );
} 