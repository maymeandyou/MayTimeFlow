"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Home, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { storage } from "@/lib/storage"
import type { Appointment, Client } from "@/types"

export default function DayViewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timeBlocks, setTimeBlocks] = useState<Record<string, string>>({})
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [selectedDuration, setSelectedDuration] = useState<string>("60")
  const [bufferTime, setBufferTime] = useState<number>(15) // Default buffer time in minutes

  useEffect(() => {
    if (dateParam) {
      setSelectedDate(new Date(dateParam))
    }
  }, [dateParam])

  useEffect(() => {
    setAppointments(storage.appointments.getAll())
    setClients(storage.clients.getAll())

    // Load buffer time from settings if available
    const settings = localStorage.getItem("settings")
    if (settings) {
      const parsedSettings = JSON.parse(settings)
      if (parsedSettings.bufferTime) {
        setBufferTime(Number.parseInt(parsedSettings.bufferTime))
      }
    }
  }, [])

  useEffect(() => {
    // Load existing appointments for this day
    const dayAppointments = appointments.filter((apt) => apt.date.toDateString() === selectedDate.toDateString())

    const blocks: Record<string, string> = {}
    dayAppointments.forEach((apt) => {
      const hour = apt.time.split(":")[0]
      const minute = apt.time.split(":")[1]
      blocks[`${hour}:${minute}`] = `${apt.clientName} - ${apt.notes || "Appointment"} (${apt.duration}min)`
    })
    setTimeBlocks(blocks)
  }, [selectedDate, appointments])

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const isTimeSlotAvailable = (time: string) => {
    const dayAppointments = appointments.filter((apt) => apt.date.toDateString() === selectedDate.toDateString())
    const [hours, minutes] = time.split(":").map(Number)
    const slotStart = hours * 60 + minutes
    const slotEnd = slotStart + Number.parseInt(selectedDuration) + bufferTime // Include buffer time

    return !dayAppointments.some((apt) => {
      const [aptHours, aptMinutes] = apt.time.split(":").map(Number)
      const aptStart = aptHours * 60 + aptMinutes
      const aptEnd = aptStart + apt.duration + bufferTime // Include buffer for existing appointments

      // Check for overlap including buffer
      return slotStart < aptEnd && slotEnd > aptStart
    })
  }

  const handleTimeBlockChange = (time: string, value: string) => {
    setTimeBlocks((prev) => ({
      ...prev,
      [time]: value,
    }))
  }

  const handleTimeSlotClick = (time: string) => {
    if (isTimeSlotAvailable(time)) {
      setSelectedTime(time)
      setIsAppointmentDialogOpen(true)
    }
  }

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId)

    // Auto-fill client preferences if available
    const client = clients.find((c) => c.id === clientId)
    if (client && client.preferences && client.preferences.preferredTime) {
      // Check if preferred time is available
      if (isTimeSlotAvailable(client.preferences.preferredTime)) {
        setSelectedTime(client.preferences.preferredTime)
      }
    }
  }

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration)
  }

  const handleAppointmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const selectedClient = clients.find((c) => c.id === selectedClientId)

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clientId: selectedClientId || "manual",
      clientName: selectedClient?.name || (formData.get("clientName") as string),
      date: selectedDate,
      time: selectedTime,
      duration: Number.parseInt(selectedDuration),
      status: "scheduled",
      notes: formData.get("notes") as string,
    }

    storage.appointments.add(newAppointment)
    setAppointments([...appointments, newAppointment])
    setIsAppointmentDialogOpen(false)
    setSelectedTime("")
    setSelectedClientId("")

    // Refresh the page to show the new appointment
    router.refresh()
  }

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate)
    router.push(`/day-view?date=${newDate.toISOString().split("T")[0]}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="bg-sage-400 hover:bg-sage-500 text-white border-none rounded-full"
                >
                  <Home className="w-4 h-4 mr-1" /> Home
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/calendar")}
                  className="bg-pink-400 hover:bg-pink-500 text-white border-none rounded-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Calendar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/clients")}
                  className="bg-sage-400 hover:bg-sage-500 text-white border-none rounded-full"
                >
                  <Users className="w-4 h-4 mr-1" /> Clients
                </Button>
              </div>

              <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-pink-400 hover:bg-pink-500 text-white rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-gray-50">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-gray-900">Add Appointment</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="existingClient" className="text-gray-700 font-medium">
                        Select Existing Client
                      </Label>
                      <Select value={selectedClientId} onValueChange={handleClientChange}>
                        <SelectTrigger className="rounded-full border-gray-300">
                          <SelectValue placeholder="Choose existing client or enter new" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} - {client.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {!selectedClientId && (
                      <div>
                        <Label htmlFor="clientName" className="text-gray-700 font-medium">
                          Client Name
                        </Label>
                        <Input id="clientName" name="clientName" required className="rounded-full border-gray-300" />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="duration" className="text-gray-700 font-medium">
                        Duration (minutes)
                      </Label>
                      <Select value={selectedDuration} onValueChange={handleDurationChange}>
                        <SelectTrigger className="rounded-full border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="75">75 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="time" className="text-gray-700 font-medium">
                        Time
                      </Label>
                      <Select name="time" value={selectedTime} onValueChange={setSelectedTime} required>
                        <SelectTrigger className="rounded-full border-gray-300">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots
                            .filter((time) => isTimeSlotAvailable(time))
                            .map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-gray-700 font-medium">
                        Notes
                      </Label>
                      <Input
                        id="notes"
                        name="notes"
                        placeholder="Optional notes..."
                        className="rounded-full border-gray-300"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600 text-white rounded-full">
                      Book Appointment
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDay("prev")} className="rounded-full">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigateDay("next")} className="rounded-full">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label htmlFor="duration" className="text-gray-700 font-medium mr-2">
                  Duration:
                </Label>
                <Select value={selectedDuration} onValueChange={handleDurationChange} className="w-32 inline-block">
                  <SelectTrigger className="rounded-full border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="75">75 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeSlots.map((time) => {
                const isAvailable = isTimeSlotAvailable(time)
                const hasAppointment = Object.keys(timeBlocks).some((blockTime) => {
                  const [blockHour, blockMinute] = blockTime.split(":").map(Number)
                  const [timeHour, timeMinute] = time.split(":").map(Number)
                  const blockStart = blockHour * 60 + blockMinute
                  const blockEnd = blockStart + Number.parseInt(selectedDuration) + bufferTime
                  const timePoint = timeHour * 60 + timeMinute
                  return timePoint >= blockStart && timePoint < blockEnd
                })

                // Only show times at 15-minute intervals
                if (time.endsWith(":00") || time.endsWith(":15") || time.endsWith(":30") || time.endsWith(":45")) {
                  return (
                    <div
                      key={time}
                      onClick={() => isAvailable && handleTimeSlotClick(time)}
                      className={`flex items-center gap-4 p-3 bg-white rounded-lg border ${
                        isAvailable ? "cursor-pointer hover:bg-gray-50" : "opacity-75"
                      }`}
                    >
                      <div className="w-16 text-sm font-medium text-gray-600">{time}</div>
                      <div className="flex-1">
                        {hasAppointment ? (
                          <div className="text-sm bg-green-100 text-green-800 p-2 rounded-lg">
                            {Object.entries(timeBlocks).find(([blockTime]) => {
                              const [blockHour, blockMinute] = blockTime.split(":").map(Number)
                              const [timeHour, timeMinute] = time.split(":").map(Number)
                              const blockStart = blockHour * 60 + blockMinute
                              const blockEnd = blockStart + Number.parseInt(selectedDuration) + bufferTime
                              const timePoint = timeHour * 60 + timeMinute
                              return timePoint >= blockStart && timePoint < blockEnd
                            })?.[1] || "Appointment"}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            {isAvailable ? "Available - Click to book" : "Unavailable"}
                          </div>
                        )}
                      </div>
                      {isAvailable && !hasAppointment && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTimeSlotClick(time)
                          }}
                          className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-4"
                        >
                          Book
                        </Button>
                      )}
                    </div>
                  )
                }
                return null
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
