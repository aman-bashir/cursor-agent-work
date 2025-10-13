import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Ai Prompt Library', description: 'Ai Prompt Library built with Next.js' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}

