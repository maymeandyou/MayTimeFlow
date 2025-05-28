import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to MayTimeFlow</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Link href="/calendar">🗓 Calendar</Link>
        <Link href="/clients">👤 Clients</Link>
        <Link href="/appointments">📋 Appointments</Link>
      </div>
    </div>
  );
}
