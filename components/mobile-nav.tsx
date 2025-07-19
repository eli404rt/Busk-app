"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, DollarSign, Home, MapPin, Music, Settings } from "lucide-react"

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "sessions", label: "Sessions", icon: Music },
    { id: "finances", label: "Finances", icon: DollarSign },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center gap-1 h-auto py-2 px-3"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
