// Form Security Utilities

// 1. Honeypot Validation
export function validateHoneypot(value: string): boolean {
  return value === "" || value === null || value === undefined
}

// 2. Submission Timing Validation (minimum 3 seconds)
export function validateSubmissionTiming(formStartTime: number, minTime: number = 3000): boolean {
  const elapsed = Date.now() - formStartTime
  return elapsed >= minTime
}

// 3. Email Validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 4. Content Validation (Spam Detection)
export function validateContent(content: string): { valid: boolean; reason?: string } {
  // Check for excessive links
  const urlCount = (content.match(/https?:\/\//gi) || []).length
  if (urlCount > 3) {
    return { valid: false, reason: "Too many URLs" }
  }

  // Check for spam keywords
  const spamKeywords = [
    "viagra",
    "cialis",
    "lottery",
    "prize",
    "congratulations",
    "click here",
    "buy now",
    "limited time",
  ]
  const lowerContent = content.toLowerCase()
  for (const keyword of spamKeywords) {
    if (lowerContent.includes(keyword)) {
      return { valid: false, reason: `Spam keyword detected: ${keyword}` }
    }
  }

  // Check for excessive repetition
  const words = content.split(/\s+/)
  const uniqueWords = new Set(words)
  if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
    return { valid: false, reason: "Excessive word repetition" }
  }

  return { valid: true }
}

// 5. Input Sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
}

// 6. Session Token Generation
export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array)
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// 7. Session Token Validation
export function validateSessionToken(token: string): boolean {
  return token.length === 64 && /^[0-9a-f]+$/i.test(token)
}
