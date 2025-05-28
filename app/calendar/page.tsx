"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Home, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage } from "@/lib/storage"
import { isHoliday, getHolidayName } from "@/lib/holidays"
import type { Appointment, Client } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("month")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [selectedDuration, setSelectedDuration] = useState<string>("60")
  const [bufferTime, setBufferTime] = useState<number>(15) // Default buffer time in minutes
  const [dayViewDialogOpen, setDayViewDialogOpen] = useState(false)
  const [selectedDayForDialog, setSelectedDayForDialog] = useState<Date | null>(null)

  const router = useRouter()

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getDayView = (date: Date) => {
    return [date]
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => apt.date.toDateString() === date.toDateString())
  }

  const isTimeSlotAvailable = (date: Date, time: string, duration = 60) => {
    const dayAppointments = getAppointmentsForDate(date)
    const [hours, minutes] = time.split(":").map(Number)
    const slotStart = hours * 60 + minutes
    const slotEnd = slotStart + Number.parseInt(duration) + bufferTime // Include buffer time

    return !dayAppointments.some((apt) => {
      const [aptHours, aptMinutes] = apt.time.split(":").map(Number)
      const aptStart = aptHours * 60 + aptMinutes
      const aptEnd = aptStart + apt.duration + bufferTime // Include buffer for existing appointments

      // Check for overlap including buffer
      return slotStart < aptEnd && slotEnd > aptStart
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    if (view === "month") {
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else if (view === "week") {
      const endOfWeek = new Date(date)
      endOfWeek.setDate(date.getDate() + 6)
      return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    } else {
      return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    }
  }

  const handleDayClick = (day: Date) => {
    setSelectedDayForDialog(day)
    setDayViewDialogOpen(true)
  }

  const handleTimeSlotClick = (date: Date, time: string) => {
    if (isTimeSlotAvailable(date, time, selectedDuration)) {
      setSelectedDate(date)
      setSelectedTime(time)
      setIsAppointmentDialogOpen(true)
    }
  }

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId)
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
      date: selectedDate || new Date(),
      time: selectedTime || (formData.get("time") as string),
      duration: Number.parseInt(selectedDuration),
      status: "scheduled",
      notes: formData.get("notes") as string,
    }

    storage.appointments.add(newAppointment)
    setAppointments(storage.appointments.getAll())
    setIsAppointmentDialogOpen(false)
    setDayViewDialogOpen(false)
    setSelectedDate(null)
    setSelectedTime("")
    setSelectedClientId("")
    e.currentTarget.reset()
  }

  const generateTimeOptions = (date: Date) => {
    const times = []
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        if (isTimeSlotAvailable(date, timeString, selectedDuration)) {
          times.push(timeString)
        }
      }
    }
    return times
  }

  const days =
    view === "month"
      ? getDaysInMonth(currentDate)
      : view === "week"
        ? getWeekDays(currentDate)
        : getDayView(currentDate)

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
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Calendar</CardTitle>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
                <Button
                  variant={view === "day" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("day")}
                  className={
                    view === "day"
                      ? "bg-sage-500 hover:bg-sage-600 text-white rounded-full"
                      : "hover:bg-gray-200 rounded-full"
                  }
                >
                  Day
                </Button>
                <Button
                  variant={view === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("week")}
                  className={
                    view === "week"
                      ? "bg-sage-500 hover:bg-sage-600 text-white rounded-full"
                      : "hover:bg-gray-200 rounded-full"
                  }
                >
                  Week
                </Button>
                <Button
                  variant={view === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("month")}
                  className={
                    view === "month"
                      ? "bg-sage-500 hover:bg-sage-600 text-white rounded-full"
                      : "hover:bg-gray-200 rounded-full"
                  }
                >
                  Month
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate("prev")} className="rounded-full">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
                <Button variant="outline" size="sm" onClick={() => navigateDate("next")} className="rounded-full">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-pink-400 hover:bg-pink-500 text-white rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    New Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-gray-50">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-gray-900">Add New Appointment</DialogTitle>
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
                      <Label htmlFor="date" className="text-gray-700 font-medium">
                        Date
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={selectedDate?.toISOString().split("T")[0] || ""}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        required
                        className="rounded-full border-gray-300"
                      />
                    </div>

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
                          {selectedDate &&
                            generateTimeOptions(selectedDate).map((time) => (
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
          </CardHeader>
          <CardContent>
            <div
              className={`grid ${view === "month" ? "grid-cols-7" : view === "week" ? "grid-cols-7" : "grid-cols-1"} gap-1`}
            >
              {view !== "day" &&
                ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center font-semibold text-gray-600 border-b">
                    {day}
                  </div>
                ))}

              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-2 h-24 border border-gray-200"></div>
                }

                const dayAppointments = getAppointmentsForDate(day)
                const isToday = day.toDateString() === new Date().toDateString()
                const isHolidayDay = isHoliday(day)
                const holidayName = getHolidayName(day)

                if (view === "day") {
                  return (
                    <div key={index} className="space-y-2">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold">
                          {day.toLocaleDateString("en-US", { weekday: "long" })}
                        </h3>
                        <p className="text-gray-600">
                          {day.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                        </p>
                        <Button
                          onClick={() => router.push(`/day-view?date=${day.toISOString().split("T")[0]}`)}
                          className="mt-2 bg-pink-400 hover:bg-pink-500 text-white rounded-full"
                          size="sm"
                        >
                          Open Day Planner
                        </Button>
                      </div>
                      {Array.from({ length: 13 }, (_, i) => {
                        const hour = i + 8
                        const timeSlot = `${hour.toString().padStart(2, "0")}:00`
                        const slotAppointments = dayAppointments.filter((apt) =>
                          apt.time.startsWith(hour.toString().padStart(2, "0")),
                        )
                        const isAvailable = isTimeSlotAvailable(day, timeSlot, selectedDuration)

                        return (
                          <div
                            key={timeSlot}
                            onClick={() => isAvailable && handleTimeSlotClick(day, timeSlot)}
                            className={`flex items-center gap-4 p-3 bg-white rounded-lg border hover:bg-gray-50 ${
                              isAvailable ? "cursor-pointer" : "opacity-50"
                            }`}
                          >
                            <div className="w-16 text-sm font-medium text-gray-600">{timeSlot}</div>
                            <div className="flex-1">
                              {slotAppointments.length > 0 ? (
                                <div className="space-y-1">
                                  {slotAppointments.map((apt) => (
                                    <div key={apt.id} className="text-sm bg-green-100 text-green-800 p-2 rounded-lg">
                                      {apt.time} - {apt.clientName} ({apt.duration}min)
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">
                                  {isAvailable ? "Available - Click to book" : "Unavailable"}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                } else if (view === "week") {
                  return (
                    <div
                      key={index}
                      onClick={() => handleDayClick(day)}
                      className={`p-2 h-auto min-h-40 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        isToday ? "bg-pink-50 border-pink-200" : ""
                      } ${isHolidayDay ? "bg-red-50" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm ${isToday ? "font-bold text-pink-600" : ""}`}>{day.getDate()}</span>
                        {isHolidayDay && (
                          <Badge variant="destructive" className="text-xs">
                            Holiday
                          </Badge>
                        )}
                      </div>
                      {holidayName && <div className="text-xs text-red-600 mb-1">{holidayName}</div>}

                      <div className="space-y-1">
                        {[9, 12, 15, 18].map((hour) => {
                          const timeSlot = `${hour.toString().padStart(2, "0")}:00`
                          const isAvailable = isTimeSlotAvailable(day, timeSlot, selectedDuration)
                          const slotAppointments = dayAppointments.filter(
                            (apt) => Number.parseInt(apt.time.split(":")[0]) === hour,
                          )

                          return (
                            <div
                              key={hour}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (isAvailable) handleTimeSlotClick(day, timeSlot)
                              }}
                              className={`text-xs p-1 rounded-md ${
                                slotAppointments.length > 0
                                  ? "bg-green-100 text-green-800"
                                  : isAvailable
                                    ? "bg-blue-50 text-blue-800 hover:bg-blue-100"
                                    : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {timeSlot}{" "}
                              {slotAppointments.length > 0
                                ? `- ${slotAppointments[0].clientName}`
                                : isAvailable
                                  ? "Available"
                                  : "Unavailable"}
                            </div>
                          )
                        })}

                        {dayAppointments.length > 4 && (
                          <div className="text-xs text-gray-500 text-center">+{dayAppointments.length - 4} more</div>
                        )}
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`p-2 h-24 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      isToday ? "bg-pink-50 border-pink-200" : ""
                    } ${isHolidayDay ? "bg-red-50" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm ${isToday ? "font-bold text-pink-600" : ""}`}>{day.getDate()}</span>
                      {isHolidayDay && (
                        <Badge variant="destructive" className="text-xs">
                          Holiday
                        </Badge>
                      )}
                    </div>
                    {holidayName && <div className="text-xs text-red-600 mb-1">{holidayName}</div>}
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div key={apt.id} className="text-xs bg-green-100 text-green-800 p-1 rounded-lg truncate">
                          {apt.time} - {apt.clientName}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day View Dialog */}
      <Dialog open={dayViewDialogOpen} onOpenChange={setDayViewDialogOpen}>
        <DialogContent className="max-w-4xl bg-gray-50">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl text-gray-900">
                {selectedDayForDialog?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex items-center gap-1"
                >
                  <Home className="w-4 h-4" /> Home
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/clients")}
                  className="flex items-center gap-1"
                >
                  <Users className="w-4 h-4" /> Clients
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="duration" className="text-gray-700 font-medium">
                  Appointment Duration
                </Label>
                <Select value={selectedDuration} onValueChange={handleDurationChange} className="w-40">
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

              <Button
                onClick={() => router.push(`/day-view?date=${selectedDayForDialog?.toISOString().split("T")[0]}`)}
                className="bg-pink-400 hover:bg-pink-500 text-white rounded-full"
              >
                Open Full Day Planner
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {selectedDayForDialog &&
                Array.from({ length: 26 }, (_, i) => {
                  const hour = Math.floor(i / 2) + 8
                  const minute = (i % 2) * 30
                  const timeSlot = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

                  const dayAppointments = getAppointmentsForDate(selectedDayForDialog)
                  const slotAppointments = dayAppointments.filter((apt) => {
                    const [aptHour, aptMinute] = apt.time.split(":").map(Number)
                    const aptStart = aptHour * 60 + aptMinute
                    const slotTime = hour * 60 + minute
                    return aptStart <= slotTime && slotTime < aptStart + apt.duration
                  })

                  const isAvailable = isTimeSlotAvailable(selectedDayForDialog, timeSlot, selectedDuration)

                  return (
                    <div
                      key={timeSlot}
                      onClick={() => isAvailable && handleTimeSlotClick(selectedDayForDialog, timeSlot)}
                      className={`flex items-center gap-2 p-3 bg-white rounded-lg border ${
                        isAvailable ? "cursor-pointer hover:bg-gray-50" : "opacity-75"
                      }`}
                    >
                      <div className="w-16 text-sm font-medium text-gray-600">{timeSlot}</div>
                      <div className="flex-1">
                        {slotAppointments.length > 0 ? (
                          <div className="space-y-1">
                            {slotAppointments.map((apt) => (
                              <div key={apt.id} className="text-sm bg-green-100 text-green-800 p-2 rounded-lg">
                                {apt.time} - {apt.clientName} ({apt.duration}min)
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            {isAvailable ? "Available - Click to book" : "Unavailable"}
                          </div>
                        )}
                      </div>
                      {isAvailable && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTimeSlotClick(selectedDayForDialog, timeSlot)
                          }}
                          className="bg-pink-400 hover:bg-pink-500 text-white rounded-full"
                        >
                          Book
                        </Button>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
