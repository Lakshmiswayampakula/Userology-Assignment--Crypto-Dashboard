"use client";

import { Button } from "@/components/ui/button";
import { useSound } from "@/components/sound-provider";

import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiFirstPage, BiLastPage } from "react-icons/bi";

import PaginationSelection from "./pagination-selection";
import { Table } from "@tanstack/react-table";
import { CryptoData } from "../crypto-columns";
import { PaginationType } from "../data-table";
import { Dispatch, SetStateAction } from "react";

export default function PaginationArea({
  table,
  pagination,
  setPagination,
}: {
  table: Table<CryptoData>;
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
}) {
  const { playSound } = useSound();

  return (
    <div
      className={`relative w-full h-[80px]  max-sm:h-[206px] max-sm:pt-4 max-sm:pb-4
           overflow-hidden flex justify-between items-center px-6  
           border-t max-sm:flex-col max-sm:gap-2`}
    >
      <PaginationSelection
        pagination={pagination}
        setPagination={setPagination}
      />
      <div className="flex gap-6 items-center max-sm:flex-col max-sm:mt-4 max-sm:gap-2">
        <span className="text-sm  text-gray-500">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex items-center justify-end space-x-2">
          {/* First Page Button */}
          <Button
            variant="outline"
            className="size-9 w-12"
            size="sm"
            onClick={() => {
              playSound();
              table.setPageIndex(0);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <BiFirstPage />
          </Button>

          {/* Previous Page Button */}
          <Button
            variant="outline"
            className="size-9 w-12"
            size="sm"
            onClick={() => {
              playSound();
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <GrFormPrevious />
          </Button>

          {/* Next Page Button */}
          <Button
            className="size-9 w-12"
            variant="outline"
            size="sm"
            onClick={() => {
              playSound();
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            <GrFormNext />
          </Button>

          {/* Last Page Button */}
          <Button
            className="size-9 w-12"
            variant="outline"
            size="sm"
            onClick={() => {
              playSound();
              table.setPageIndex(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <BiLastPage />
          </Button>
        </div>
      </div>
    </div>
  );
}
