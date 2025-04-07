"use client";

import { Card } from "@/components/ui/card";
import { FaMoneyBillWave } from "react-icons/fa";

export default function CurrencyPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-primary/15 size-10 flex items-center justify-center text-primary rounded-md">
          <FaMoneyBillWave className="text-xl" />
        </div>
        <h1 className="text-2xl font-semibold">Currency Exchange</h1>
      </div>
      
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Currency Converter</h2>
        {/* Add currency converter component here */}
        <p className="text-muted-foreground">Currency converter coming soon...</p>
      </Card>
    </div>
  );
} 