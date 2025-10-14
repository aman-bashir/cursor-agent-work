'use client'

import { useState, useCallback, useMemo } from 'react'
import { Eye, EyeOff, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { checkPasswordStrength, formatTimeToCrack } from '@/lib/passwordUtils'
import StrengthMeter from './StrengthMeter'

export default function PasswordChecker() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const strengthResult = useMemo(() => {
    if (!password) return null
    return checkPasswordStrength(password)
  }, [password])

  const getStrengthColor = (score: number) => {
    if (score < 2) return 'text-red-500'
    if (score < 3) return 'text-orange-500'
    if (score < 4) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStrengthText = (score: number) => {
    if (score < 2) return 'Very Weak'
    if (score < 3) return 'Weak'
    if (score < 4) return 'Fair'
    if (score < 5) return 'Strong'
    return 'Very Strong'
  }

  const getCrackTimeColor = (timeToCrack: number) => {
    if (timeToCrack < 1000) return 'text-red-500'
    if (timeToCrack < 86400000) return 'text-orange-500' // 1 day
    if (timeToCrack < 31536000000) return 'text-yellow-500' // 1 year
    return 'text-green-500'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Password Strength Checker</h2>
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Check Password Strength
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to check strength"
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Strength Results */}
      {password && strengthResult && (
        <div className="space-y-6">
          {/* Strength Meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Strength
              </span>
              <span className={`text-sm font-semibold ${getStrengthColor(strengthResult.score)}`}>
                {getStrengthText(strengthResult.score)}
              </span>
            </div>
            <StrengthMeter score={strengthResult.score} />
          </div>

          {/* Time to Crack */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Time to crack:
              </span>
              <span className={`ml-2 font-semibold ${getCrackTimeColor(strengthResult.crackTimeSeconds * 1000)}`}>
                {formatTimeToCrack(strengthResult.crackTimeSeconds)}
              </span>
            </div>
          </div>

          {/* Entropy */}
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Entropy: {strengthResult.entropy.toFixed(1)} bits
              </span>
            </div>
          </div>

          {/* Feedback */}
          {strengthResult.feedback.warning && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Warning
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {strengthResult.feedback.warning}
                </p>
              </div>
            </div>
          )}

          {strengthResult.feedback.suggestions.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Suggestions to improve:
              </p>
              <ul className="space-y-1">
                {strengthResult.feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-700 dark:text-blue-300">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Character Analysis */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Length:</span>
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">{password.length}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Uppercase:</span>
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                {/[A-Z]/.test(password) ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Lowercase:</span>
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                {/[a-z]/.test(password) ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Numbers:</span>
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                {/[0-9]/.test(password) ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Symbols:</span>
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                {/[^A-Za-z0-9]/.test(password) ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Unique chars:</span>
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                {new Set(password).size}
              </span>
            </div>
          </div>
        </div>
      )}

      {!password && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p>Enter a password above to check its strength</p>
        </div>
      )}
    </div>
  )
}
