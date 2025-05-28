'use client';

import { useEffect, useState } from 'react';

type Client = {
  id: number;
  name: string;
  email: string;
};

type Appointment = {
  id: number;
  clientId: number;
  date: string;
  time: string;
  completed: boolean;
};

export default function AnalyticsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClients = localStorage.getItem('clients');
      const storedAppointments = localStorage.getItem('appointments');

      if (storedClients) {
        setClients(JSON.parse(storedClients));
      }
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    }
  }, []);

  const completedAppointments = appointments.filter(app => app.completed).length;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <p>Total Clients: {clients.length}</p>
      <p>Total Appointments: {appointments.length}</p>
      <p>Completed Appointments: {completedAppointments}</p>
    </main>
  );
}
