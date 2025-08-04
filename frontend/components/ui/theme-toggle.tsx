'use client'

import React from 'react'
import { useTheme } from '@/contexts/theme-context'
import { Label } from './label'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Sun, Moon, Monitor } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={className}>
      <Label className="text-base font-medium">Theme</Label>
      <RadioGroup
        value={theme}
        onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
        className="grid grid-cols-3 gap-4 mt-2"
      >
        <div>
          <RadioGroupItem
            value="light"
            id="light"
            className="peer sr-only"
          />
          <Label
            htmlFor="light"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Sun className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium leading-none">Light</p>
              <p className="text-xs text-muted-foreground">
                White background
              </p>
            </div>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="dark"
            id="dark"
            className="peer sr-only"
          />
          <Label
            htmlFor="dark"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Moon className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium leading-none">Dark</p>
              <p className="text-xs text-muted-foreground">
                Black background
              </p>
            </div>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="system"
            id="system"
            className="peer sr-only"
          />
          <Label
            htmlFor="system"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Monitor className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium leading-none">System</p>
              <p className="text-xs text-muted-foreground">
                Follows your OS
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
} 