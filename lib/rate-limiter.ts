// Rate Limiter for form submissions
const RATE_LIMIT_KEY = "form_submissions"
const MAX_ATTEMPTS = 3
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export class RateLimiter {
  static checkLimit(): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
    if (typeof window === "undefined") {
      return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
    }

    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    const now = Date.now()

    if (!stored) {
      const data = {
        attempts: 1,
        firstAttempt: now,
      }
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
      return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
    }

    const data = JSON.parse(stored)

    // Reset if window has passed
    if (now - data.firstAttempt > WINDOW_MS) {
      const newData = {
        attempts: 1,
        firstAttempt: now,
      }
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newData))
      return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
    }

    // Check if limit exceeded
    if (data.attempts >= MAX_ATTEMPTS) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: data.firstAttempt + WINDOW_MS,
      }
    }

    // Increment attempts
    data.attempts += 1
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))

    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - data.attempts,
    }
  }

  static reset(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(RATE_LIMIT_KEY)
    }
  }
}
