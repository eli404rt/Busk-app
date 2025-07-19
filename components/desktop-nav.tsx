"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, DollarSign, Home, MapPin, Music, Settings } from "lucide-react"

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

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
