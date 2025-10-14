import { Metadata } from 'next'
import PasswordGenerator from '@/components/PasswordGenerator'
import PasswordChecker from '@/components/PasswordChecker'
import SecurityTips from '@/components/SecurityTips'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: 'Free Password Generator & Strength Checker - Secure & Private',
  description: 'Generate strong passwords instantly. 100% client-side, privacy-focused password generator and strength checker. No data sent to servers.',
  keywords: 'password generator, password strength checker, secure passwords, random password, password security',
  openGraph: {
    title: 'Free Password Generator & Strength Checker - Secure & Private',
    description: 'Generate strong passwords instantly. 100% client-side, privacy-focused.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Password Generator &{' '}
            <span className="text-blue-600 dark:text-blue-400">Strength Checker</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Generate secure passwords instantly. Check password strength. 
            <span className="font-semibold text-green-600 dark:text-green-400"> 100% client-side</span> - your data never leaves your device.
          </p>
        </div>

        {/* Main Tools */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <PasswordGenerator />
          <PasswordChecker />
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Generate</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Customize password options and generate secure passwords instantly
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Copy</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                One-click copy to clipboard with visual confirmation
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Secure</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Use strong, unique passwords for all your accounts
              </p>
            </div>
          </div>
        </div>

        {/* Why Strong Passwords Matter */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Why Strong Passwords Matter</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">The Reality of Data Breaches</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• 83% of data breaches involve weak or stolen passwords</li>
                <li>• 51% of people reuse passwords across multiple accounts</li>
                <li>• Average person has 100+ online accounts</li>
                <li>• Hackers can crack weak passwords in seconds</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Strong Password Benefits</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Takes years to crack with brute force</li>
                <li>• Protects against dictionary attacks</li>
                <li>• Reduces risk of account takeover</li>
                <li>• Gives you peace of mind</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <SecurityTips />

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is this tool secure?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! This tool is 100% client-side. Your passwords are generated and checked entirely in your browser. 
                No data is sent to any servers, ensuring complete privacy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What makes a strong password?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                A strong password should be at least 12 characters long, include uppercase and lowercase letters, 
                numbers, and symbols. It should be unique and not contain personal information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How often should I change my passwords?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Use unique, strong passwords for each account. Only change them if you suspect a breach or 
                if the account has been compromised. Focus on creating strong, unique passwords rather than frequent changes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I use the same password for multiple accounts?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Never! Each account should have a unique password. If one account is compromised, 
                all your other accounts would be at risk. Use a password manager to help you remember them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
