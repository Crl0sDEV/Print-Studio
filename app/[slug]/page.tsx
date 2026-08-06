import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ShopHeader } from '@/components/shop/shop-header'
import { OrderForm } from '@/components/shop/order-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function PublicShopPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ success?: string }> }) {
  const { slug } = await params
  const { success } = await searchParams
  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!shop) {
    notFound()
  }

  const { data: presets } = await supabase
    .from('presets')
    .select('*, pricing_matrices(*)')
    .eq('shop_id', shop.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ShopHeader name={shop.name} address={shop.address} />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {success ? (
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Order Submitted!</h2>
            <p className="text-muted-foreground">Thank you for your order. We will review your files and contact you shortly.</p>
            <Button className="mt-4" nativeButton={false} render={<Link href={`/${shop.slug}`} />}>Place Another Order</Button>
          </div>
        ) : (
          <OrderForm presets={presets} shopId={shop.id} shopSlug={shop.slug} />
        )}
      </main>
    </div>
  )
}
