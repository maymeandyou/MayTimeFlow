"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, AlertTriangle, CheckCircle, Eye, X, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { storage } from "@/lib/storage"
import { isHoliday } from "@/lib/holidays"
import type { Client, Appointment } from "@/types"
import { useRouter } from "next/navigation"

interface ProviderHoliday {
  id: string
  date: string
  reason: string
}

export default function PlanningPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [appointmentCount, setAppointmentCount] = useState<string>("12")
  const [generatedAppointments, setGeneratedAppointments] = useState<Appointment[]>([])
  const [conflicts, setConflicts] = useState<string[]>([])
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [providerHolidays, setProviderHolidays] = useState<ProviderHoliday[]>([])
  const [showAvailability, setShowAvailability] = useState(false)
  const [newHolidayDate, setNewHolidayDate] = useState("")
  const [newHolidayReason, setNewHolidayReason] = useState("")
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false)
  const [generatedSchedule, setGeneratedSchedule] = useState<string>("")

  const router = useRouter()

  useEffect(() => {
    setClients(storage.clients.getAll())
    // Load provider holidays from localStorage
    const savedHolidays = localStorage.getItem("providerHolidays")
    if (savedHolidays) {
      setProviderHolidays(JSON.parse(savedHolidays))
    }
  }, [])

  const isProviderHoliday = (date: Date): boolean => {
    const dateString = date.toISOString().split("T")[0]
    return providerHolidays.some((holiday) => holiday.date === dateString)
  }

  const isDateAvailable = (date: Date): boolean => {
    // Check if it's a public holiday
    if (isHoliday(date)) return false

    // Check if it's a provider holiday
    if (isProviderHoliday(date)) return false

    // Check if there's already an appointment
    const existingAppointments = storage.appointments.getAll()
    const hasAppointment = existingAppointments.some((apt) => apt.date.toDateString() === date.toDateString())

    return !hasAppointment
  }

  const generateAvailableSlots = () => {
    const slots: { date: Date; times: string[] }[] = []
    const startDate = new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)

    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      if (!isHoliday(currentDate) && !isProviderHoliday(currentDate)) {
        const availableTimes = []
        // Check each hour from 8 AM to 8 PM
        for (let hour = 8; hour <= 20; hour++) {
          const timeSlot = `${hour.toString().padStart(2, "0")}:00`
          if (isDateAvailable(currentDate)) {
            availableTimes.push(timeSlot)
          }
        }
        if (availableTimes.length > 0) {
          slots.push({ date: new Date(currentDate), times: availableTimes })
        }
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setAvailableSlots(slots)
    setShowAvailability(true)
  }

  const generateAppointments = () => {
    if (!selectedClient) return

    const client = clients.find((c) => c.id === selectedClient)
    if (!client) return

    const appointments: Appointment[] = []
    const conflictDates: string[] = []
    const targetCount = Number.parseInt(appointmentCount)

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

    // Calculate interval based on appointment count and frequency
    let daysToAdd: number
    if (appointmentCount === "weekly") {
      daysToAdd = 7
    } else if (appointmentCount === "4") {
      daysToAdd = 90 // Quarterly
    } else if (appointmentCount === "6") {
      daysToAdd = 60 // Every 2 months
    } else {
      // Default calculation for custom numbers
      daysToAdd = Math.floor(365 / targetCount)
    }

    // Generate appointments
    let generatedCount = 0
    const maxAttempts = 365 // Prevent infinite loop
    let attempts = 0

    while (generatedCount < targetCount && attempts < maxAttempts) {
      attempts++

      // Check if this date is available
      if (!isDateAvailable(currentDate)) {
        const reason = isHoliday(currentDate)
          ? "Public Holiday"
          : isProviderHoliday(currentDate)
            ? "Provider Holiday"
            : "Already Booked"
        conflictDates.push(`${currentDate.toDateString()} - ${reason}`)
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7)
        continue
      }

      // Check if date is in the future (for current year)
      if (selectedYear === new Date().getFullYear() && currentDate < new Date()) {
        currentDate.setDate(currentDate.getDate() + daysToAdd)
        continue
      }

      // Create appointment
      const appointment: Appointment = {
        id: `${selectedClient}-${generatedCount}-${selectedYear}`,
        clientId: selectedClient,
        clientName: client.name,
        date: new Date(currentDate),
        time: client.preferences.preferredTime || "10:00",
        duration: 60,
        status: "scheduled",
        notes: "Auto-generated from yearly planning",
      }

      appointments.push(appointment)
      generatedCount++

      // Move to next appointment date
      currentDate.setDate(currentDate.getDate() + daysToAdd)
    }

    setGeneratedAppointments(appointments)
    setConflicts(conflictDates)

    // Generate schedule text for sharing
    generateScheduleText(appointments, client)
  }

  const generateScheduleText = (appointments: Appointment[], client: Client) => {
    const scheduleText = `
📅 APPOINTMENT SCHEDULE FOR ${client.name.toUpperCase()}

📧 Email: ${client.email}
📱 Phone: ${client.phone}

🗓️ SCHEDULED APPOINTMENTS (${appointments.length} sessions):

${appointments
  .map(
    (apt, index) =>
      `${index + 1}. ${apt.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} at ${apt.time}`,
  )
  .join("\n")}

💡 Frequency: ${client.preferences.frequency}
⏰ Preferred Time: ${client.preferences.preferredTime}
📝 Notes: ${client.preferences.notes || "None"}

Generated by MayTimeFlow Appointment Manager
    `.trim()

    setGeneratedSchedule(scheduleText)
  }

  const addProviderHoliday = () => {
    if (!newHolidayDate || !newHolidayReason) return

    const newHoliday: ProviderHoliday = {
      id: Date.now().toString(),
      date: newHolidayDate,
      reason: newHolidayReason,
    }

    const updatedHolidays = [...providerHolidays, newHoliday]
    setProviderHolidays(updatedHolidays)
    localStorage.setItem("providerHolidays", JSON.stringify(updatedHolidays))

    setNewHolidayDate("")
    setNewHolidayReason("")
    setIsHolidayDialogOpen(false)
  }

  const removeProviderHoliday = (id: string) => {
    const updatedHolidays = providerHolidays.filter((h) => h.id !== id)
    setProviderHolidays(updatedHolidays)
    localStorage.setItem("providerHolidays", JSON.stringify(updatedHolidays))
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
    setGeneratedSchedule("")
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(
      `Your Appointment Schedule - ${clients.find((c) => c.id === selectedClient)?.name}`,
    )
    const body = encodeURIComponent(generatedSchedule)
    const client = clients.find((c) => c.id === selectedClient)
    const mailto = `mailto:${client?.email}?subject=${subject}&body=${body}`
    window.open(mailto)
  }

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generatedSchedule)
    const whatsapp = `https://wa.me/?text=${text}`
    window.open(whatsapp, "_blank")
  }

  const selectedClientData = clients.find((c) => c.id === selectedClient)

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
              <Calendar className="w-6 h-6" />
              Yearly Planning Tool
            </CardTitle>
            <p className="text-gray-600">Automatically schedule appointments based on availability and preferences</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Client</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="rounded-full">
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
                <label className="block text-sm font-medium mb-2">Number of Appointments</label>
                <Select value={appointmentCount} onValueChange={setAppointmentCount}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 per year (Quarterly)</SelectItem>
                    <SelectItem value="6">6 per year (Bi-monthly)</SelectItem>
                    <SelectItem value="12">12 per year (Monthly)</SelectItem>
                    <SelectItem value="weekly">Weekly (52 per year)</SelectItem>
                    <SelectItem value="24">24 per year (Bi-weekly)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                >
                  <SelectTrigger className="rounded-full">
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
                <Button
                  onClick={generateAvailableSlots}
                  className="w-full bg-sage-400 hover:bg-sage-500 text-white rounded-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Check Availability
                </Button>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={generateAppointments}
                  disabled={!selectedClient}
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white rounded-full disabled:opacity-50"
                >
                  Generate Schedule
                </Button>
              </div>
            </div>

            {/* Provider Holidays Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Provider Holidays</CardTitle>
                  <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-pink-400 hover:bg-pink-500 text-white rounded-full">
                        Add Holiday
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-gray-50">
                      <DialogHeader>
                        <DialogTitle>Add Provider Holiday</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="holidayDate">Date</Label>
                          <Input
                            id="holidayDate"
                            type="date"
                            value={newHolidayDate}
                            onChange={(e) => setNewHolidayDate(e.target.value)}
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="holidayReason">Reason</Label>
                          <Input
                            id="holidayReason"
                            value={newHolidayReason}
                            onChange={(e) => setNewHolidayReason(e.target.value)}
                            placeholder="e.g., Personal vacation, Conference"
                            className="rounded-full"
                          />
                        </div>
                        <Button
                          onClick={addProviderHoliday}
                          className="w-full bg-sage-500 hover:bg-sage-600 text-white rounded-full"
                        >
                          Add Holiday
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {providerHolidays.map((holiday) => (
                    <div key={holiday.id} className="flex items-center justify-between bg-orange-50 p-2 rounded">
                      <div>
                        <span className="font-medium">{new Date(holiday.date).toLocaleDateString()}</span>
                        <span className="text-sm text-gray-600 ml-2">{holiday.reason}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeProviderHoliday(holiday.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {providerHolidays.length === 0 && <p className="text-gray-500 text-sm">No provider holidays set</p>}
                </div>
              </CardContent>
            </Card>

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
                      <Badge className="block mt-1 rounded-full">{selectedClientData.preferences.frequency}</Badge>
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

            {showAvailability && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                    <Eye className="w-5 h-5" />
                    Available Appointment Slots ({availableSlots.reduce((total, day) => total + day.times.length, 0)}{" "}
                    slots)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {availableSlots.slice(0, 20).map((slot, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded border">
                        <div className="font-medium text-blue-800 mb-2">
                          {slot.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {slot.times.map((time) => (
                            <div key={time} className="text-xs bg-white p-1 rounded text-center">
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {availableSlots.length > 20 && (
                    <p className="text-sm text-gray-600 mt-2">
                      ... and {availableSlots.length - 20} more days with available slots
                    </p>
                  )}
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
                    Generated Appointments for {selectedClientData?.name} ({generatedAppointments.length})
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

                  <div className="flex gap-2 mb-4">
                    <Button onClick={shareViaEmail} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Schedule
                    </Button>
                    <Button
                      onClick={shareViaWhatsApp}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp Schedule
                    </Button>
                  </div>

                  <Button
                    onClick={saveAppointments}
                    className="w-full bg-sage-500 hover:bg-sage-600 text-white rounded-full"
                  >
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
