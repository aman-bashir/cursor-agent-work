'use client'

interface StrengthMeterProps {
  score: number // 0-4 scale
}

export default function StrengthMeter({ score }: StrengthMeterProps) {
  const getColor = (segmentScore: number) => {
    if (segmentScore <= score) {
      if (score < 2) return 'bg-red-500'
      if (score < 3) return 'bg-orange-500'
      if (score < 4) return 'bg-yellow-500'
      return 'bg-green-500'
    }
    return 'bg-slate-200 dark:bg-slate-600'
  }

  const getLabel = () => {
    if (score < 1) return 'Very Weak'
    if (score < 2) return 'Weak'
    if (score < 3) return 'Fair'
    if (score < 4) return 'Strong'
    return 'Very Strong'
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((segment) => (
          <div
            key={segment}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${getColor(segment)}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Very Weak</span>
        <span className="font-medium">{getLabel()}</span>
        <span>Very Strong</span>
      </div>
    </div>
  )
}
