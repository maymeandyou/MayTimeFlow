"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Share, Eye, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function QRIntakePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [formTitle, setFormTitle] = useState("New Client Intake")

  const generateQRCode = () => {
    // In a real app, this would generate a unique URL
    const uniqueId = Math.random().toString(36).substr(2, 9)
    const url = `${window.location.origin}/intake/${uniqueId}`
    setQrCodeUrl(url)
  }

  const pendingSubmissions = [
    {
      id: 1,
      name: "Alex Rodriguez",
      submittedAt: "2024-01-20 3:45 PM",
      timezone: "EST",
      preferredDays: ["Monday", "Wednesday"],
      preferredTimes: ["Evening"],
      services: ["Deep Tissue Massage"],
      status: "Needs Review",
    },
    {
      id: 2,
      name: "Lisa Park",
      submittedAt: "2024-01-19 11:20 AM",
      timezone: "PST",
      preferredDays: ["Friday", "Saturday"],
      preferredTimes: ["Morning"],
      services: ["Relaxation Massage", "Hot Stone"],
      status: "Needs Review",
    },
  ]

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">QR Code Intake</h1>
        <p className="text-muted-foreground">Generate QR codes for new client intake forms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Intake QR Code</CardTitle>
            <CardDescription>Create a QR code that clients can scan to fill out their intake form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-title">Form Title</Label>
              <Input
                id="form-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="New Client Intake"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Available Services</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select services to include" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="massage">Massage Only</SelectItem>
                  <SelectItem value="beauty">Beauty Services</SelectItem>
                  <SelectItem value="coaching">Coaching Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-questions">Custom Questions</Label>
              <Textarea id="custom-questions" placeholder="Add any custom questions for your intake form..." rows={3} />
            </div>

            <Button onClick={generateQRCode} className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>

            {qrCodeUrl && (
              <div className="mt-6 p-4 border rounded-lg text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-6xl">📱</div>
                </div>
                <p className="text-sm text-muted-foreground">QR Code generated successfully!</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground break-all">{qrCodeUrl}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Submissions</CardTitle>
            <CardDescription>New client intake forms waiting for your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{submission.name}</h3>
                    <Badge variant="secondary">{submission.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Timezone</p>
                      <p>{submission.timezone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Preferred Days</p>
                      <p>{submission.preferredDays.join(", ")}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground">Interested Services</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {submission.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {submission.submittedAt}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                      <Button size="sm">Accept</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use QR Code Intake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <h3 className="font-medium">Generate QR Code</h3>
              <p className="text-muted-foreground">Create a custom intake form and generate a unique QR code</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <h3 className="font-medium">Share with Clients</h3>
              <p className="text-muted-foreground">Print the QR code or share via WhatsApp, email, or social media</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <h3 className="font-medium">Review & Accept</h3>
              <p className="text-muted-foreground">Review submissions and convert them into active client profiles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
