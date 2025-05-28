"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Calendar,
  Users,
  QrCode,
  CalendarDays,
  Settings,
  BarChart3,
  FileText,
  Clock,
  Sun,
  Moon,
  Sunrise,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return { text: "Good Morning!", icon: Sunrise, color: "bg-yellow-500" }
    if (hour < 17) return { text: "Good Afternoon!", icon: Sun, color: "bg-orange-500" }
    return { text: "Good Evening!", icon: Moon, color: "bg-indigo-500" }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const navigationTiles = [
    {
      title: "Calendar",
      description: "View and manage appointments",
      icon: Calendar,
      href: "/calendar",
      color: "bg-sage-500",
    },
    {
      title: "Clients",
      description: "Manage client information",
      icon: Users,
      href: "/clients",
      color: "bg-pink-500",
    },
    {
      title: "QR Intake",
      description: "Client intake form",
      icon: QrCode,
      href: "/intake",
      color: "bg-sage-400",
    },
    {
      title: "Yearly Planning",
      description: "Auto-schedule sessions",
      icon: CalendarDays,
      href: "/planning",
      color: "bg-pink-400",
    },
    {
      title: "Client Schedules",
      description: "Generate & share schedules",
      icon: FileText,
      href: "/client-schedules",
      color: "bg-sage-600",
    },
    {
      title: "Analytics",
      description: "View business insights",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-pink-600",
    },
    {
      title: "Settings",
      description: "App preferences",
      icon: Settings,
      href: "/settings",
      color: "bg-sage-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MayTimeFlow</h1>
          <p className="text-gray-600">Appointment Management for Service Providers</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Time and Date Tile */}
          <Card className="md:col-span-2 bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-sage-600" />
                <h3 className="text-xl font-semibold text-sage-900">Current Time</h3>
              </div>
              <div className="text-3xl font-bold text-sage-800 mb-1">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-lg text-sage-700">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </CardContent>
          </Card>

          {/* Greeting Tile */}
          <Card className="md:col-span-2 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <GreetingIcon className="w-6 h-6 text-pink-600" />
                <h3 className="text-xl font-semibold text-pink-900">{greeting.text}</h3>
              </div>
              <p className="text-pink-700 text-lg">Ready to manage your appointments?</p>
              <p className="text-pink-600 text-sm mt-2">"Success is where preparation and opportunity meet."</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationTiles.map((tile) => {
            const Icon = tile.icon
            return (
              <Link key={tile.title} href={tile.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full hover:scale-105">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${tile.color} rounded-full flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{tile.title}</h3>
                    <p className="text-gray-600">{tile.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
