"use client"

import { Card, CardContent } from "@/components/ui/card"

export function ExploreSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse mobile-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="h-6 w-16 bg-muted rounded"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                </div>
                <div className="h-10 w-28 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 