import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CryptoTable } from "./data-table";
import { cryptoColumns, CryptoData } from "./crypto-columns";
import { allCryptosType } from "@/app/data/allCryptos";
import { useAppStore } from "@/app/hooks/useAppStore";
import { X } from "lucide-react";

type SingleCoinType = Pick<
  allCryptosType[number],
  | "name"
  | "image"
  | "current_price"
  | "total_volume"
  | "market_cap_rank"
  | "market_cap"
  | "price_change_percentage_24h"
  | "high_24h"
  | "low_24h"
>;

export default function CryptoTableDialog({
  allCoins,
}: {
  allCoins: allCryptosType;
}) {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const { openTableDialog, setOpenDialog, setSearch } = useAppStore();

  useEffect(() => {
    const formattedData: CryptoData[] = allCoins.map(
      (coin: SingleCoinType) => ({
        name: coin.name,
        icon: coin.image,
        price: coin.current_price,
        volume: coin.total_volume,
        marketRank: coin.market_cap_rank,
        marketCap: coin.market_cap,
        changePercentage: coin.price_change_percentage_24h,
        highIn24: coin.high_24h,
        lowIn24: coin.low_24h,
      })
    );

    setCryptoData(formattedData);
  }, [allCoins]);

  useEffect(() => {
    if (!openTableDialog) {
      setSearch("");
    }
  }, [openTableDialog, setSearch]);

  return (
    <Dialog open={openTableDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"link"} className="h-10">
          See all
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 sm:p-6 poppins max-h-[90vh] w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] overflow-hidden">
        <DialogHeader className="relative">
          <DialogTitle className="text-lg sm:text-[22px] pr-8">
            All Cryptocurrencies
          </DialogTitle>
          <DialogDescription className="text-sm">
            View a comprehensive list of all available cryptocurrencies,
            including their prices, market capitalization, and other key
            details.
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 sm:hidden"
            onClick={() => setOpenDialog(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <Separator className="my-4" />
        <div className="flex-grow overflow-auto pr-2 -mr-2">
          <CryptoTable columns={cryptoColumns} data={cryptoData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
