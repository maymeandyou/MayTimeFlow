"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storage } from "@/lib/storage"
import type { Client } from "@/types"

export default function IntakePage() {
  const [showForm, setShowForm] = useState(false)
  const [qrUrl, setQrUrl] = useState("")

  useEffect(() => {
    // In a real app, this would be your actual domain
    const baseUrl = window.location.origin
    setQrUrl(`${baseUrl}/intake?form=true`)
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("form") === "true") {
      setShowForm(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const clientData: Client = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      preferences: {
        frequency: formData.get("frequency") as "weekly" | "biweekly" | "monthly" | "custom",
        preferredDay: formData.get("preferredDay") as string,
        preferredTime: formData.get("preferredTime") as string,
        notes: formData.get("notes") as string,
      },
      createdAt: new Date(),
    }

    storage.clients.add(clientData)
    alert("Thank you! Your information has been submitted successfully.")

    // Reset form
    e.currentTarget.reset()
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Client Intake Form</CardTitle>
              <p className="text-center text-gray-600">Please fill out your information and preferences</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency">How often would you like appointments?</Label>
                    <Select name="frequency" defaultValue="biweekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">I'll discuss this</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="preferredDay">Preferred Day of Week</Label>
                    <Select name="preferredDay" defaultValue="friday">
                      <SelectTrigger>
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
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input id="preferredTime" name="preferredTime" type="time" />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes or Preferences</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any specific requests, health considerations, or scheduling preferences..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Information
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">QR Code Client Intake</CardTitle>
            <p className="text-center text-gray-600">
              Share this QR code with new clients to collect their information
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <QRCodeSVG value={qrUrl} size={256} level="M" includeMargin={true} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How to use:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                        1
                      </div>
                      <h4 className="font-semibold mb-2">Share QR Code</h4>
                      <p className="text-sm text-gray-600">
                        Display this QR code in your office or send it to new clients
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                        2
                      </div>
                      <h4 className="font-semibold mb-2">Client Scans</h4>
                      <p className="text-sm text-gray-600">
                        Clients scan with their phone camera to open the intake form
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                        3
                      </div>
                      <h4 className="font-semibold mb-2">Auto-Added</h4>
                      <p className="text-sm text-gray-600">
                        Client information is automatically added to your client list
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={() => setShowForm(true)} variant="outline">
                Preview Intake Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
