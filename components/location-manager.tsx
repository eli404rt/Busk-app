"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Plus, Edit, Archive, Clock, Star } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"
import type { Location } from "@/types/database"
import { Music } from "lucide-react" // Import Music component

export function LocationManager() {
  const { locations, sessions, addLocation, updateLocation } = useDatabase()
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  // Calculate stats for each location
  const locationStats = locations.map((location) => {
    const locationSessions = sessions.filter((s) => s.locationId === location.id.toString())
    const totalEarnings = locationSessions.reduce((sum, s) => sum + (s.earnings || 0), 0)
    const totalTime = locationSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    const avgRating =
      locationSessions.length > 0
        ? locationSessions.reduce((sum, s) => sum + (s.performanceRating || 0), 0) / locationSessions.length
        : 0
    const avgEarningsPerHour = totalTime > 0 ? totalEarnings / (totalTime / 60) : 0

    return {
      ...location,
      sessionCount: locationSessions.length,
      totalEarnings,
      totalTime,
      avgRating,
      avgEarningsPerHour,
    }
  })

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location)
    setShowLocationForm(true)
  }

  const handleCloseForm = () => {
    setShowLocationForm(false)
    setEditingLocation(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Location Management</h2>
          <p className="text-muted-foreground">Manage your busking spots and analyze their performance.</p>
        </div>
        <Button onClick={() => setShowLocationForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Locations Grid */}
      {locationStats.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No locations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first busking location to track performance.
            </p>
            <Button onClick={() => setShowLocationForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locationStats.map((location) => (
            <Card key={location.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {location.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{location.address}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEditLocation(location)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                {location.isArchived && (
                  <Badge variant="secondary" className="w-fit">
                    <Archive className="mr-1 h-3 w-3" />
                    Archived
                  </Badge>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Performance Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Music className="h-3 w-3 text-muted-foreground" />
                      <span>{location.sessionCount} sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{Math.round(location.totalTime / 60)}h total</span>
                    </div>
                  </div>

                  {/* Financial Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Earnings</span>
                      <span className="font-semibold text-green-600">${location.totalEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg/Hour</span>
                      <span className="font-semibold">${location.avgEarningsPerHour.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  {location.avgRating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm">{location.avgRating.toFixed(1)}/5 avg rating</span>
                    </div>
                  )}

                  {/* GPS Coordinates */}
                  {location.gpsCoordinates && (
                    <div className="text-xs text-muted-foreground">
                      {location.gpsCoordinates.latitude.toFixed(4)}, {location.gpsCoordinates.longitude.toFixed(4)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Location Form Modal */}
      {showLocationForm && <LocationForm location={editingLocation} onClose={handleCloseForm} />}
    </div>
  )
}

interface LocationFormProps {
  location?: Location | null
  onClose: () => void
}

function LocationForm({ location, onClose }: LocationFormProps) {
  const { addLocation, updateLocation } = useDatabase()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: location?.name || "",
    address: location?.address || "",
    latitude: location?.gpsCoordinates?.latitude || "",
    longitude: location?.gpsCoordinates?.longitude || "",
    isArchived: location?.isArchived || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const locationData: Omit<Location, "id"> = {
        name: formData.name,
        address: formData.address,
        gpsCoordinates:
          formData.latitude && formData.longitude
            ? {
                latitude: Number.parseFloat(formData.latitude.toString()),
                longitude: Number.parseFloat(formData.longitude.toString()),
              }
            : undefined,
        isArchived: formData.isArchived,
      }

      if (location) {
        await updateLocation(location.id, locationData)
      } else {
        await addLocation(locationData)
      }

      onClose()
    } catch (error) {
      console.error("Error saving location:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{location ? "Edit Location" : "Add New Location"}</DialogTitle>
          <DialogDescription>Add or update a busking location for performance tracking.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Downtown Square"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="e.g., 123 Main St, City, State"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude (Optional)</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                placeholder="e.g., 40.7128"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude (Optional)</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                placeholder="e.g., -74.0060"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : location ? "Update Location" : "Add Location"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
