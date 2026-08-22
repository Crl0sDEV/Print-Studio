'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const AdminLoginSchema = z.object({
  email: z.string().email('Invalid admin email address'),
  password: z.string().min(6, 'Password is required'),
})

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = AdminLoginSchema.safeParse({ email, password })
  if (!validation.success) {
    return redirect(`/admin/login?error=${encodeURIComponent(validation.error.issues[0]?.message || 'Invalid input')}`)
  }

  const supabase = await createClient()

  // 1. Authenticate with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return redirect(`/admin/login?error=${encodeURIComponent(error?.message || 'Invalid email or password')}`)
  }

  // 2. Verify Superadmin role strictly
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role !== 'superadmin') {
    // If not superadmin, sign out immediately
    await supabase.auth.signOut()
    return redirect('/admin/login?error=Access%20denied.%20Superadmin%20privileges%20required.')
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function adminSignOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/admin', 'layout')
  redirect('/admin/login')
}
