'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { 
  SignupSchema, 
  LoginSchema, 
  verifyTurnstileToken 
} from '@/lib/auth-validation'

// 1. LOGIN ACTION (Frictionless, Fast, Protected by Supabase Rate Limiter)
export async function login(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate schema
  const parsed = LoginSchema.safeParse(rawData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Invalid login details'
    return redirect(`/login?error=${encodeURIComponent(errorMsg)}`)
  }

  const { email, password } = parsed.data

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// 2. SIGNUP ACTION (Protected by Cloudflare Turnstile, Honeypot, Disposable Email Filter, and 5-Point Password Engine)
export async function signup(formData: FormData) {
  const token =
    (formData.get('cf-turnstile-response') as string) ||
    (formData.get('cfTurnstileToken') as string) ||
    ''

  const rawData = {
    fullName: formData.get('fullName') as string,
    shopName: formData.get('shopName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    cfTurnstileToken: token,
    website: (formData.get('website') as string) || '', // Invisible Honeypot
  }

  // Honeypot check: If filled, it's an automated bot
  if (rawData.website && rawData.website.trim() !== '') {
    return redirect('/signup?error=Bot+activity+detected')
  }

  // Validate with Zod (checks email format, disposable domains, and 8+ char password rules)
  const parsed = SignupSchema.safeParse(rawData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Invalid registration details'
    return redirect(`/signup?error=${encodeURIComponent(errorMsg)}`)
  }

  const { fullName, email, password, cfTurnstileToken } = parsed.data

  // Canonical Cloudflare Turnstile siteverify
  const turnstileCheck = await verifyTurnstileToken(cfTurnstileToken, 'signup')
  if (!turnstileCheck.success) {
    return redirect(`/signup?error=${encodeURIComponent(turnstileCheck.error || 'Security verification failed')}`)
  }

  const supabase = await createClient()

  // Create account in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // Insert profile record for shop owner
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role: 'owner',
    })

    if (profileError) {
      return redirect(`/signup?error=${encodeURIComponent(profileError.message)}`)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}