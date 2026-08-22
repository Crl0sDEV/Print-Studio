import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'

export const metadata = {
  title: 'Super Admin Portal | Prynt Studio',
  description: 'Master platform management and payment approvals.',
}

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // We allow /admin/login without redirection in layout
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader profile={profile} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
