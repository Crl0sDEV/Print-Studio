'use client'

import { useState, useTransition } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { updateShopPlanManually } from '@/app/admin/actions'
import { isProPlanActive } from '@/lib/plans'
import { SubscriptionPlan, Shop } from '@/types/database'
import { Store, Search, Crown, Sparkles, Loader2, ExternalLink } from 'lucide-react'

interface UserManagementTableProps {
  shops: (Shop & { profiles?: { full_name?: string | null } | null })[]
}

export function UserManagementTable({ shops }: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'pro'>('all')
  const [isPending, startTransition] = useTransition()

  const filteredShops = shops.filter((s) => {
    const isPro = isProPlanActive(s)
    if (filterPlan === 'free' && isPro) return false
    if (filterPlan === 'pro' && !isPro) return false

    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      s.name?.toLowerCase().includes(term) ||
      s.slug?.toLowerCase().includes(term) ||
      s.profiles?.full_name?.toLowerCase().includes(term)
    )
  })

  const handlePlanChange = (shopId: string, newPlan: SubscriptionPlan, durationDays: number | null) => {
    startTransition(async () => {
      await updateShopPlanManually(shopId, newPlan, durationDays)
    })
  }

  return (
    <Card className="border-border/40">
      <CardHeader className="py-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />
          Registered Print Shops Directory ({filteredShops.length})
        </CardTitle>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search shop, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          {/* Plan Filter */}
          <div className="flex items-center p-0.5 bg-secondary/50 rounded-lg border border-border/50 text-[11px]">
            <button
              type="button"
              onClick={() => setFilterPlan('all')}
              className={`px-2 py-1 rounded font-semibold transition-all ${
                filterPlan === 'all' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterPlan('pro')}
              className={`px-2 py-1 rounded font-semibold transition-all ${
                filterPlan === 'pro' ? 'bg-background shadow-xs text-amber-500' : 'text-muted-foreground'
              }`}
            >
              Pro
            </button>
            <button
              type="button"
              onClick={() => setFilterPlan('free')}
              className={`px-2 py-1 rounded font-semibold transition-all ${
                filterPlan === 'free' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
              }`}
            >
              Free
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Shop</th>
                <th className="px-4 py-2.5">Owner</th>
                <th className="px-4 py-2.5">Current Plan</th>
                <th className="px-4 py-2.5">Expires On</th>
                <th className="px-4 py-2.5">Joined</th>
                <th className="px-4 py-2.5 text-right">Manual Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredShops.map((shop) => {
                const isPro = isProPlanActive(shop)
                return (
                  <tr key={shop.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <strong className="font-semibold text-foreground">{shop.name}</strong>
                        <a
                          href={`/${shop.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          title="View public storefront"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <span className="text-[10px] text-muted-foreground">/{shop.slug}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{shop.profiles?.full_name || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {isPro ? (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold text-[10px] gap-1">
                          <Crown className="h-3 w-3 fill-amber-500 text-amber-500" />
                          PRO
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          FREE
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                      {shop.plan_expires_at
                        ? new Date(shop.plan_expires_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : isPro
                        ? 'Lifetime'
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                      {new Date(shop.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!isPro ? (
                          <Button
                            size="xs"
                            variant="secondary"
                            className="text-[10px] font-semibold h-6 text-primary gap-1"
                            onClick={() => handlePlanChange(shop.id, 'pro', 30)}
                            disabled={isPending}
                          >
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            Grant 30d Pro
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="outline"
                            className="text-[10px] h-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handlePlanChange(shop.id, 'free', null)}
                            disabled={isPending}
                          >
                            Revoke to Free
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
