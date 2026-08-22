import { adminLogin } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Super Admin Login | Prynt',
  description: 'Master control portal for platform administrators.',
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const rawError = params.error
  const error = rawError && rawError !== '{}' && rawError !== '%7B%7D' ? decodeURIComponent(rawError) : null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-slate-900 via-background to-background p-4 relative">
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop Login
      </Link>

      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Super Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Restricted platform management & verification system
            </p>
          </div>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-md shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Master Authentication</CardTitle>
            <CardDescription className="text-xs">
              Enter your superadmin credentials to proceed.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form action={adminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-xs font-semibold">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="admin@prynt.studio"
                    required
                    className="pl-9 h-10 text-xs"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-pass" className="text-xs font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-pass"
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    required
                    className="pl-9 h-10 text-xs"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-bold h-10 shadow-md bg-amber-600 hover:bg-amber-700 text-white gap-1.5 mt-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Sign In to Admin Portal
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
