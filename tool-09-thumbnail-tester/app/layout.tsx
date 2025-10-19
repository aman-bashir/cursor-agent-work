import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Tester | Compare & Test Thumbnails Before Upload',
  description: 'Test YouTube thumbnails side-by-side. Get CTR predictions, visual analysis, and choose the best thumbnail. Free tool for content creators.',
  keywords: 'youtube thumbnail tester, thumbnail comparison, youtube ctr, thumbnail analyzer, youtube thumbnail checker, thumbnail ab test',
  openGraph: {
    title: 'YouTube Thumbnail Tester | Compare & Test Thumbnails Before Upload',
    description: 'Test YouTube thumbnails side-by-side. Get CTR predictions, visual analysis, and choose the best thumbnail.',
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