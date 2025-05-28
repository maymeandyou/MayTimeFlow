"use client"

import { useState, useEffect } from "react"
import { Settings, Globe, Clock, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [country, setCountry] = useState("US")
  const [timezone, setTimezone] = useState("America/New_York")
  const [notifications, setNotifications] = useState(true)
  const [defaultDuration, setDefaultDuration] = useState("60")
  const [customDuration, setCustomDuration] = useState("")
  const [bufferTime, setBufferTime] = useState("15")
  const [hourlyRate, setHourlyRate] = useState("80")

  const router = useRouter()

  useEffect(() => {
    // Load existing settings
    const savedSettings = localStorage.getItem("settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setCountry(settings.country || "US")
      setTimezone(settings.timezone || "America/New_York")
      setNotifications(settings.notifications !== false)
      setDefaultDuration(settings.defaultDuration || "60")
      setCustomDuration(settings.customDuration || "")
      setBufferTime(settings.bufferTime || "15")
      setHourlyRate(settings.hourlyRate || "80")
    }
  }, [])

  const countryTimezones = {
    // North America
    US: [
      { value: "America/New_York", label: "Eastern Time (EST/EDT)" },
      { value: "America/Chicago", label: "Central Time (CST/CDT)" },
      { value: "America/Denver", label: "Mountain Time (MST/MDT)" },
      { value: "America/Los_Angeles", label: "Pacific Time (PST/PDT)" },
      { value: "America/Anchorage", label: "Alaska Time (AKST/AKDT)" },
      { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
    ],
    CA: [
      { value: "America/Toronto", label: "Eastern Time (EST/EDT)" },
      { value: "America/Winnipeg", label: "Central Time (CST/CDT)" },
      { value: "America/Edmonton", label: "Mountain Time (MST/MDT)" },
      { value: "America/Vancouver", label: "Pacific Time (PST/PDT)" },
    ],
    // Europe
    DE: [{ value: "Europe/Berlin", label: "Central European Time (CET/CEST)" }],
    FR: [{ value: "Europe/Paris", label: "Central European Time (CET/CEST)" }],
    IT: [{ value: "Europe/Rome", label: "Central European Time (CET/CEST)" }],
    ES: [{ value: "Europe/Madrid", label: "Central European Time (CET/CEST)" }],
    NL: [{ value: "Europe/Amsterdam", label: "Central European Time (CET/CEST)" }],
    BE: [{ value: "Europe/Brussels", label: "Central European Time (CET/CEST)" }],
    AT: [{ value: "Europe/Vienna", label: "Central European Time (CET/CEST)" }],
    CH: [{ value: "Europe/Zurich", label: "Central European Time (CET/CEST)" }],
    UK: [{ value: "Europe/London", label: "Greenwich Mean Time (GMT/BST)" }],
    IE: [{ value: "Europe/Dublin", label: "Greenwich Mean Time (GMT/IST)" }],
    PT: [{ value: "Europe/Lisbon", label: "Western European Time (WET/WEST)" }],
    GR: [{ value: "Europe/Athens", label: "Eastern European Time (EET/EEST)" }],
    CY: [{ value: "Asia/Nicosia", label: "Eastern European Time (EET/EEST)" }],
    FI: [{ value: "Europe/Helsinki", label: "Eastern European Time (EET/EEST)" }],
    EE: [{ value: "Europe/Tallinn", label: "Eastern European Time (EET/EEST)" }],
    LV: [{ value: "Europe/Riga", label: "Eastern European Time (EET/EEST)" }],
    LT: [{ value: "Europe/Vilnius", label: "Eastern European Time (EET/EEST)" }],
    PL: [{ value: "Europe/Warsaw", label: "Central European Time (CET/CEST)" }],
    CZ: [{ value: "Europe/Prague", label: "Central European Time (CET/CEST)" }],
    SK: [{ value: "Europe/Bratislava", label: "Central European Time (CET/CEST)" }],
    HU: [{ value: "Europe/Budapest", label: "Central European Time (CET/CEST)" }],
    SI: [{ value: "Europe/Ljubljana", label: "Central European Time (CET/CEST)" }],
    HR: [{ value: "Europe/Zagreb", label: "Central European Time (CET/CEST)" }],
    RO: [{ value: "Europe/Bucharest", label: "Eastern European Time (EET/EEST)" }],
    BG: [{ value: "Europe/Sofia", label: "Eastern European Time (EET/EEST)" }],
    SE: [{ value: "Europe/Stockholm", label: "Central European Time (CET/CEST)" }],
    NO: [{ value: "Europe/Oslo", label: "Central European Time (CET/CEST)" }],
    DK: [{ value: "Europe/Copenhagen", label: "Central European Time (CET/CEST)" }],
    IS: [{ value: "Atlantic/Reykjavik", label: "Greenwich Mean Time (GMT)" }],
    LU: [{ value: "Europe/Luxembourg", label: "Central European Time (CET/CEST)" }],
    MT: [{ value: "Europe/Malta", label: "Central European Time (CET/CEST)" }],
    // Oceania
    AU: [
      { value: "Australia/Sydney", label: "Australian Eastern Time (AEST/AEDT)" },
      { value: "Australia/Melbourne", label: "Australian Eastern Time (AEST/AEDT)" },
      { value: "Australia/Brisbane", label: "Australian Eastern Time (AEST)" },
      { value: "Australia/Adelaide", label: "Australian Central Time (ACST/ACDT)" },
      { value: "Australia/Perth", label: "Australian Western Time (AWST)" },
    ],
  }

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry)
    // Auto-select first timezone for the country
    const timezones = countryTimezones[newCountry as keyof typeof countryTimezones]
    if (timezones && timezones.length > 0) {
      setTimezone(timezones[0].value)
    }
  }

  const handleSave = () => {
    const settings = {
      country,
      timezone,
      notifications,
      defaultDuration: defaultDuration === "custom" ? customDuration : defaultDuration,
      customDuration,
      bufferTime,
      hourlyRate,
      savedAt: new Date().toISOString(),
    }

    localStorage.setItem("settings", JSON.stringify(settings))

    // Show success message
    alert("Settings saved successfully!")

    // Optionally redirect back to home
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  const availableTimezones = countryTimezones[country as keyof typeof countryTimezones] || []

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
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
            <CardTitle className="text-2xl flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Settings
            </CardTitle>
            <p className="text-gray-600">Configure your app preferences</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Regional Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="country">Country (automatically loads public holidays into calendar)</Label>
                  <Select value={country} onValueChange={handleCountryChange}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AT">Austria</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="BE">Belgium</SelectItem>
                      <SelectItem value="BG">Bulgaria</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="CH">Switzerland</SelectItem>
                      <SelectItem value="HR">Croatia</SelectItem>
                      <SelectItem value="CY">Cyprus</SelectItem>
                      <SelectItem value="CZ">Czech Republic</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="DK">Denmark</SelectItem>
                      <SelectItem value="EE">Estonia</SelectItem>
                      <SelectItem value="ES">Spain</SelectItem>
                      <SelectItem value="FI">Finland</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="GR">Greece</SelectItem>
                      <SelectItem value="HU">Hungary</SelectItem>
                      <SelectItem value="IE">Ireland</SelectItem>
                      <SelectItem value="IS">Iceland</SelectItem>
                      <SelectItem value="IT">Italy</SelectItem>
                      <SelectItem value="LT">Lithuania</SelectItem>
                      <SelectItem value="LU">Luxembourg</SelectItem>
                      <SelectItem value="LV">Latvia</SelectItem>
                      <SelectItem value="MT">Malta</SelectItem>
                      <SelectItem value="NL">Netherlands</SelectItem>
                      <SelectItem value="NO">Norway</SelectItem>
                      <SelectItem value="PL">Poland</SelectItem>
                      <SelectItem value="PT">Portugal</SelectItem>
                      <SelectItem value="RO">Romania</SelectItem>
                      <SelectItem value="SE">Sweden</SelectItem>
                      <SelectItem value="SI">Slovenia</SelectItem>
                      <SelectItem value="SK">Slovakia</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Appointment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="defaultDuration">Default Appointment Duration</Label>
                  <Select value={defaultDuration} onValueChange={setDefaultDuration}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="custom">Custom duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {defaultDuration === "custom" && (
                  <div>
                    <Label htmlFor="customDuration">Custom Duration (minutes)</Label>
                    <Input
                      id="customDuration"
                      type="number"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      placeholder="Enter duration in minutes"
                      min="15"
                      max="240"
                      step="15"
                      className="rounded-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bufferTime">Buffer Time Between Appointments (minutes)</Label>
                  <Input
                    id="bufferTime"
                    type="number"
                    value={bufferTime}
                    onChange={(e) => setBufferTime(e.target.value)}
                    placeholder="15"
                    min="0"
                    max="60"
                    step="5"
                    className="rounded-full"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Time needed for preparation and cleanup between appointments
                  </p>
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="80"
                    min="0"
                    step="5"
                    className="rounded-full"
                  />
                  <p className="text-sm text-gray-600 mt-1">Used for revenue calculations in analytics</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                  </div>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full bg-sage-500 hover:bg-sage-600 text-white rounded-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
