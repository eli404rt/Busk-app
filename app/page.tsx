"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Music, DollarSign, TrendingUp, Plus } from "lucide-react"
import { SessionForm } from "@/components/session-form"
import { ExpenseForm } from "@/components/expense-form"
import { LocationManager } from "@/components/location-manager"
import { Analytics } from "@/components/analytics"
import { Settings } from "@/components/settings"
import { MobileNav } from "@/components/mobile-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { useDatabase } from "@/hooks/use-database"
import { useMobile } from "@/hooks/use-mobile"

export default function BuskingTracker() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const { sessions, expenses, locations, loading } = useDatabase()
  const isMobile = useMobile()

  // Calculate dashboard stats
  const totalEarnings = sessions.reduce((sum, session) => sum + (session.earnings || 0), 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netProfit = totalEarnings - totalExpenses
  const avgSessionEarnings = sessions.length > 0 ? totalEarnings / sessions.length : 0

  // Recent sessions (last 5)
  const recentSessions = sessions
    .sort((a, b) => new Date(b.endTimestamp).getTime() - new Date(a.startTimestamp).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your busking data...</p>
        </div>
      </div>
    )
  }

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${netProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg/Session</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgSessionEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start tracking your busking activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={() => setShowSessionForm(true)} className="w-full" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Log New Session
            </Button>
            <Button onClick={() => setShowExpenseForm(true)} variant="outline" className="w-full" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest busking activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No sessions yet. Start by logging your first performance!
              </p>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => {
                  const location = locations.find((l) => l.id === session.locationId)
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{session.sessionType}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(session.startTimestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{location?.name || "Unknown Location"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${session.earnings?.toFixed(2) || "0.00"}</p>
                        <p className="text-xs text-muted-foreground">{Math.round((session.duration || 0) / 60)}min</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {isMobile ? (
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <DesktopNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {/* Main Content */}
      <main className={`${isMobile ? "pb-20" : "pt-16"} px-4 py-6 max-w-7xl mx-auto`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard" className="mt-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your busking performance overview.</p>
            </div>
            <DashboardContent />
          </TabsContent>

          <TabsContent value="sessions" className="mt-0">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
                  <p className="text-muted-foreground">Track and manage your busking performances.</p>
                </div>
                <Button onClick={() => setShowSessionForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Session
                </Button>
              </div>
            </div>
            {/* Session list will be implemented here */}
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Session management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finances" className="mt-0">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
                  <p className="text-muted-foreground">Track earnings, expenses, and profitability.</p>
                </div>
                <Button onClick={() => setShowExpenseForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </div>
            </div>
            {/* Financial overview will be implemented here */}
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Financial management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="mt-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
              <p className="text-muted-foreground">Manage and analyze your busking spots.</p>
            </div>
            <LocationManager />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">Insights and trends from your busking data.</p>
            </div>
            <Analytics />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Customize your busking tracker experience.</p>
            </div>
            <Settings />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      {showSessionForm && <SessionForm onClose={() => setShowSessionForm(false)} />}

      {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} />}
    </div>
  )
}
