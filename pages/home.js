import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Content for home goes here.</p>
      <Link href="/">← Back to Home</Link>
    </div>
  );
}
