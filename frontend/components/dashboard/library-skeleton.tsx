"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LibrarySkeletonProps {
  count?: number
}

export function LibrarySkeleton({ count = 3 }: LibrarySkeletonProps) {
  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3 p-3 sm:p-4 md:p-6">
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="h-10 bg-muted rounded w-full mt-4"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 