import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Loading() {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-muted rounded w-36 animate-pulse"></div>
      </div>

      <div className="mb-6">
        <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
      </div>

      <div className="mb-8">
        <div className="flex gap-4 max-w-md mb-6">
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Created by Me (Grid of loading cards, matches "created" and "saved" tab skeletons) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={`created-loading-${i}`} className="animate-pulse">
            <CardHeader className="pb-3">
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

      {/* Saved Quizzes (Grid of loading cards, matches "created" and "saved" tab skeletons) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        {[1, 2, 3].map((i) => (
          <Card key={`saved-loading-${i}`} className="animate-pulse">
            <CardHeader className="pb-3">
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
    </>
  )
}