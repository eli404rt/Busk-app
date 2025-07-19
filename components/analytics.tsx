"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Clock, MapPin, Star } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"

export function Analytics() {
  const { sessions, expenses, locations } = useDatabase()
  const [timeRange, setTimeRange] = useState("30") // days
  const [chartData, setChartData] = useState<any>(null)

  // Filter data based on time range
  const filterByTimeRange = (items: any[], dateField: string) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - Number.parseInt(timeRange))

    return items.filter((item) => {
      const itemDate = new Date(item[dateField])
      return itemDate >= cutoffDate
    })
  }

  const filteredSessions = filterByTimeRange(sessions, "startTimestamp")
  const filteredExpenses = filterByTimeRange(expenses, "date")

  // Calculate analytics
  const analytics = {
    totalEarnings: filteredSessions.reduce((sum, s) => sum + (s.earnings || 0), 0),
    totalExpenses: filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    totalSessions: filteredSessions.length,
    totalHours: filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60,
    avgSessionEarnings:
      filteredSessions.length > 0
        ? filteredSessions.reduce((sum, s) => sum + (s.earnings || 0), 0) / filteredSessions.length
        : 0,
    avgHourlyRate: (() => {
      const totalHours = filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60
      const totalEarnings = filteredSessions.reduce((sum, s) => sum + (s.earnings || 0), 0)
      return totalHours > 0 ? totalEarnings / totalHours : 0
    })(),
    bestLocation: (() => {
      const locationEarnings = new Map()
      filteredSessions.forEach((session) => {
        const locationId = session.locationId
        const current = locationEarnings.get(locationId) || 0
        locationEarnings.set(locationId, current + (session.earnings || 0))
      })

      let bestLocationId = ""
      let maxEarnings = 0
      locationEarnings.forEach((earnings, locationId) => {
        if (earnings > maxEarnings) {
          maxEarnings = earnings
          bestLocationId = locationId
        }
      })

      return locations.find((l) => l.id.toString() === bestLocationId)
    })(),
    avgRating:
      filteredSessions.length > 0
        ? filteredSessions.reduce((sum, s) => sum + (s.performanceRating || 0), 0) / filteredSessions.length
        : 0,
  }

  const netProfit = analytics.totalEarnings - analytics.totalExpenses

  // Prepare chart data
  useEffect(() => {
    if (filteredSessions.length === 0) return

    // Group sessions by date for earnings chart
    const dailyEarnings = new Map()
    filteredSessions.forEach((session) => {
      const date = new Date(session.startTimestamp).toISOString().split("T")[0]
      const current = dailyEarnings.get(date) || 0
      dailyEarnings.set(date, current + (session.earnings || 0))
    })

    // Convert to chart format
    const chartLabels = Array.from(dailyEarnings.keys()).sort()
    const chartValues = chartLabels.map((date) => dailyEarnings.get(date))

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: "Daily Earnings",
          data: chartValues,
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          tension: 0.1,
        },
      ],
    })
  }, [filteredSessions])

  // Top performing locations
  const locationPerformance = locations
    .map((location) => {
      const locationSessions = filteredSessions.filter((s) => s.locationId === location.id.toString())
      const totalEarnings = locationSessions.reduce((sum, s) => sum + (s.earnings || 0), 0)
      const sessionCount = locationSessions.length
      const avgEarnings = sessionCount > 0 ? totalEarnings / sessionCount : 0

      return {
        ...location,
        totalEarnings,
        sessionCount,
        avgEarnings,
      }
    })
    .filter((l) => l.sessionCount > 0)
    .sort((a, b) => b.totalEarnings - a.totalEarnings)

  // Expense breakdown
  const expenseByCategory = filteredExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Insights and trends from your busking data.</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${analytics.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{analytics.totalSessions} sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            {netProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${netProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">After ${analytics.totalExpenses.toFixed(2)} expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.avgHourlyRate.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{analytics.totalHours.toFixed(1)} hours total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">Performance rating</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="locations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
              <CardDescription>Your best performing busking spots in the selected time period.</CardDescription>
            </CardHeader>
            <CardContent>
              {locationPerformance.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No location data available for the selected time period.
                </p>
              ) : (
                <div className="space-y-4">
                  {locationPerformance.slice(0, 5).map((location, index) => (
                    <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <div>
                          <h4 className="font-medium">{location.name}</h4>
                          <p className="text-sm text-muted-foreground">{location.sessionCount} sessions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${location.totalEarnings.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${location.avgEarnings.toFixed(2)} avg</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Your spending by category in the selected time period.</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(expenseByCategory).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No expense data available for the selected time period.
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(expenseByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{category}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">${amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {((amount / analytics.totalExpenses) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Track your busking performance over time.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No session data available for the selected time period.
                </p>
              ) : (
                <div className="space-y-6">
                  {/* Best Performance Day */}
                  {analytics.bestLocation && (
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-200">Top Location</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {analytics.bestLocation.name} has been your most profitable location
                      </p>
                    </div>
                  )}

                  {/* Performance Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Session Insights</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg session length:</span>
                          <span>{((analytics.totalHours / analytics.totalSessions) * 60).toFixed(0)} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best session type:</span>
                          <span>
                            {(() => {
                              const sessionTypes = filteredSessions.reduce(
                                (acc, session) => {
                                  acc[session.sessionType] = (acc[session.sessionType] || 0) + (session.earnings || 0)
                                  return acc
                                },
                                {} as Record<string, number>,
                              )

                              const bestType = Object.entries(sessionTypes).sort(([, a], [, b]) => b - a)[0]

                              return bestType ? bestType[0] : "N/A"
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Financial Health</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profit margin:</span>
                          <span className={netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                            {analytics.totalEarnings > 0 ? ((netProfit / analytics.totalEarnings) * 100).toFixed(1) : 0}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ROI:</span>
                          <span className={netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                            {analytics.totalExpenses > 0 ? ((netProfit / analytics.totalExpenses) * 100).toFixed(1) : 0}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
