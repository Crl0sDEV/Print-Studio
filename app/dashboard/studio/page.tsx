import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudioWorkspace } from '@/components/studio/studio-workspace'
import { IdPresetKey } from '@/types/studio'

export const metadata = {
  title: 'Photo & Print Studio | Prynt',
  description: 'AI Background Eraser, Philippine ID Photo Maker, and Automated Print Layout Generator',
}

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{
    fileUrl?: string
    preset?: string
    orderNumber?: string
    customerName?: string
  }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams

  return (
    <StudioWorkspace
      initialImageUrl={params.fileUrl}
      initialPreset={(params.preset as IdPresetKey) || '2x2'}
      orderInfo={
        params.orderNumber
          ? {
              orderNumber: params.orderNumber,
              customerName: params.customerName,
            }
          : undefined
      }
    />
  )
}
