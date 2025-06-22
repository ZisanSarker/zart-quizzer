import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-auto max-w-4xl animate-fade-in">
          <div className="grid w-full max-w-full sm:max-w-md grid-cols-2 mb-6 bg-muted/80 gap-4">
            <div className="h-10 bg-muted rounded animate-pulse"></div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
          </div>
          {/* Form Tab Skeleton */}
          <div>
            <Card className="shadow-soft mb-8">
              <CardHeader>
                <div className="h-8 w-56 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
                  <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="flex flex-col space-y-2">
                    <div className="h-8 w-40 bg-muted rounded animate-pulse"></div>
                    <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
                    <div className="h-8 w-28 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-36 bg-muted rounded animate-pulse"></div>
                  <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-36 bg-muted rounded animate-pulse mt-1"></div>
                  </div>
                  <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-44 bg-muted rounded animate-pulse mt-1"></div>
                  </div>
                  <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-12 w-full bg-muted rounded animate-pulse"></div>
              </CardFooter>
            </Card>
          </div>
          {/* Voice Tab Skeleton */}
          <div>
            <Card className="shadow-soft">
              <CardHeader>
                <div className="h-8 w-56 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10 space-y-6">
                <div className="relative">
                  <div className="h-24 w-24 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="h-6 w-40 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-52 bg-muted rounded animate-pulse"></div>
                {/* Recognized command skeleton */}
                <div className="w-full mt-6">
                  <div className="h-4 w-24 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="p-4 bg-muted rounded-lg mt-2 border border-primary-100 h-10 animate-pulse"></div>
                  <div className="h-12 w-full bg-muted rounded mt-6 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}