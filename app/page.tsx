import Link from "next/link"
import { Calendar, Users, QrCode, CalendarDays, Settings, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const navigationTiles = [
    {
      title: "Calendar",
      description: "View and manage appointments",
      icon: Calendar,
      href: "/calendar",
      color: "bg-blue-500",
    },
    {
      title: "Clients",
      description: "Manage client information",
      icon: Users,
      href: "/clients",
      color: "bg-green-500",
    },
    {
      title: "QR Intake",
      description: "Client intake form",
      icon: QrCode,
      href: "/intake",
      color: "bg-purple-500",
    },
    {
      title: "Yearly Planning",
      description: "Auto-schedule sessions",
      icon: CalendarDays,
      href: "/planning",
      color: "bg-orange-500",
    },
    {
      title: "Analytics",
      description: "View business insights",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-pink-500",
    },
    {
      title: "Settings",
      description: "App preferences",
      icon: Settings,
      href: "/settings",
      color: "bg-gray-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MayTimeFlow</h1>
          <p className="text-gray-600">Appointment Management for Service Providers</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationTiles.map((tile) => {
            const Icon = tile.icon
            return (
              <Link key={tile.title} href={tile.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${tile.color} rounded-lg flex items-center justify-center mb-4`}>
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
