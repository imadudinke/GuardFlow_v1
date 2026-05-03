"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  className?: string;
}

type VisiblePage = number | "...";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
  className,
}: PaginationProps) {
  const getVisiblePages = (): VisiblePage[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: VisiblePage[] = [];

    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push("...");
      }
    }

    rangeWithDots.push(...range);

    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("relative z-20 flex flex-wrap items-center justify-center gap-2", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={cn(
          "retro-card-static p-2 bg-white transition-colors relative z-10",
          !hasPrev
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        )}
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </button>

      <div className="relative z-10 flex max-w-full flex-wrap items-center justify-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-500 retro-mono text-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                "retro-card-static min-w-10 px-3 py-2 text-sm retro-mono transition-colors cursor-pointer relative z-10",
                isActive
                  ? "bg-black text-white border-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#000]"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={cn(
          "retro-card-static p-2 bg-white transition-colors relative z-10",
          !hasNext
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        )}
        title="Next page"
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  total: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  pageSize,
  total,
  className,
}: PaginationInfoProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  if (total === 0) {
    return (
      <div className={cn("text-sm text-gray-600 retro-mono", className)}>
        No results found
      </div>
    );
  }

  return (
    <div className={cn("text-sm text-gray-600 retro-mono", className)}>
      Showing {start}-{end} of {total} threats
    </div>
  );
}