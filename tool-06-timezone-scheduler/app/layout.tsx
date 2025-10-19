import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Time Zone Meeting Scheduler | Find Best Meeting Times Across Zones',
  description: 'Schedule meetings across time zones easily. Visual time zone converter with shareable links. Find overlapping hours. Free tool for remote teams.',
  keywords: 'time zone converter, meeting scheduler, timezone meeting planner, global meeting time, timezone calculator, remote work',
  openGraph: {
    title: 'Time Zone Meeting Scheduler | Find Best Meeting Times Across Zones',
    description: 'Schedule meetings across time zones easily. Visual time zone converter with shareable links.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}

