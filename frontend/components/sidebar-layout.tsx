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
      {/* Independent sidebar positioned relative to viewport */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 w-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl z-50">
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
                  
                  {/* Glass effect background with text on hover - only for this specific icon */}
                  <div className="absolute left-full ml-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg top-1/2 transform -translate-y-1/2">
                    <span className="text-sm font-medium text-white">{label}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Render children without any additional wrapper */}
      {children}
    </>
  )
} 