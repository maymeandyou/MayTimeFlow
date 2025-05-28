"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { useState, useEffect } from "react"
import { Plus, Search, List, Grid, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { storage } from "@/lib/storage"
import type { Client } from "@/types"
import { Badge } from "@/components/ui/badge"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortField, setSortField] = useState<"surname" | "name" | "email">("surname")

  const router = useRouter()

  useEffect(() => {
    const existingClients = storage.clients.getAll()

    // Add sample clients if none exist
    if (existingClients.length === 0) {
      const sampleClients: Client[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 123-4567",
          preferences: {
            frequency: "biweekly",
            preferredDay: "friday",
            preferredTime: "14:00",
            notes: "Prefers afternoon appointments, allergic to lavender oils",
          },
          createdAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          name: "Michael Chen",
          email: "m.chen@email.com",
          phone: "+1 (555) 987-6543",
          preferences: {
            frequency: "weekly",
            preferredDay: "tuesday",
            preferredTime: "10:30",
            notes: "Early morning preferred, works from home",
          },
          createdAt: new Date("2024-02-03"),
        },
        {
          id: "3",
          name: "Emma Rodriguez",
          email: "emma.r@email.com",
          phone: "+1 (555) 456-7890",
          preferences: {
            frequency: "monthly",
            preferredDay: "saturday",
            preferredTime: "11:00",
            notes: "Weekend appointments only, travels frequently for work",
          },
          createdAt: new Date("2024-01-28"),
        },
        {
          id: "4",
          name: "David Thompson",
          email: "david.thompson@email.com",
          phone: "+1 (555) 234-5678",
          preferences: {
            frequency: "biweekly",
            preferredDay: "wednesday",
            preferredTime: "16:30",
            notes: "Prefers late afternoon, has chronic back pain",
          },
          createdAt: new Date("2024-02-10"),
        },
      ]

      sampleClients.forEach((client) => storage.clients.add(client))
      setClients(storage.clients.getAll())
    } else {
      setClients(existingClients)
    }
  }, [])

  const getSurname = (fullName: string) => {
    const parts = fullName.trim().split(" ")
    return parts.length > 1 ? parts[parts.length - 1] : fullName
  }

  const sortedClients = [...clients].sort((a, b) => {
    if (sortField === "surname") {
      return getSurname(a.name).localeCompare(getSurname(b.name))
    } else if (sortField === "email") {
      return a.email.localeCompare(b.email)
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  const filteredClients = sortedClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const clientData: Client = {
      id: editingClient?.id || Date.now().toString(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      preferences: {
        frequency: formData.get("frequency") as "weekly" | "biweekly" | "monthly" | "custom",
        preferredDay: formData.get("preferredDay") as string,
        preferredTime: formData.get("preferredTime") as string,
        notes: formData.get("notes") as string,
      },
      createdAt: editingClient?.createdAt || new Date(),
    }

    if (editingClient) {
      storage.clients.update(editingClient.id, clientData)
    } else {
      storage.clients.add(clientData)
    }

    setClients(storage.clients.getAll())
    setIsDialogOpen(false)
    setEditingClient(null)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      storage.clients.delete(id)
      setClients(storage.clients.getAll())
    }
  }

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      weekly: "bg-sage-100 text-sage-800",
      biweekly: "bg-pink-100 text-pink-800",
      monthly: "bg-purple-100 text-purple-800",
      custom: "bg-gray-100 text-gray-800",
    }
    return colors[frequency as keyof typeof colors] || colors.custom
  }

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
              <CardTitle className="text-2xl">Clients</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-sage-500 hover:bg-sage-600 text-white rounded-full"
                        : "hover:bg-gray-200 rounded-full"
                    }
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-sage-500 hover:bg-sage-600 text-white rounded-full"
                        : "hover:bg-gray-200 rounded-full"
                    }
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingClient(null)}
                      className="bg-pink-400 hover:bg-pink-500 text-white rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-gray-50">
                    <DialogHeader>
                      <CardTitle className="text-2xl text-center text-gray-900 mb-2">
                        {editingClient ? "Edit Client" : "Client Information Form"}
                      </CardTitle>
                      <p className="text-center text-gray-600">
                        {editingClient
                          ? "Update client information and preferences"
                          : "Please fill out your information and preferences"}
                      </p>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-gray-700 font-medium">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={editingClient?.name}
                            required
                            className="rounded-full border-gray-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={editingClient?.email}
                            required
                            className="rounded-full border-gray-300"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          defaultValue={editingClient?.phone}
                          required
                          className="rounded-full border-gray-300"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="frequency" className="text-gray-700 font-medium">
                            How often would you like appointments?
                          </Label>
                          <Select name="frequency" defaultValue={editingClient?.preferences.frequency || "biweekly"}>
                            <SelectTrigger className="rounded-full border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="preferredDay" className="text-gray-700 font-medium">
                            Preferred Day of Week
                          </Label>
                          <Select
                            name="preferredDay"
                            defaultValue={editingClient?.preferences.preferredDay || "friday"}
                          >
                            <SelectTrigger className="rounded-full border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">Wednesday</SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                              <SelectItem value="saturday">Saturday</SelectItem>
                              <SelectItem value="sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="preferredTime" className="text-gray-700 font-medium">
                          Preferred Time
                        </Label>
                        <Input
                          id="preferredTime"
                          name="preferredTime"
                          type="time"
                          defaultValue={editingClient?.preferences.preferredTime}
                          className="rounded-full border-gray-300 [&::-webkit-calendar-picker-indicator]:bg-pink-400 [&::-webkit-time-picker-indicator]:text-pink-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes" className="text-gray-700 font-medium">
                          Additional Notes or Preferences
                        </Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          defaultValue={editingClient?.preferences.notes}
                          placeholder="Any specific requests, health considerations, or scheduling preferences..."
                          rows={4}
                          className="rounded-lg border-gray-300"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600 text-white rounded-full">
                        {editingClient ? "Update Client" : "Save Information"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="sortField" className="whitespace-nowrap text-sm">
                  Sort by:
                </Label>
                <Select value={sortField} onValueChange={(value) => setSortField(value as any)}>
                  <SelectTrigger className="w-32 rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surname">Surname</SelectItem>
                    <SelectItem value="name">Full Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client) => (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          <p className="text-sm text-gray-600">{client.email}</p>
                          <p className="text-sm text-gray-600">{client.phone}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(client)} className="rounded-full">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                            className="rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Badge className={`${getFrequencyBadge(client.preferences.frequency)} rounded-full`}>
                          {client.preferences.frequency}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          <p>
                            Prefers: {client.preferences.preferredDay}s at {client.preferences.preferredTime}
                          </p>
                          {client.preferences.notes && <p className="mt-1 italic">"{client.preferences.notes}"</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredClients.map((client) => (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <p className="text-sm text-gray-600">
                              {client.email} • {client.phone}
                            </p>
                          </div>
                          <Badge className={`${getFrequencyBadge(client.preferences.frequency)} rounded-full`}>
                            {client.preferences.frequency}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            {client.preferences.preferredDay}s at {client.preferences.preferredTime}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(client)} className="rounded-full">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                            className="rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No clients found matching your search."
                  : "No clients yet. Add your first client to get started!"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
