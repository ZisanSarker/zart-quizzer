import { Inter, Playfair_Display_SC } from "next/font/google"
import { Providers } from "@/components/providers"
import SharedLayout from "@/components/shared-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfairDisplaySC = Playfair_Display_SC({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-playfair-display-sc"
})

export const metadata = {
  title: "ZART Quizzer - Create and Practice Quizzes",
  description: "AI-powered quiz generation and practice platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfairDisplaySC.variable}`} suppressHydrationWarning>
        <Providers>
          <SharedLayout>
            {children}
          </SharedLayout>
        </Providers>
      </body>
    </html>
  )
}
