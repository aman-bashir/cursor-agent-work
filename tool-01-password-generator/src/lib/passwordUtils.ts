import zxcvbn from 'zxcvbn'

// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

// Similar characters to exclude if option is enabled
const SIMILAR_CHARS = '0O1lI'

export interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
}

export interface StrengthResult {
  score: number // 0-4
  entropy: number
  crackTimeSeconds: number
  feedback: {
    warning?: string
    suggestions: string[]
  }
}

/**
 * Generate a secure random password
 */
export function generatePassword(length: number, options: PasswordOptions): string {
  if (length < 4 || length > 128) {
    throw new Error('Password length must be between 4 and 128 characters')
  }

  let charset = ''
  
  if (options.uppercase) charset += UPPERCASE
  if (options.lowercase) charset += LOWERCASE
  if (options.numbers) charset += NUMBERS
  if (options.symbols) charset += SYMBOLS

  if (!charset) {
    throw new Error('At least one character type must be selected')
  }

  // Remove similar characters if option is enabled
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('')
  }

  // Ensure at least one character from each selected type is included
  let password = ''
  const requiredChars = []

  if (options.uppercase) {
    const char = UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]
    requiredChars.push(options.excludeSimilar && SIMILAR_CHARS.includes(char) 
      ? UPPERCASE.split('').find(c => !SIMILAR_CHARS.includes(c)) || char
      : char)
  }
  if (options.lowercase) {
    const char = LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]
    requiredChars.push(options.excludeSimilar && SIMILAR_CHARS.includes(char) 
      ? LOWERCASE.split('').find(c => !SIMILAR_CHARS.includes(c)) || char
      : char)
  }
  if (options.numbers) {
    const char = NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
    requiredChars.push(options.excludeSimilar && SIMILAR_CHARS.includes(char) 
      ? NUMBERS.split('').find(c => !SIMILAR_CHARS.includes(c)) || char
      : char)
  }
  if (options.symbols) {
    const char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    requiredChars.push(char)
  }

  // Add required characters
  password = requiredChars.join('')

  // Fill remaining length with random characters
  const remainingLength = length - password.length
  for (let i = 0; i < remainingLength; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }

  // Shuffle the password
  return shuffleString(password)
}

/**
 * Shuffle a string using Fisher-Yates algorithm
 */
function shuffleString(str: string): string {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

/**
 * Check password strength using zxcvbn
 */
export function checkPasswordStrength(password: string): StrengthResult {
  const result = zxcvbn(password)
  
  return {
    score: result.score,
    entropy: calculateEntropy(password),
    crackTimeSeconds: Number(result.crack_times_seconds.offline_slow_hashing_1e4_per_second),
    feedback: {
      warning: result.feedback.warning || undefined,
      suggestions: result.feedback.suggestions || []
    }
  }
}

/**
 * Format time to crack into human readable format
 */
export function formatTimeToCrack(seconds: number): string {
  if (seconds < 1) return 'Instant'
  if (seconds < 60) return `${seconds.toFixed(0)} second${seconds !== 1 ? 's' : ''}`
  if (seconds < 3600) return `${(seconds / 60).toFixed(0)} minute${seconds >= 120 ? 's' : ''}`
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hour${seconds >= 7200 ? 's' : ''}`
  if (seconds < 2592000) return `${(seconds / 86400).toFixed(1)} day${seconds >= 172800 ? 's' : ''}`
  if (seconds < 31536000) return `${(seconds / 2592000).toFixed(1)} month${seconds >= 5184000 ? 's' : ''}`
  if (seconds < 31536000000) return `${(seconds / 31536000).toFixed(1)} year${seconds >= 63072000 ? 's' : ''}`
  return `${(seconds / 31536000000).toFixed(1)} century`
}

/**
 * Check if password contains common patterns
 */
export function hasCommonPatterns(password: string): string[] {
  const patterns: string[] = []
  
  // Sequential characters
  if (/123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
    patterns.push('Sequential characters')
  }
  
  // Repeated characters
  if (/(.)\1{2,}/.test(password)) {
    patterns.push('Repeated characters')
  }
  
  // Keyboard patterns
  if (/qwerty|asdfgh|zxcvbn|123456|password/i.test(password)) {
    patterns.push('Keyboard patterns')
  }
  
  // Common words
  const commonWords = ['password', 'admin', 'login', 'welcome', 'qwerty', '123456', 'letmein', 'master', 'hello']
  if (commonWords.some(word => password.toLowerCase().includes(word))) {
    patterns.push('Common words')
  }
  
  return patterns
}

/**
 * Calculate password entropy
 */
export function calculateEntropy(password: string): number {
  const charSets = {
    lowercase: /[a-z]/.test(password) ? 26 : 0,
    uppercase: /[A-Z]/.test(password) ? 26 : 0,
    numbers: /[0-9]/.test(password) ? 10 : 0,
    symbols: /[^A-Za-z0-9]/.test(password) ? 32 : 0
  }
  
  const charsetSize = Object.values(charSets).reduce((sum, size) => sum + size, 0)
  return Math.log2(Math.pow(charsetSize, password.length))
}
