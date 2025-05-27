"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, Clock, Phone, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const clients = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      timezone: "EST",
      frequency: "Weekly",
      preferredDays: ["Tuesday", "Thursday"],
      preferredTimes: ["2:00 PM", "4:00 PM"],
      lastVisit: "2024-01-15",
      nextAppointment: "2024-01-22",
      status: "Active",
      notes: "Prefers deep tissue massage. Avoid pressure on lower back.",
      totalSessions: 24,
      favoriteService: "Deep Tissue Massage",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 987-6543",
      timezone: "PST",
      frequency: "Bi-weekly",
      preferredDays: ["Monday", "Wednesday"],
      preferredTimes: ["6:00 PM", "7:00 PM"],
      lastVisit: "2024-01-10",
      nextAppointment: "2024-01-24",
      status: "Active",
      notes: "Athlete - focus on sports massage techniques.",
      totalSessions: 18,
      favoriteService: "Sports Massage",
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.w@email.com",
      phone: "+1 (555) 456-7890",
      timezone: "CST",
      frequency: "Monthly",
      preferredDays: ["Friday", "Saturday"],
      preferredTimes: ["10:00 AM", "11:00 AM"],
      lastVisit: "2023-12-20",
      nextAppointment: null,
      status: "Needs Review",
      notes: "New client - still determining preferences.",
      totalSessions: 3,
      favoriteService: "Relaxation Massage",
    },
  ]

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and preferences</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client profile with their preferences and contact information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter client name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="client@email.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Visit Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="How often do they visit?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Any special preferences or notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Client</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Client List */}
      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={client.status === "Active" ? "default" : "secondary"}>{client.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Frequency</p>
                  <p>{client.frequency}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Preferred Days</p>
                  <p>{client.preferredDays.join(", ")}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Total Sessions</p>
                  <p>{client.totalSessions}</p>
                </div>
              </div>
              {client.notes && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm">{client.notes}</p>
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last visit: {client.lastVisit}
                </div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
