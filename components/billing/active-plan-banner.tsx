'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { isProPlanActive } from '@/lib/plans'
import { Crown, Sparkles, AlertCircle, Calendar } from 'lucide-react'

interface ActivePlanBannerProps {
  shop: {
    plan?: string | null
    plan_expires_at?: string | null
    subscription_status?: string | null
  }
  pendingRequest?: {
    id: string
    plan_tier: string
    amount_paid: number
    payment_method: string
    created_at: string
  } | null
  onOpenUpgradeModal: () => void
}

export function ActivePlanBanner({
  shop,
  pendingRequest,
  onOpenUpgradeModal,
}: ActivePlanBannerProps) {
  const isPro = isProPlanActive(shop)
  const expiresAt = shop.plan_expires_at ? new Date(shop.plan_expires_at) : null

  let daysRemaining: number | null = null
  if (expiresAt) {
    const diffTime = expiresAt.getTime() - Date.now()
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  return (
    <Card className="relative overflow-hidden border-border/40 bg-gradient-to-br from-card via-card to-secondary/30 p-5 sm:p-6 shadow-sm">
      {/* Decorative background glow */}
      <div
        className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isPro ? 'bg-amber-500' : 'bg-primary'
        }`}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Subscription
            </span>
            {isPro ? (
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1 font-semibold px-2.5 py-0.5">
                <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                PRO PRINT MASTER
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground font-semibold px-2.5 py-0.5">
                FREE STARTER
              </Badge>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isPro ? 'You have Full Studio Pro Access' : 'Upgrade to Pro for Unlimited AI & Imposition'}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {isPro && expiresAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Renews on {expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {daysRemaining !== null && ` (${daysRemaining} days left)`}
              </span>
            )}
            {!isPro && (
              <span>Boost your daily shop workflow with automated Philippine ID templates and 300 DPI exports.</span>
            )}
          </div>

          {/* Pending verification alert */}
          {pendingRequest && (
            <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              <span>
                Your <strong>₱{Number(pendingRequest.amount_paid).toFixed(2)}</strong> {pendingRequest.payment_method.toUpperCase()} upgrade is currently <strong>Under Admin Review</strong>. We will activate your Pro plan shortly!
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
          {!isPro && (
            <Button
              size="lg"
              className="font-bold shadow-md gap-1.5 h-10 px-5"
              onClick={onOpenUpgradeModal}
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              Upgrade to Pro (₱199/mo)
            </Button>
          )}
          {isPro && (
            <Button
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-9"
              onClick={onOpenUpgradeModal}
            >
              Extend / Renew Subscription
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
