import { signup } from '../login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Printer } from 'lucide-react'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/auth-card'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <AuthCard
      icon={Printer}
      title="Create an account"
      description="Enter your details to set up your shop"
      error={error}
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </>
      }
    >
      <form action={signup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" type="text" placeholder="Carlos Sandrino" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopName">Print Shop Name</Label>
          <Input id="shopName" name="shopName" type="text" placeholder="Express Printing Studio" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="owner@printshop.ph" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" minLength={6} required />
        </div>

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    </AuthCard>
  )
}