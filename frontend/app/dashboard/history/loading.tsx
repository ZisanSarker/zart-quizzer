import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <>
      <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse"></div>

      <div className="mb-6">
        <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="h-10 bg-muted rounded w-64 mb-6 animate-pulse"></div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-48"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
                <div className="h-10 w-10 bg-muted rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}