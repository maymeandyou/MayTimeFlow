import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, TrendingUp, Plus } from "lucide-react"

export default function Dashboard() {
  const upcomingAppointments = [
    {
      id: 1,
      client: "Sarah Johnson",
      service: "Deep Tissue Massage",
      time: "2:00 PM",
      date: "Today",
      duration: "60 min",
    },
    {
      id: 2,
      client: "Mike Chen",
      service: "Sports Massage",
      time: "4:30 PM",
      date: "Today",
      duration: "90 min",
    },
    {
      id: 3,
      client: "Emma Wilson",
      service: "Relaxation Massage",
      time: "10:00 AM",
      date: "Tomorrow",
      duration: "60 min",
    },
  ]

  const stats = [
    {
      title: "Active Clients",
      value: "24",
      icon: Users,
      change: "+2 this week",
    },
    {
      title: "Hours Booked",
      value: "32.5",
      icon: Clock,
      change: "This week",
    },
    {
      title: "Next Available",
      value: "Thu 3PM",
      icon: Calendar,
      change: "2 days away",
    },
    {
      title: "Revenue",
      value: "$2,840",
      icon: TrendingUp,
      change: "+12% vs last week",
    },
  ]

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your schedule for the next 2 days</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{appointment.client}</h3>
                    <Badge variant="secondary">{appointment.duration}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{appointment.service}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointment.time}</p>
                  <p className="text-sm text-muted-foreground">{appointment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Smart Scheduler</CardTitle>
            <CardDescription>Get AI-powered scheduling suggestions</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Client Check-in</CardTitle>
            <CardDescription>Generate QR codes for new clients</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Report</CardTitle>
            <CardDescription>View your performance analytics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
