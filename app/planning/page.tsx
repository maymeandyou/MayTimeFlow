"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { storage } from "@/lib/storage"
import { isHoliday } from "@/lib/holidays"
import type { Client, Appointment } from "@/types"

export default function PlanningPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [generatedAppointments, setGeneratedAppointments] = useState<Appointment[]>([])
  const [conflicts, setConflicts] = useState<string[]>([])

  useEffect(() => {
    setClients(storage.clients.getAll())
  }, [])

  const generateAppointments = () => {
    if (!selectedClient) return

    const client = clients.find((c) => c.id === selectedClient)
    if (!client) return

    const appointments: Appointment[] = []
    const conflictDates: string[] = []

    // Start from January 1st of selected year
    const startDate = new Date(selectedYear, 0, 1)

    // Find the first occurrence of the preferred day
    const preferredDayIndex = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(
      client.preferences.preferredDay.toLowerCase(),
    )

    const currentDate = new Date(startDate)
    while (currentDate.getDay() !== preferredDayIndex) {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Generate 12 appointments based on frequency
    let appointmentCount = 0
    const maxAttempts = 365 // Prevent infinite loop
    let attempts = 0

    while (appointmentCount < 12 && attempts < maxAttempts) {
      attempts++

      // Check if this date is a holiday
      if (isHoliday(currentDate)) {
        conflictDates.push(`${currentDate.toDateString()} - Holiday`)
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7)
        continue
      }

      // Check if date is in the future (for current year)
      if (selectedYear === new Date().getFullYear() && currentDate < new Date()) {
        // Move to next occurrence
        const daysToAdd =
          client.preferences.frequency === "weekly"
            ? 7
            : client.preferences.frequency === "biweekly"
              ? 14
              : client.preferences.frequency === "monthly"
                ? 30
                : 14
        currentDate.setDate(currentDate.getDate() + daysToAdd)
        continue
      }

      // Create appointment
      const appointment: Appointment = {
        id: `${selectedClient}-${appointmentCount}-${selectedYear}`,
        clientId: selectedClient,
        clientName: client.name,
        date: new Date(currentDate),
        time: client.preferences.preferredTime || "10:00",
        duration: 60,
        status: "scheduled",
        notes: "Auto-generated from yearly planning",
      }

      appointments.push(appointment)
      appointmentCount++

      // Calculate next appointment date
      const daysToAdd =
        client.preferences.frequency === "weekly"
          ? 7
          : client.preferences.frequency === "biweekly"
            ? 14
            : client.preferences.frequency === "monthly"
              ? 30
              : 14

      currentDate.setDate(currentDate.getDate() + daysToAdd)
    }

    setGeneratedAppointments(appointments)
    setConflicts(conflictDates)
  }

  const saveAppointments = () => {
    generatedAppointments.forEach((apt) => {
      storage.appointments.add(apt)
    })
    alert(
      `Successfully scheduled ${generatedAppointments.length} appointments for ${clients.find((c) => c.id === selectedClient)?.name}!`,
    )
    setGeneratedAppointments([])
    setConflicts([])
  }

  const selectedClientData = clients.find((c) => c.id === selectedClient)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Yearly Planning Tool
            </CardTitle>
            <p className="text-gray-600">Automatically schedule 12 sessions for a client based on their preferences</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Client</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</SelectItem>
                    <SelectItem value={(new Date().getFullYear() + 1).toString()}>
                      {new Date().getFullYear() + 1}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={generateAppointments} disabled={!selectedClient} className="w-full">
                  Generate Schedule
                </Button>
              </div>
            </div>

            {selectedClientData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Client Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Frequency</span>
                      <Badge className="block mt-1">{selectedClientData.preferences.frequency}</Badge>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Preferred Day</span>
                      <p className="font-medium capitalize">{selectedClientData.preferences.preferredDay}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Preferred Time</span>
                      <p className="font-medium">{selectedClientData.preferences.preferredTime || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Notes</span>
                      <p className="text-sm">{selectedClientData.preferences.notes || "None"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {conflicts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-5 h-5" />
                    Scheduling Conflicts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {conflicts.map((conflict, index) => (
                      <div key={index} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        {conflict}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {generatedAppointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    Generated Appointments ({generatedAppointments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {generatedAppointments.map((apt, index) => (
                      <div key={apt.id} className="bg-green-50 p-3 rounded border">
                        <div className="font-medium">Session {index + 1}</div>
                        <div className="text-sm text-gray-600">
                          {apt.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-600">{apt.time}</div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={saveAppointments} className="w-full">
                    Save All Appointments
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
