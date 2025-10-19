import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JSON Converter - Free Online Tool | Convert JSON to CSV, XML, YAML, Excel',
  description: 'Convert JSON to CSV, XML, YAML, SQL, Excel and more. Fast, free, handles large files. Developer-friendly JSON tools. No signup required.',
  keywords: 'json converter, json to csv, json to xml, json to yaml, json to sql, json formatter, json validator, csv to json',
  openGraph: {
    title: 'JSON Converter - Free Online Tool | Convert JSON to CSV, XML, YAML, Excel',
    description: 'Convert JSON to CSV, XML, YAML, SQL, Excel and more. Fast, free, handles large files.',
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

