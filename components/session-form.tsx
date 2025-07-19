"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Clock, DollarSign, Star } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"
import { useWeather } from "@/hooks/use-weather"
import type { Session } from "@/types/database"

interface SessionFormProps {
  onClose: () => void
  session?: Session
}

export function SessionForm({ onClose, session }: SessionFormProps) {
  const { locations, addSession, updateSession } = useDatabase()
  const { weather } = useWeather()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simplified form state
  const [formData, setFormData] = useState({
    sessionType: session?.sessionType || "Performance",
    locationId: session?.locationId || "",
    startTimestamp: session?.startTimestamp || new Date().toISOString().slice(0, 16),
    endTimestamp: session?.endTimestamp || "",
    earnings: session?.earnings?.toString() || "",
    performanceRating: session?.performanceRating || 3,
    notes: session?.notes || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const sessionData: Omit<Session, "id"> = {
        sessionType: formData.sessionType,
        locationId: formData.locationId,
        startTimestamp: formData.startTimestamp,
        endTimestamp: formData.endTimestamp,
        duration: formData.endTimestamp
          ? Math.max(
              0,
              (new Date(formData.endTimestamp).getTime() - new Date(formData.startTimestamp).getTime()) / 1000 / 60,
            )
          : 0,
        earnings: formData.earnings ? Number.parseFloat(formData.earnings) : 0,
        performanceRating: formData.performanceRating,
        notes: formData.notes,
        weather: weather || undefined,
        traffic: "Moderate",
        audienceEngagement: "Some engagement",
        incidents: [],
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{session ? "Edit Session" : "Add Session"}</DialogTitle>
          <DialogDescription>Record the details of your busking session.</DialogDescription>
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
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Practice">Practice</SelectItem>
                      <SelectItem value="Setup/Breakdown">Setup/Breakdown</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
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

          {/* Financial & Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Earnings & Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="earnings">Total Earnings ($)</Label>
                <Input
                  id="earnings"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.earnings}
                  onChange={(e) => setFormData((prev) => ({ ...prev, earnings: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Performance Rating: {formData.performanceRating}/5
                </Label>
                <Slider
                  value={[formData.performanceRating]}
                  onValueChange={([value]) => setFormData((prev) => ({ ...prev, performanceRating: value }))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes about this session..."
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
