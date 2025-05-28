"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, Calendar, TrendingUp, DollarSign, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { storage } from "@/lib/storage"
import type { Client, Appointment } from "@/types"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const router = useRouter()

  useEffect(() => {
    const existingClients = storage.clients.getAll()
    const existingAppointments = storage.appointments.getAll()

    setClients(existingClients)
    setAppointments(existingAppointments)
  }, [])

  const totalClients = clients.length
  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((apt) => apt.status === "completed").length
  const upcomingAppointments = appointments.filter((apt) => apt.date > new Date() && apt.status === "scheduled").length
  const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled").length

  // Calculate revenue based on completed appointments
  const settings = localStorage.getItem("settings")
  const hourlyRate = settings ? JSON.parse(settings).hourlyRate || 80 : 80
  const totalRevenue = appointments
    .filter((apt) => apt.status === "completed")
    .reduce((sum, apt) => sum + (apt.duration / 60) * hourlyRate, 0)

  const avgSessionDuration =
    appointments.length > 0
      ? Math.round(appointments.reduce((sum, apt) => sum + apt.duration, 0) / appointments.length)
      : 0

  const frequencyStats = clients.reduce(
    (acc, client) => {
      acc[client.preferences.frequency] = (acc[client.preferences.frequency] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const dayStats = clients.reduce(
    (acc, client) => {
      acc[client.preferences.preferredDay] = (acc[client.preferences.preferredDay] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate monthly trends from real data
  const monthlyStats = appointments.reduce(
    (acc, apt) => {
      const month = apt.date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate client retention rate
  const clientsWithMultipleAppointments = clients.filter(
    (client) => appointments.filter((apt) => apt.clientId === client.id).length > 1,
  ).length
  const retentionRate = clients.length > 0 ? Math.round((clientsWithMultipleAppointments / clients.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
                className="bg-sage-400 hover:bg-sage-500 text-white border-none rounded-full"
              >
                ← Back to Home
              </Button>
            </div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Analytics Dashboard
            </CardTitle>
            <p className="text-gray-600">Overview of your business metrics</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Clients</p>
                      <p className="text-2xl font-bold">{totalClients}</p>
                      <p className="text-xs text-green-600">+2 this month</p>
                    </div>
                    <Users className="w-8 h-8 text-sage-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Appointments</p>
                      <p className="text-2xl font-bold">{totalAppointments}</p>
                      <p className="text-xs text-green-600">+3 this week</p>
                    </div>
                    <Calendar className="w-8 h-8 text-pink-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold">{completedAppointments}</p>
                      <p className="text-xs text-gray-600">Sessions finished</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Upcoming</p>
                      <p className="text-2xl font-bold">{upcomingAppointments}</p>
                      <p className="text-xs text-blue-600">Next 30 days</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Cancelled</p>
                      <p className="text-2xl font-bold">{cancelledAppointments}</p>
                      <p className="text-xs text-red-600">Cancelled sessions</p>
                    </div>
                    <Calendar className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold">${totalRevenue}</p>
                      <p className="text-xs text-green-600">From completed sessions</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Session</p>
                      <p className="text-2xl font-bold">{avgSessionDuration}min</p>
                      <p className="text-xs text-gray-600">Average duration</p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Retention Rate</p>
                      <p className="text-2xl font-bold">{retentionRate}%</p>
                      <p className="text-xs text-green-600">Client retention</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Frequency Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(frequencyStats).map(([frequency, count]) => (
                      <div key={frequency} className="flex items-center justify-between">
                        <span className="capitalize">{frequency}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-sage-500 h-2 rounded-full"
                              style={{ width: `${(count / totalClients) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferred Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(dayStats).map(([day, count]) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="capitalize">{day}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-pink-500 h-2 rounded-full"
                              style={{ width: `${(count / totalClients) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Appointment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(monthlyStats).map(([month, count]) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="font-medium">{month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-sage-400 to-pink-400 h-3 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(monthlyStats))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
