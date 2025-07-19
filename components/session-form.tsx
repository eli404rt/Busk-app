"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Clock, DollarSign, Star, CloudRain, AlertTriangle } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"
import { useWeather } from "@/hooks/use-weather"
import type { Session } from "@/types/database"

interface SessionFormProps {
  onClose: () => void
  session?: Session
}

export function SessionForm({ onClose, session }: SessionFormProps) {
  const { locations, addSession, updateSession } = useDatabase()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    sessionType: session?.sessionType || "Performance",
    locationId: session?.locationId || "",
    startTimestamp: session?.startTimestamp || new Date().toISOString().slice(0, 16),
    endTimestamp: session?.endTimestamp || "",
    earnings: session?.earnings || 0,
    startingFloat: session?.startingFloat || 0,
    biggestTip: session?.biggestTip || 0,
    performanceRating: session?.performanceRating || 3,
    traffic: session?.traffic || "Moderate",
    audienceEngagement: session?.audienceEngagement || "Some engagement",
    notes: session?.notes || "",
    incidents: session?.incidents || [],
    timeSpentSinging: session?.timeSpentSinging || 0,
    timeSpentPlaying: session?.timeSpentPlaying || 0,
  })

  const [newIncident, setNewIncident] = useState("")
  const { weather, loading: weatherLoading } = useWeather()

  // Calculate duration when timestamps change
  useEffect(() => {
    if (formData.startTimestamp && formData.endTimestamp) {
      const start = new Date(formData.startTimestamp)
      const end = new Date(formData.endTimestamp)
      const duration = Math.max(0, (end.getTime() - start.getTime()) / 1000 / 60) // minutes
      setFormData((prev) => ({ ...prev, duration }))
    }
  }, [formData.startTimestamp, formData.endTimestamp])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const sessionData: Omit<Session, "id"> = {
        ...formData,
        duration: formData.endTimestamp
          ? Math.max(
              0,
              (new Date(formData.endTimestamp).getTime() - new Date(formData.startTimestamp).getTime()) / 1000 / 60,
            )
          : 0,
        weather: weather || undefined,
      }

      if (session) {
        await updateSession(session.id, sessionData)
      } else {
        await addSession(sessionData)
      }

      onClose()
    } catch (error) {
      console.error("Error saving session:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addIncident = () => {
    if (newIncident.trim()) {
      setFormData((prev) => ({
        ...prev,
        incidents: [...prev.incidents, newIncident.trim()],
      }))
      setNewIncident("")
    }
  }

  const removeIncident = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      incidents: prev.incidents.filter((_, i) => i !== index),
    }))
  }

  const sessionTypes = ["Performance", "Travel", "Networking", "Practice", "Setup/Breakdown"]
  const trafficLevels = ["Dead", "Quiet", "Moderate", "Busy", "Super Busy"]
  const engagementLevels = [
    "No engagement",
    "Minimal engagement",
    "Some engagement",
    "Good engagement",
    "High engagement",
  ]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{session ? "Edit Session" : "Log New Session"}</DialogTitle>
          <DialogDescription>Record the details of your busking session for tracking and analysis.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionType">Session Type</Label>
                  <Select
                    value={formData.sessionType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, sessionType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.locationId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, locationId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id.toString()}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTimestamp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTimestamp: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTimestamp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTimestamp: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="earnings">Total Earnings ($)</Label>
                  <Input
                    id="earnings"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.earnings}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, earnings: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="startingFloat">Starting Float ($)</Label>
                  <Input
                    id="startingFloat"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.startingFloat}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, startingFloat: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="biggestTip">Biggest Tip ($)</Label>
                  <Input
                    id="biggestTip"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.biggestTip}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, biggestTip: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance & Environment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Performance & Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Performance Rating: {formData.performanceRating}/5</Label>
                <Slider
                  value={[formData.performanceRating]}
                  onValueChange={([value]) => setFormData((prev) => ({ ...prev, performanceRating: value }))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="traffic">Traffic Level</Label>
                  <Select
                    value={formData.traffic}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, traffic: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {trafficLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="engagement">Audience Engagement</Label>
                  <Select
                    value={formData.audienceEngagement}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, audienceEngagement: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {engagementLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Weather Display */}
              {weather && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain className="h-4 w-4" />
                    <span className="font-medium">Weather Conditions</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Temperature: {weather.temperature}°C | Conditions: {weather.conditions}
                    {weather.windSpeed && ` | Wind: ${weather.windSpeed} km/h`}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Time Breakdown (minutes)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeSpentSinging">Time Spent Singing</Label>
                  <Input
                    id="timeSpentSinging"
                    type="number"
                    min="0"
                    value={formData.timeSpentSinging}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, timeSpentSinging: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="timeSpentPlaying">Time Spent Playing Instrument</Label>
                  <Input
                    id="timeSpentPlaying"
                    type="number"
                    min="0"
                    value={formData.timeSpentPlaying}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, timeSpentPlaying: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Incidents & Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="newIncident">Add Incident</Label>
                <div className="flex gap-2">
                  <Input
                    id="newIncident"
                    value={newIncident}
                    onChange={(e) => setNewIncident(e.target.value)}
                    placeholder="Describe any incidents..."
                  />
                  <Button type="button" onClick={addIncident}>
                    Add
                  </Button>
                </div>
              </div>

              {formData.incidents.length > 0 && (
                <div className="space-y-2">
                  <Label>Recorded Incidents</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.incidents.map((incident, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeIncident(index)}
                      >
                        {incident} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional observations or notes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : session ? "Update Session" : "Save Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
