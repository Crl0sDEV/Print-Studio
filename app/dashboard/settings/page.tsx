import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateShopSettings } from '@/app/dashboard/actions'

export default async function SettingsPage() {
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
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
        <p className="text-muted-foreground">Manage your storefront appearance and shop details.</p>
      </div>

      <Card>
        <form action={updateShopSettings}>
          <input type="hidden" name="shopId" value={shop.id} />
          
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Update your shop's name and unique URL slug. This is what your customers will see.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Shop Name</Label>
              <Input key={shop.name} id="name" name="name" defaultValue={shop.name} required />
              <p className="text-xs text-muted-foreground">This is displayed at the top of your public storefront.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Store URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border/40">
                  printos.com/
                </span>
                <Input key={shop.slug} id="slug" name="slug" defaultValue={shop.slug} required />
              </div>
              <p className="text-xs text-muted-foreground">Your customers will visit this URL to submit orders.</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/40">
              <Label>Theme Color</Label>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-primary ring-2 ring-offset-2 ring-primary cursor-pointer"></div>
                <div className="w-10 h-10 rounded-full bg-blue-600 opacity-50 cursor-not-allowed"></div>
                <div className="w-10 h-10 rounded-full bg-rose-600 opacity-50 cursor-not-allowed"></div>
                <div className="w-10 h-10 rounded-full bg-emerald-600 opacity-50 cursor-not-allowed"></div>
                <span className="text-xs text-muted-foreground ml-2">(Pro plan required for custom themes)</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-6 py-4">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storage Settings (Google Drive)</CardTitle>
          <CardDescription>
            Connect your personal Google Drive to bypass the 50MB cloud storage limit. All customer uploads will be saved directly to a dedicated folder in your Google Drive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
              <h4 className="font-semibold text-sm mb-1">Status</h4>
              {shop.gdrive_refresh_token ? (
                <p className="text-sm text-green-600 font-medium">✓ Connected to Google Drive</p>
              ) : (
                <p className="text-sm text-amber-600 font-medium">⚠ Not connected. Using standard storage.</p>
              )}
            </div>
            
            <form action="/api/drive/connect" method="GET">
              <Button type="submit" variant={shop.gdrive_refresh_token ? "outline" : "default"}>
                {shop.gdrive_refresh_token ? "Reconnect Google Drive" : "Connect Google Drive"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
