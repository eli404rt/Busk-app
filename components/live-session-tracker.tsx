"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, Clock, DollarSign, MapPin } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"
import { useWeather } from "@/hooks/use-weather"
import type { Session } from "@/types/database"

export function LiveSessionTracker() {
  const { locations, addSession, addLocation } = useDatabase()
  const { weather } = useWeather()
  const [isActive, setIsActive] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(0)
  const [earnings, setEarnings] = useState("")
  const [selectedLocationId, setSelectedLocationId] = useState("")
  const [sessionType, setSessionType] = useState("Performance")
  const [currentLocation, setCurrentLocation] = useState<string>("")

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && startTime) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, startTime])

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
            )
            const data = await response.json()
            setCurrentLocation(`${data.locality || data.city || "Unknown"}, ${data.principalSubdivision || ""}`)
          } catch (error) {
            console.error("Failed to get location:", error)
            setCurrentLocation("Current Location")
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          setCurrentLocation("Location unavailable")
        },
      )
    }
  }, [])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    setIsActive(true)
    setStartTime(new Date())
    setDuration(0)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleStop = async () => {
    if (!startTime) return

    setIsActive(false)

    // Create session data
    const sessionData: Omit<Session, "id"> = {
      sessionType,
      locationId: selectedLocationId,
      startTimestamp: startTime.toISOString(),
      endTimestamp: new Date().toISOString(),
      duration: Math.floor(duration / 60), // Convert to minutes
      earnings: earnings ? Number.parseFloat(earnings) : 0,
      weather: weather || undefined,
      performanceRating: 3, // Default rating
      traffic: "Moderate", // Default traffic
      audienceEngagement: "Some engagement", // Default engagement
      incidents: [],
      notes: "",
    }

    try {
      await addSession(sessionData)

      // Reset form
      setStartTime(null)
      setDuration(0)
      setEarnings("")
      setSelectedLocationId("")
      setSessionType("Performance")
    } catch (error) {
      console.error("Failed to save session:", error)
    }
  }

  const handleQuickAddLocation = async () => {
    if (!currentLocation) return

    try {
      const locationData = {
        name: currentLocation,
        address: currentLocation,
        isArchived: false,
      }

      const id = await addLocation(locationData)
      setSelectedLocationId(id.toString())
    } catch (error) {
      console.error("Failed to add location:", error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Live Session Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold mb-2">{formatDuration(duration)}</div>
          <div className="flex items-center justify-center gap-2">
            {isActive && (
              <Badge variant="default" className="animate-pulse">
                Recording
              </Badge>
            )}
            {startTime && <Badge variant="outline">Started: {startTime.toLocaleTimeString()}</Badge>}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {!isActive && !startTime && (
            <Button onClick={handleStart} size="lg" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Session
            </Button>
          )}

          {isActive && (
            <Button
              onClick={handlePause}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-transparent"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}

          {!isActive && startTime && (
            <Button onClick={handleStart} size="lg" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Resume
            </Button>
          )}

          {startTime && (
            <Button onClick={handleStop} variant="destructive" size="lg" className="flex items-center gap-2">
              <Square className="h-4 w-4" />
              Finish Session
            </Button>
          )}
        </div>

        {/* Session Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionType">Session Type</Label>
              <Select value={sessionType} onValueChange={setSessionType} disabled={isActive}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Practice">Practice</SelectItem>
                  <SelectItem value="Setup/Breakdown">Setup/Breakdown</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Select value={selectedLocationId} onValueChange={setSelectedLocationId} disabled={isActive}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentLocation && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleQuickAddLocation}
                    disabled={isActive}
                    className="flex items-center gap-1 bg-transparent"
                  >
                    <MapPin className="h-3 w-3" />
                    Add Current
                  </Button>
                )}
              </div>
              {currentLocation && <p className="text-xs text-muted-foreground mt-1">Current: {currentLocation}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="earnings">Earnings ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="earnings"
                type="number"
                step="0.01"
                min="0"
                value={earnings}
                onChange={(e) => setEarnings(e.target.value)}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
          </div>

          {/* Weather Display */}
          {weather && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <strong>Weather:</strong> {weather.temperature}°C, {weather.conditions}
                {weather.windSpeed && ` • Wind: ${weather.windSpeed} km/h`}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
