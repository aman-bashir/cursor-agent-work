import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Password Generator & Strength Checker - Secure & Private',
  description: 'Generate strong passwords instantly. 100% client-side, privacy-focused password generator and strength checker. No data sent to servers.',
  keywords: 'password generator, password strength checker, secure passwords, random password, password security, online password generator',
  authors: [{ name: 'Password Generator Tool' }],
  openGraph: {
    title: 'Free Password Generator & Strength Checker - Secure & Private',
    description: 'Generate strong passwords instantly. 100% client-side, privacy-focused.',
    type: 'website',
    siteName: 'Password Generator Tool',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Password Generator & Strength Checker - Secure & Private',
    description: 'Generate strong passwords instantly. 100% client-side, privacy-focused.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--toast-background)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
