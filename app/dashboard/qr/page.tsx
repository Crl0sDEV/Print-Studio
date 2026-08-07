import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { QrClient } from './qr-client'

export const metadata = {
  title: 'Shop QR Code | Prynt'
}

export default async function QrPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!shop) redirect('/onboarding')

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">QR Code Generator</h2>
      </div>
      <QrClient shop={shop} />
    </div>
  )
}
