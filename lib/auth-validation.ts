import { z } from 'zod'

// List of common disposable / burner email domains
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.info',
  'guerrillamail.biz',
  'sharklasers.com',
  'yopmail.com',
  'yopmail.fr',
  'trashmail.com',
  'trashmail.net',
  'getairmail.com',
  'dispostable.com',
  'fakeinbox.com',
  'throwawaymail.com',
  'mytrashmail.com',
  'maildrop.cc',
  'inboxkitten.com',
  'crazymailing.com',
  'mohmal.com',
  'burnermail.io',
  'nada.ltd',
  'getnada.com',
  'tempr.email',
  'discard.email',
  'dropmail.me',
  'emailondeck.com',
  'generator.email',
])

/**
 * Checks if an email uses a disposable / temporary burner domain
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false
  const domain = email.split('@')[1]?.toLowerCase().trim()
  return DISPOSABLE_EMAIL_DOMAINS.has(domain)
}

/**
 * Sanitizes text to remove control characters and malicious HTML scripts
 */
export function sanitizeText(input: string): string {
  if (!input) return ''
  return input
    .trim()
    .replace(/[<>]/g, '') // remove raw html angle brackets
    .slice(0, 150)
}

/**
 * Sanitizes and normalizes an email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return ''
  return email.trim().toLowerCase().slice(0, 120)
}

export interface PasswordRuleStatus {
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
  score: number // 0 to 5
}

/**
 * Evaluates password strength and returns individual rule satisfaction
 */
export function evaluatePassword(password: string): PasswordRuleStatus {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  const score = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    score,
  }
}

// Zod schema for Signup
export const SignupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(80, 'Full name must not exceed 80 characters')
      .transform(sanitizeText),
    shopName: z
      .string()
      .min(2, 'Shop name must be at least 2 characters')
      .max(80, 'Shop name must not exceed 80 characters')
      .transform(sanitizeText),
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(120, 'Email is too long')
      .transform(sanitizeEmail)
      .refine((email) => !isDisposableEmail(email), {
        message: 'Disposable / temporary emails are not permitted. Please use a permanent email.',
      }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password must not exceed 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*)'),
    confirmPassword: z.string().optional(),
    cfTurnstileToken: z.string().optional(),
    website: z.string().max(0, 'Bot detected').optional(), // Honeypot
  })
  .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Zod schema for Login
export const LoginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .transform(sanitizeEmail),
  password: z.string().min(1, 'Password is required'),
  cfTurnstileToken: z.string().optional(),
})

/**
 * Validates Cloudflare Turnstile token via Cloudflare canonical siteverify API
 */
export async function verifyTurnstileToken(
  token?: string | null,
  action?: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET

  // If Turnstile is not configured in .env, gracefully permit (useful for local dev)
  if (!secretKey || secretKey.trim() === '') {
    return { success: true }
  }

  if (!token || token.trim() === '' || token.length > 2048) {
    return { success: false, error: 'Please complete the Cloudflare security verification' }
  }

  try {
    const params = new URLSearchParams()
    params.append('secret', secretKey)
    params.append('response', token)
    if (remoteIp) params.append('remoteip', remoteIp)

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: params,
    })

    if (!res.ok) {
      return { success: false, error: 'Cloudflare security check failed to respond' }
    }

    const data = await res.json()
    if (data.success) {
      if (action && data.action && data.action !== action) {
        return { success: false, error: 'Invalid verification action' }
      }
      return { success: true }
    }

    return { success: false, error: 'Security bot verification failed. Please try again.' }
  } catch {
    return { success: true }
  }
}
