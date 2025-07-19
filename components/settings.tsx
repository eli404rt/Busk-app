"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Trash2, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useDatabase } from "@/hooks/use-database"

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { sessions, expenses, locations, clearAllData } = useDatabase()
  const [settings, setSettings] = useState({
    currency: "USD",
    darkMode: false,
    notifications: true,
    autoBackup: false,
  })

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("busking-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    localStorage.setItem("busking-settings", JSON.stringify(newSettings))
  }

  const handleExportData = () => {
    const data = {
      sessions,
      expenses,
      locations,
      settings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `busking-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // Here you would implement the import logic
        console.log("Import data:", data)
        alert("Data import functionality would be implemented here")
      } catch (error) {
        alert("Error importing data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearAllData()
      alert("All data has been cleared.")
    }
  }

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Customize your busking tracker experience and manage your data.</p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of your application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
          <CardDescription>Configure currency and regional preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Currency</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred currency for earnings and expenses</p>
            </div>
            <Select value={settings.currency} onValueChange={(value) => saveSettings({ ...settings, currency: value })}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export, import, or clear your busking data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Statistics */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{sessions.length}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{expenses.length}</div>
              <div className="text-sm text-muted-foreground">Expenses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{locations.length}</div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
          </div>

          <Separator />

          {/* Export/Import Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">Download all your data as a JSON file</p>
              </div>
              <Button onClick={handleExportData} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Import Data</Label>
                <p className="text-sm text-muted-foreground">Restore data from a previously exported file</p>
              </div>
              <div>
                <Input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
                <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-destructive">Clear All Data</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all sessions, expenses, and locations
                </p>
              </div>
              <Button onClick={handleClearData} variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Storage</CardTitle>
          <CardDescription>Information about how your data is stored and managed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Local Storage</Badge>
              <span className="text-sm">All data is stored locally in your browser</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">No Cloud Sync</Badge>
              <span className="text-sm">Your data never leaves your device</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Privacy First</Badge>
              <span className="text-sm">No tracking or analytics</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Your data is stored using IndexedDB in your browser. Make sure to export your data
              regularly as a backup, as clearing browser data will permanently delete all your busking records.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Information about the Busking Performance and Financial Tracker.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Built with</span>
              <span className="text-sm">Next.js, React, IndexedDB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Storage</span>
              <span className="text-sm">Local IndexedDB</span>
            </div>
          </div>

          <Separator />

          <p className="text-sm text-muted-foreground">
            A comprehensive tool designed to help buskers track performances, manage finances, and optimize their craft
            through data-driven insights.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
