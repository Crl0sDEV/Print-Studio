import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ShopHeader } from '@/components/shop/shop-header'
import { OrderForm } from '@/components/shop/order-form'

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
            <h2 className="mb-2 text-2xl font-bold text-primary">Order Submitted!</h2>
            <p className="text-muted-foreground">Salamat! Makikipag-ugnayan kami agad para sa iyong order.</p>
          </div>
        ) : (
          <OrderForm presets={presets} shopId={shop.id} shopSlug={shop.slug} />
        )}
      </main>
    </div>
  )
}
