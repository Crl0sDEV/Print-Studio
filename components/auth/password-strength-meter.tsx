'use client'

import { evaluatePassword } from '@/lib/auth-validation'
import { Check, X } from 'lucide-react'

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null

  const {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    score,
  } = evaluatePassword(password)

  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const strengthColors = [
    'bg-rose-500 text-rose-500',
    'bg-rose-500 text-rose-500',
    'bg-amber-500 text-amber-500',
    'bg-yellow-500 text-yellow-500',
    'bg-emerald-500 text-emerald-500',
    'bg-emerald-500 text-emerald-500',
  ]

  const rules = [
    { label: 'At least 8 characters', met: hasMinLength },
    { label: 'One uppercase letter (A-Z)', met: hasUppercase },
    { label: 'One lowercase letter (a-z)', met: hasLowercase },
    { label: 'One number (0-9)', met: hasNumber },
    { label: 'One special character (!@#$%^&*)', met: hasSpecialChar },
  ]

  return (
    <div className="space-y-2.5 pt-1.5 animate-in fade-in-50 duration-200">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="text-muted-foreground">Password Strength:</span>
          <span className={`font-semibold ${strengthColors[score].split(' ')[1]}`}>
            {strengthLabels[score]}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`h-full transition-all duration-300 rounded-full ${
                lvl <= score ? strengthColors[score].split(' ')[0] : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 text-[11px] transition-colors ${
              rule.met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'
            }`}
          >
            {rule.met ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            )}
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
