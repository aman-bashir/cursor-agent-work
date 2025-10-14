'use client'

import { Shield, Lock, Users, AlertTriangle } from 'lucide-react'

export default function SecurityTips() {
  const tips = [
    {
      icon: Lock,
      title: 'Use Unique Passwords',
      description: 'Never reuse passwords across different accounts. If one account is compromised, all your other accounts remain safe.',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Shield,
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security with 2FA. Even if your password is compromised, your account stays protected.',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      title: 'Use a Password Manager',
      description: 'Store all your passwords securely in a password manager. You only need to remember one master password.',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: AlertTriangle,
      title: 'Be Wary of Phishing',
      description: 'Never enter your password on suspicious websites. Always check the URL and look for HTTPS encryption.',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Security Best Practices</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {tips.map((tip, index) => {
          const Icon = tip.icon
          return (
            <div key={index} className="flex gap-4">
              <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700`}>
                <Icon className={`w-6 h-6 ${tip.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{tip.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{tip.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Password Manager Recommendations</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-1">Free Options</h4>
            <ul className="text-slate-600 dark:text-slate-300 space-y-1">
              <li>• Bitwarden</li>
              <li>• KeePass</li>
              <li>• Firefox Lockwise</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-1">Premium Options</h4>
            <ul className="text-slate-600 dark:text-slate-300 space-y-1">
              <li>• 1Password</li>
              <li>• LastPass</li>
              <li>• Dashlane</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-1">Built-in Options</h4>
            <ul className="text-slate-600 dark:text-slate-300 space-y-1">
              <li>• Google Password Manager</li>
              <li>• Apple Keychain</li>
              <li>• Microsoft Authenticator</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
