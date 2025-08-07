import { Inter, Playfair_Display_SC } from "next/font/google"
import { Providers } from "@/components/providers"
import SharedLayout from "@/components/shared-layout"
import "./globals.css"

// Optimize font loading with display swap and preload
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter'
})

const playfairDisplaySC = Playfair_Display_SC({ 
  weight: "400",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['serif'],
  variable: "--font-playfair-display-sc"
})

export const metadata = {
  title: {
    default: "ZART Quizzer - Create and Practice Quizzes",
    template: "%s | ZART Quizzer"
  },
  description: "AI-powered quiz generation and practice platform. Create, share, and practice quizzes with intelligent learning features.",
  keywords: ["quiz", "education", "learning", "AI", "practice", "assessment", "knowledge"],
  authors: [{ name: "ZART Quizzer Team" }],
  creator: "ZART Quizzer",
  publisher: "ZART Quizzer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ZART Quizzer - Create and Practice Quizzes",
    description: "AI-powered quiz generation and practice platform",
    url: '/',
    siteName: 'ZART Quizzer',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'ZART Quizzer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZART Quizzer - Create and Practice Quizzes',
    description: 'AI-powered quiz generation and practice platform',
    images: ['/placeholder-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preload critical images */}
        <link rel="preload" as="image" href="/placeholder-logo.png" />
        <link rel="preload" as="image" href="/placeholder-user.jpg" />
        
        {/* Preload critical CSS */}
        <link rel="preload" as="style" href="/globals.css" />
        
        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/dashboard" />
        <link rel="prefetch" href="/explore" />
        <link rel="prefetch" href="/login" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* Performance optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
      </head>
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
