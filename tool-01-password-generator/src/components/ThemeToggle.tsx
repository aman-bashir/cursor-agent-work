'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      default:
        return 'System'
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
      title={`Current theme: ${getLabel()}. Click to cycle through themes.`}
    >
      {getIcon()}
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {getLabel()}
      </span>
    </button>
  )
}
