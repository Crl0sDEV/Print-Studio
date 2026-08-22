'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SAAS_PLANS, isProPlanActive, PlanTierKey } from '@/lib/plans'
import { Check, Sparkles, Crown } from 'lucide-react'

interface PlanComparisonCardsProps {
  shop: {
    plan?: string | null
    plan_expires_at?: string | null
    subscription_status?: string | null
  }
  onSelectPlanToUpgrade: (planKey: PlanTierKey) => void
}

export function PlanComparisonCards({
  shop,
  onSelectPlanToUpgrade,
}: PlanComparisonCardsProps) {
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month')
  const isPro = isProPlanActive(shop)

  const freePlan = SAAS_PLANS.free
  const proPlan = billingCycle === 'month' ? SAAS_PLANS.pro_monthly : SAAS_PLANS.pro_annual

  return (
    <div className="space-y-6">
      {/* Billing Cycle Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <h3 className="text-lg font-bold">Choose the Right Plan for Your Shop</h3>
          <p className="text-xs text-muted-foreground">
            Simple, affordable pricing with zero hidden fees. Upgrade or renew anytime via GCash or Maya.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl border border-border/50 shrink-0">
          <button
            type="button"
            onClick={() => setBillingCycle('month')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === 'month'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('year')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              billingCycle === 'year'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Annual Billing</span>
            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] h-4 px-1.5 font-bold border border-emerald-500/30">
              Save 25%
            </Badge>
          </button>
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* FREE TIER CARD */}
        <Card className="flex flex-col border-border/60 bg-card/60 relative">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">{freePlan.name}</CardTitle>
              {!isPro && (
                <Badge variant="outline" className="text-[10px] font-semibold">
                  Your Current Plan
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">{freePlan.description}</CardDescription>
            <div className="pt-2">
              <span className="text-3xl font-extrabold">₱0</span>
              <span className="text-xs text-muted-foreground ml-1">/ forever</span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-2.5 text-xs">
            <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">
              Included Features:
            </span>
            {freePlan.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40">
            <Button variant="outline" className="w-full text-xs font-semibold h-9" disabled>
              {!isPro ? 'Active Plan' : 'Free Baseline'}
            </Button>
          </CardFooter>
        </Card>

        {/* PRO TIER CARD */}
        <Card className="flex flex-col border-primary/40 bg-gradient-to-b from-primary/5 via-card to-card relative shadow-md ring-1 ring-primary/30">
          <div className="absolute -top-3 right-6">
            <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 shadow-sm">
              <Crown className="h-3 w-3 mr-1 fill-amber-300 text-amber-300" />
              MOST POPULAR
            </Badge>
          </div>

          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Pro Print Master
              </CardTitle>
              {isPro && (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                  Active
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">{proPlan.description}</CardDescription>
            <div className="pt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-foreground">₱{proPlan.pricePhp.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">
                / {billingCycle === 'month' ? 'month' : 'year (₱149/mo)'}
              </span>
              {proPlan.discountBadge && (
                <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {proPlan.discountBadge}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-2.5 text-xs">
            <span className="font-semibold text-primary block text-[11px] uppercase tracking-wider">
              Everything in Free, plus:
            </span>
            {proPlan.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 font-medium">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5 font-bold" />
                <span>{feat}</span>
              </div>
            ))}
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40">
            <Button
              className="w-full font-bold text-xs h-9 shadow-md"
              onClick={() => onSelectPlanToUpgrade(proPlan.id as PlanTierKey)}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
              {isPro ? 'Renew / Extend Pro Plan' : `Upgrade to Pro (₱${proPlan.pricePhp.toLocaleString()})`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
