'use client'

import { useState, useCallback } from 'react'
import { Copy, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { generatePassword } from '@/lib/passwordUtils'
import { toast } from 'sonner'

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
  })
  const [quantity, setQuantity] = useState(1)

  const handleGenerate = useCallback(() => {
    const newPassword = generatePassword(length, options)
    setPassword(newPassword)
  }, [length, options])

  const handleCopy = useCallback(async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password)
        toast.success('Password copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy password')
      }
    }
  }, [password])

  const toggleOption = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  const generateMultiple = () => {
    const passwords = []
    for (let i = 0; i < quantity; i++) {
      passwords.push(generatePassword(length, options))
    }
    setPassword(passwords.join('\n'))
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Password Generator</h2>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Generate
        </button>
      </div>

      {/* Password Length */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Password Length: {length}
        </label>
        <input
          type="range"
          min="4"
          max="128"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>4</span>
          <span>128</span>
        </div>
      </div>

      {/* Password Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Character Types
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(options).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleOption(key as keyof typeof options)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Number of Passwords: {quantity}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Generated Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Generated Password{quantity > 1 ? 's' : ''}
        </label>
        <div className="relative">
          <textarea
            value={password}
            readOnly
            placeholder="Click Generate to create a password"
            className="w-full p-3 pr-20 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-none"
            rows={quantity > 1 ? 4 : 2}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              disabled={!password}
              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50"
              title="Copy password"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Generate Multiple Button */}
      {quantity > 1 && (
        <button
          onClick={generateMultiple}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Generate {quantity} Passwords
        </button>
      )}

      {/* Password Info */}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p><strong>Character sets:</strong> {Object.entries(options).filter(([, v]) => v).length}/4 enabled</p>
          <p><strong>Total combinations:</strong> ~{Math.pow(26 + 26 + 10 + 32, length).toExponential(2)}</p>
          <p><strong>Entropy:</strong> ~{Math.log2(Math.pow(26 + 26 + 10 + 32, length)).toFixed(1)} bits</p>
        </div>
      </div>
    </div>
  )
}
