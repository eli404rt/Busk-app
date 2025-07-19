"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Clock, Star, MapPin } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"
import { useState } from "react"

export function Analytics() {
  const { sessions, expenses, locations } = useDatabase()
  const [timeFilter, setTimeFilter] = useState("30")

  // Filter data based on time period
  const filterDate = new Date()
  filterDate.setDate(filterDate.getDate() - Number.parseInt(timeFilter))

  const filteredSessions = sessions.filter((session) => new Date(session.startTimestamp) >= filterDate)
  const filteredExpenses = expenses.filter((expense) => new Date(expense.date) >= filterDate)

  // Calculate metrics
  const totalEarnings = filteredSessions.reduce((sum, session) => sum + (session.earnings || 0), 0)
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netProfit = totalEarnings - totalExpenses
  const totalHours = filteredSessions.reduce((sum, session) => sum + (session.duration || 0) / 60, 0)
  const avgEarningsPerHour = totalHours > 0 ? totalEarnings / totalHours : 0
  const avgSessionRating =
    filteredSessions.length > 0
      ? filteredSessions.reduce((sum, session) => sum + (session.performanceRating || 0), 0) / filteredSessions.length
      : 0

  // Best performing location
  const locationStats = locations
    .map((location) => {
      const locationSessions = filteredSessions.filter((s) => s.locationId === location.id.toString())
      const earnings = locationSessions.reduce((sum, s) => sum + (s.earnings || 0), 0)
      return { location, earnings, sessionCount: locationSessions.length }
    })
    .sort((a, b) => b.earnings - a.earnings)

  const bestLocation = locationStats[0]

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
      {/* Time Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Insights from your busking performance</p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {filteredSessions.length} sessions</p>
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
            <p className="text-xs text-muted-foreground">After ${totalExpenses.toFixed(2)} expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Hour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgEarningsPerHour.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{totalHours.toFixed(1)} hours total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSessionRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">Performance rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Location Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Performance
          </CardTitle>
          <CardDescription>Your best performing busking spots</CardDescription>
        </CardHeader>
        <CardContent>
          {locationStats.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No location data available for this period.</p>
          ) : (
            <div className="space-y-3">
              {locationStats.slice(0, 5).map((stat, index) => (
                <div key={stat.location.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{stat.location.name}</p>
                      <p className="text-sm text-muted-foreground">{stat.sessionCount} sessions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${stat.earnings.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Where your money is going</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(expenseByCategory).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses recorded for this period.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(expenseByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    <span className="text-red-600 font-semibold">${amount.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
