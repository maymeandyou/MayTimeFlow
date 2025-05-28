"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage } from "@/lib/storage"
import { isHoliday, getHolidayName } from "@/lib/holidays"
import type { Appointment } from "@/types"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"week" | "month">("month")
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    setAppointments(storage.appointments.getAll())
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

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => apt.date.toDateString() === date.toDateString())
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    }
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    if (view === "month") {
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else {
      const endOfWeek = new Date(date)
      endOfWeek.setDate(date.getDate() + 6)
      return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    }
  }

  const days = view === "month" ? getDaysInMonth(currentDate) : getWeekDays(currentDate)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
                  Month
                </Button>
                <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
                  Week
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
                <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`grid ${view === "month" ? "grid-cols-7" : "grid-cols-7"} gap-1`}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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

                return (
                  <div
                    key={index}
                    className={`p-2 h-24 border border-gray-200 ${
                      isToday ? "bg-blue-50 border-blue-300" : ""
                    } ${isHolidayDay ? "bg-red-50" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm ${isToday ? "font-bold text-blue-600" : ""}`}>{day.getDate()}</span>
                      {isHolidayDay && (
                        <Badge variant="destructive" className="text-xs">
                          Holiday
                        </Badge>
                      )}
                    </div>
                    {holidayName && <div className="text-xs text-red-600 mb-1">{holidayName}</div>}
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div key={apt.id} className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate">
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
    </div>
  )
}
