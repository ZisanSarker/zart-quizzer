import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="h-10 w-60 bg-muted rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1fr_2fr]">
        {/* Left (Profile card) */}
        <Card className="card-hover">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-32 w-32 bg-muted rounded-full mb-2 animate-pulse"></div>
              <div className="h-10 w-10 bg-muted rounded-full absolute bottom-0 right-0 animate-pulse"></div>
            </div>
            <div className="h-8 w-40 bg-muted rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-32 bg-muted rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-24 bg-muted rounded mb-6 animate-pulse"></div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-4 sm:mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="h-6 w-10 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="w-full mt-6">
              <div className="h-4 w-20 bg-muted rounded mb-3 animate-pulse"></div>
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 w-12 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right (Tabs) */}
        <div className="space-y-6">
          <div className="mb-4 flex gap-3">
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
          </div>
          {/* About Tab */}
          <Card className="card-hover">
            <CardHeader>
              <div className="h-7 w-36 bg-muted rounded mb-2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
              <div className="h-6 w-full bg-muted rounded animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="h-4 w-20 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-20 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="h-4 w-24 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Statistics Tab */}
          <Card className="card-hover">
            <CardHeader>
              <div className="h-7 w-36 bg-muted rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="h-4 w-32 bg-muted rounded mb-3 animate-pulse"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-12 ml-auto bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div>
                <div className="h-4 w-32 bg-muted rounded mb-3 animate-pulse"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <div className="h-2 w-2 rounded-full bg-muted mt-2 animate-pulse"></div>
                    <div>
                      <div className="h-4 w-40 bg-muted rounded mb-1 animate-pulse"></div>
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Edit Tab */}
          <Card>
            <CardHeader>
              <div className="h-7 w-32 bg-muted rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="h-5 w-28 bg-muted rounded mb-3 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                      <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <div className="h-10 w-48 bg-muted rounded animate-pulse"></div>
            </CardFooter>
          </Card>
          {/* Account Security Card */}
          <Card className="card-hover">
            <CardHeader>
              <div className="h-7 w-44 bg-muted rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-52 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-muted-foreground rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 w-24 bg-muted rounded mb-1 animate-pulse"></div>
                      <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}