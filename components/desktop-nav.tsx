"use client"

import { Music, DollarSign, MapPin, BarChart3, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface DesktopNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DesktopNav({ activeTab, onTabChange }: DesktopNavProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "sessions", label: "Sessions", icon: Music },
    { id: "finances", label: "Finances", icon: DollarSign },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Busking Tracker</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
