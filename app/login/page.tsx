import { login } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Printer } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <AuthCard
      icon={Printer}
      title="PrintCraft SaaS"
      description="Mag-login sa iyong Print Shop Dashboard"
      error={error}
      footer={
        <>
          Mag-login gamit ang test account na sinave sa Supabase seed data:
          <br />
          <span className="font-mono text-primary">demoowner@printcraft.ph</span>
        </>
      }
    >
      <form action={login} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="owner@printshop.ph" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </AuthCard>
  )
}