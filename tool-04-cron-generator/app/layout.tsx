import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cron Expression Generator & Explainer | Free Online Tool',
  description: 'Create and understand cron expressions easily. Visual builder, plain English explanations, next run times. Free crontab generator for developers.',
  keywords: 'cron generator, cron expression, crontab, schedule, task scheduler, cron explainer, cron builder, linux cron',
  openGraph: {
    title: 'Cron Expression Generator & Explainer | Free Online Tool',
    description: 'Create and understand cron expressions easily. Visual builder, plain English explanations, next run times.',
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

