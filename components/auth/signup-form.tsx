'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordStrengthMeter } from './password-strength-meter'
import { CloudflareTurnstile } from './cloudflare-turnstile'
import { signup } from '@/app/login/actions'
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'

export function SignupForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hasTurnstilePassed, setHasTurnstilePassed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)

  const isPasswordMatching = password === confirmPassword || confirmPassword === ''

  const handleTurnstileVerify = useCallback(() => {
    setHasTurnstilePassed(true)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setHasTurnstilePassed(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (password !== confirmPassword) {
      e.preventDefault()
      setClientError('Passwords do not match. Please re-check your password.')
      return
    }

    if (password.length < 8) {
      e.preventDefault()
      setClientError('Password must be at least 8 characters long.')
      return
    }

    setClientError(null)
    setIsLoading(true)
  }

  return (
    <form action={signup} onSubmit={handleSubmit} className="space-y-4">
      {clientError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/15 text-destructive text-xs font-medium animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{clientError}</span>
        </div>
      )}

      {/* Invisible Honeypot field to trap automated spambots */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-xs font-semibold">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Juan Dela Cruz"
          required
          maxLength={80}
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shopName" className="text-xs font-semibold">Print Shop Name</Label>
        <Input
          id="shopName"
          name="shopName"
          type="text"
          placeholder="Express Print Studio"
          required
          maxLength={80}
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-semibold">Business Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="owner@printstudio.ph"
          required
          maxLength={120}
          className="h-9 text-sm"
        />
      </div>

      {/* Password with Strength Meter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
          <span className="text-[11px] text-muted-foreground">Min. 8 chars, 1 upper, 1 num, 1 symbol</span>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-9 text-sm pr-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <PasswordStrengthMeter password={password} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`h-9 text-sm pr-9 ${
              confirmPassword && !isPasswordMatching ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            tabIndex={-1}
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirmPassword && !isPasswordMatching && (
          <p className="text-[11px] text-destructive font-medium">Passwords do not match.</p>
        )}
      </div>

      {/* Cloudflare Turnstile anti-bot challenge */}
      <CloudflareTurnstile
        action="signup"
        onVerify={handleTurnstileVerify}
        onExpire={handleTurnstileExpire}
      />

      <Button
        type="submit"
        className="w-full font-bold h-10 shadow-md mt-2"
        disabled={isLoading || (confirmPassword !== '' && !isPasswordMatching)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Create Secure Account
          </>
        )}
      </Button>
    </form>
  )
}
