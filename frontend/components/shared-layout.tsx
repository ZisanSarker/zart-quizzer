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
        <div className="w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-4 md:py-6 mx-auto">
          <div className="mx-4 sm:mx-8 lg:mx-12">
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