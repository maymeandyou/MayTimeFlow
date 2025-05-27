"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Deep Tissue Massage",
      duration: 60,
      price: 120,
      bufferTime: 15,
      category: "Massage",
      description: "Therapeutic massage targeting deep muscle layers",
      addOns: ["Hot stones (+$20)", "Aromatherapy (+$15)"],
      isActive: true,
    },
    {
      id: 2,
      name: "Sports Massage",
      duration: 90,
      price: 160,
      bufferTime: 15,
      category: "Massage",
      description: "Specialized massage for athletes and active individuals",
      addOns: ["Stretching session (+$30)"],
      isActive: true,
    },
    {
      id: 3,
      name: "Relaxation Massage",
      duration: 60,
      price: 100,
      bufferTime: 10,
      category: "Massage",
      description: "Gentle, soothing massage for stress relief",
      addOns: ["Hot stones (+$20)", "Aromatherapy (+$15)"],
      isActive: true,
    },
    {
      id: 4,
      name: "Life Coaching Session",
      duration: 60,
      price: 150,
      bufferTime: 5,
      category: "Coaching",
      description: "One-on-one personal development coaching",
      addOns: ["Follow-up email summary (+$25)"],
      isActive: true,
    },
  ])

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings, pricing, and scheduling</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Create a new service with pricing and scheduling details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input id="service-name" placeholder="e.g., Deep Tissue Massage" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="120" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="buffer">Buffer Time (minutes)</Label>
                  <Input id="buffer" type="number" placeholder="15" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="massage">Massage</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="coaching">Coaching</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your service..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="addons">Add-ons (one per line)</Label>
                <Textarea id="addons" placeholder="Hot stones (+$20)&#10;Aromatherapy (+$15)" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Service</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Categories */}
      <div className="grid gap-6">
        {["Massage", "Coaching"].map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category} Services
                <Badge variant="secondary">{services.filter((s) => s.category === category).length} services</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {services
                  .filter((service) => service.category === category)
                  .map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{service.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{service.duration} min</span>
                          {service.bufferTime > 0 && (
                            <span className="text-xs text-muted-foreground">(+{service.bufferTime} buffer)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">${service.price}</span>
                        </div>
                        <div>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>

                      {service.addOns.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Available Add-ons:</p>
                          <div className="flex flex-wrap gap-2">
                            {service.addOns.map((addon, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {addon}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
          <CardDescription>Analytics for your most popular services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium">Most Booked</h3>
              <p className="text-2xl font-bold text-blue-600">Deep Tissue</p>
              <p className="text-sm text-muted-foreground">42% of bookings</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium">Highest Revenue</h3>
              <p className="text-2xl font-bold text-green-600">Sports Massage</p>
              <p className="text-sm text-muted-foreground">$2,240 this month</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium">Best Add-on Rate</h3>
              <p className="text-2xl font-bold text-purple-600">Hot Stones</p>
              <p className="text-sm text-muted-foreground">68% uptake</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
