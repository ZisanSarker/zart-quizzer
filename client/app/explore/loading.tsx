import { Card, CardContent } from "@/components/ui/card"
import { Brain } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Brain className="h-6 w-6 text-primary" />
            <span>QuizGenius</span>
          </div>
          <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <div className="space-y-6">
            <div>
              <div className="h-5 bg-muted rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
            </div>

            <div>
              <div className="h-5 bg-muted rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
            </div>

            <div>
              <div className="h-5 bg-muted rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
            </div>

            <div>
              <div className="h-5 bg-muted rounded w-20 mb-2 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-6 w-20 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="h-10 bg-muted rounded w-64 animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
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
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
