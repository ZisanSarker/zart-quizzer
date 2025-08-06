"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { PageTransition } from "@/components/animations/motion"
import { LayoutWrapper } from "@/components/layout-wrapper"
import SharedHeader from "@/components/shared-header"
import SharedFooter from "@/components/shared-footer"
import SidebarLayout from "@/components/sidebar-layout"

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if we're in the dashboard section
  const isDashboardPage = pathname?.startsWith('/dashboard')
  
  // Check if we're in the auth section (login, register, oauth)
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/auth/')

  // For auth pages, return just the children without header/footer
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <SharedHeader />
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col w-full items-center justify-center overflow-auto">
        <div className="w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 mx-auto">
          <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12">
            <PageTransition>
              <LayoutWrapper>
                {isDashboardPage ? (
                  <SidebarLayout>{children}</SidebarLayout>
                ) : (
                  children
                )}
              </LayoutWrapper>
            </PageTransition>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  )
} 