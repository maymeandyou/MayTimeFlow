import type { Client, Appointment } from "@/types"

export const storage = {
  clients: {
    getAll: (): Client[] => {
      if (typeof window === "undefined") return []
      const data = localStorage.getItem("clients")
      return data ? JSON.parse(data) : []
    },
    save: (clients: Client[]) => {
      if (typeof window === "undefined") return
      localStorage.setItem("clients", JSON.stringify(clients))
    },
    add: (client: Client) => {
      const clients = storage.clients.getAll()
      clients.push(client)
      storage.clients.save(clients)
    },
    update: (id: string, updates: Partial<Client>) => {
      const clients = storage.clients.getAll()
      const index = clients.findIndex((c) => c.id === id)
      if (index !== -1) {
        clients[index] = { ...clients[index], ...updates }
        storage.clients.save(clients)
      }
    },
    delete: (id: string) => {
      const clients = storage.clients.getAll().filter((c) => c.id !== id)
      storage.clients.save(clients)
    },
  },
  appointments: {
    getAll: (): Appointment[] => {
      if (typeof window === "undefined") return []
      const data = localStorage.getItem("appointments")
      return data
        ? JSON.parse(data).map((apt: any) => ({
            ...apt,
            date: new Date(apt.date),
          }))
        : []
    },
    save: (appointments: Appointment[]) => {
      if (typeof window === "undefined") return
      localStorage.setItem("appointments", JSON.stringify(appointments))
    },
    add: (appointment: Appointment) => {
      const appointments = storage.appointments.getAll()
      appointments.push(appointment)
      storage.appointments.save(appointments)
    },
    update: (id: string, updates: Partial<Appointment>) => {
      const appointments = storage.appointments.getAll()
      const index = appointments.findIndex((a) => a.id === id)
      if (index !== -1) {
        appointments[index] = { ...appointments[index], ...updates }
        storage.appointments.save(appointments)
      }
    },
    delete: (id: string) => {
      const appointments = storage.appointments.getAll().filter((a) => a.id !== id)
      storage.appointments.save(appointments)
    },
  },
}
