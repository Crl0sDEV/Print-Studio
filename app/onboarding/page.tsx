import { createShop } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Store } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <AuthCard
      icon={Store}
      title="Complete Your Profile"
      description="We just need a few details about your print shop before you can start using the dashboard."
      error={error}
      maxWidth="lg"
    >
      <form action={createShop} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shopName">Print Shop Name *</Label>
          <Input id="shopName" name="shopName" type="text" placeholder="e.g. Express Printing Studio" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Contact / GCash Number</Label>
          <Input id="phone" name="phone" type="text" placeholder="0917XXXXXXX" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Shop Address / Location</Label>
          <Textarea id="address" name="address" placeholder="Zone 1, Main Street, Polangui, Albay" rows={3} />
        </div>

        <Button type="submit" className="mt-4 w-full">
          Complete Setup & Go to Dashboard
        </Button>
      </form>
    </AuthCard>
  )
}