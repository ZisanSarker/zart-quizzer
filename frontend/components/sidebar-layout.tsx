"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Home, Plus, Library, History, Settings } from "lucide-react"

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const sidebarLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/create", label: "Create Quiz", icon: Plus },
    { href: "/dashboard/library", label: "My Library", icon: Library },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  // Find the active index for the floating indicator
  const activeIndex = sidebarLinks.findIndex(link => pathname === link.href)

  return (
    <>
      {/* Desktop Sidebar - Fixed on left side */}
      <div className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 w-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl z-50">
        <div className="flex flex-col py-4 relative">
          {/* Floating active indicator */}
          <div 
            className="absolute w-12 h-12 bg-primary/20 rounded-xl transition-all duration-500 ease-out left-2"
            style={{
              transform: `translateY(${activeIndex * 64}px)`,
            }}
          />
          
          <ul className="flex flex-col items-center gap-4 relative z-10">
            {sidebarLinks.map(({ href, label, icon: Icon }, index) => (
              <li key={href} className="w-full flex justify-center">
                <div className="relative">
                  <Link
                    href={href}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl font-medium transition-all duration-300 relative z-20
                      ${pathname === href
                        ? "text-primary-700 dark:text-primary-300"
                        : "hover:text-primary-700 dark:hover:text-primary-300"}
                    `}
                  >
                    <Icon className="h-6 w-6 flex-shrink-0" />
                  </Link>
                  
                  {/* Glass effect background with text on hover */}
                  <div className="absolute left-full ml-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg top-1/2 transform -translate-y-1/2">
                    <span className="text-sm font-medium text-white">{label}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full h-16 bg-white/20 backdrop-blur-md border-t border-white/30 z-50">
        <div className="flex items-center justify-around h-full px-4">
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl font-medium transition-all duration-300 relative
                ${pathname === href
                  ? "text-primary-700 dark:text-primary-300 bg-primary/20"
                  : "hover:text-primary-700 dark:hover:text-primary-300"}
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Add bottom padding for mobile navigation */}
      <div className="lg:hidden pb-16">
        {children}
      </div>

      {/* Desktop content */}
      <div className="hidden lg:block">
        {children}
      </div>
    </>
  )
} 