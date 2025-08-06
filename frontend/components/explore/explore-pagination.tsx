"use client"

import { Button } from "@/components/ui/button"

interface ExplorePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ExplorePagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: ExplorePaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="touch-target"
      >
        Prev
      </Button>
      <span className="responsive-text-small text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="touch-target"
      >
        Next
      </Button>
    </div>
  )
} 