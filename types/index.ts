export interface Client {
  id: string
  name: string
  email: string
  phone: string
  preferences: {
    frequency: "weekly" | "biweekly" | "monthly" | "custom"
    preferredDay: string
    preferredTime: string
    notes: string
  }
  createdAt: Date
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  date: Date
  time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
}

export interface Holiday {
  date: string
  name: string
  country: string
}
