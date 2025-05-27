"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [viewFilter, setViewFilter] = useState("all")

  const appointments = [
    {
      id: 1,
      client: "Sarah Johnson",
      service: "Deep Tissue Massage",
      date: "2024-01-22",
      time: "14:00",
      duration: 60,
      status: "confirmed",
      color: "bg-blue-500",
    },
    {
      id: 2,
      client: "Mike Chen",
      service: "Sports Massage",
      date: "2024-01-22",
      time: "16:30",
      duration: 90,
      status: "confirmed",
      color: "bg-green-500",
    },
    {
      id: 3,
      client: "Emma Wilson",
      service: "Relaxation Massage",
      date: "2024-01-23",
      time: "10:00",
      duration: 60,
      status: "pending",
      color: "bg-yellow-500",
    },
    {
      id: 4,
      client: "Alex Rodriguez",
      service: "Life Coaching",
      date: "2024-01-24",
      time: "15:00",
      duration: 60,
      status: "confirmed",
      color: "bg-purple-500",
    },
  ]

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8 // Start from 8 AM
    return `${hour.toString().padStart(2, "0")}:00`
  })

  const weekDays = [
    { name: "Monday", date: "22", fullDate: "2024-01-22" },
    { name: "Tuesday", date: "23", fullDate: "2024-01-23" },
    { name: "Wednesday", date: "24", fullDate: "2024-01-24" },
    { name: "Thursday", date: "25", fullDate: "2024-01-25" },
    { name: "Friday", date: "26", fullDate: "2024-01-26" },
    { name: "Saturday", date: "27", fullDate: "2024-01-27" },
    { name: "Sunday", date: "28", fullDate: "2024-01-28" },
  ]

  const getAppointmentsForDay = (date: string) => {
    return appointments.filter((apt) => apt.date === date)
  }

  const getAppointmentAtTime = (date: string, time: string) => {
    return appointments.find((apt) => apt.date === date && apt.time === time.replace(":00", ":00"))
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your appointments and availability</p>
        </div>
        <div className="flex gap-2">
          <Select value={viewFilter} onValueChange={setViewFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="massage">Massage Only</SelectItem>
              <SelectItem value="coaching">Coaching Only</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Appointment
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h2 className="text-lg font-semibold">January 22-28, 2024</h2>
                <p className="text-sm text-muted-foreground">Week View</p>
              </div>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Today
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header with days */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 border-r bg-muted/50">
                  <span className="text-sm font-medium">Time</span>
                </div>
                {weekDays.map((day) => (
                  <div key={day.name} className="p-4 border-r text-center">
                    <div className="text-sm font-medium">{day.name}</div>
                    <div className="text-lg font-bold">{day.date}</div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b min-h-[80px]">
                  <div className="p-4 border-r bg-muted/50 flex items-center">
                    <span className="text-sm text-muted-foreground">{time}</span>
                  </div>
                  {weekDays.map((day) => {
                    const appointment = getAppointmentAtTime(day.fullDate, time)
                    return (
                      <div key={`${day.fullDate}-${time}`} className="border-r p-2 relative">
                        {appointment && (
                          <div className={`${appointment.color} text-white p-2 rounded text-xs`}>
                            <div className="font-medium">{appointment.client}</div>
                            <div className="opacity-90">{appointment.service}</div>
                            <div className="opacity-75">{appointment.duration}min</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Monday, January 22, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getAppointmentsForDay("2024-01-22").map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${appointment.color}`}></div>
                  <div>
                    <p className="font-medium">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointment.time}</p>
                  <p className="text-sm text-muted-foreground">{appointment.duration} min</p>
                </div>
                <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">6</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">8.5h</div>
            <div className="text-sm text-muted-foreground">Total Hours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">$920</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-muted-foreground">Utilization</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
