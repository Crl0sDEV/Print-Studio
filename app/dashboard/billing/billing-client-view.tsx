'use client'

import { useState } from 'react'
import { ActivePlanBanner } from '@/components/billing/active-plan-banner'
import { PlanComparisonCards } from '@/components/billing/plan-comparison-cards'
import { PaymentQrModal } from '@/components/billing/payment-qr-modal'
import { PlanTierKey } from '@/lib/plans'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, ExternalLink } from 'lucide-react'

interface BillingClientViewProps {
  shop: {
    id: string
    name: string
    plan?: string | null
    plan_expires_at?: string | null
    subscription_status?: string | null
  }
  pendingRequest: any
  history: any[]
}

export function BillingClientView({
  shop,
  pendingRequest,
  history,
}: BillingClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlanKey, setSelectedPlanKey] = useState<PlanTierKey>('pro_monthly')

  const handleSelectPlanToUpgrade = (planKey: PlanTierKey) => {
    setSelectedPlanKey(planKey)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 1. Active Plan Banner */}
      <ActivePlanBanner
        shop={shop}
        pendingRequest={pendingRequest}
        onOpenUpgradeModal={() => {
          setSelectedPlanKey('pro_monthly')
          setIsModalOpen(true)
        }}
      />

      {/* 2. Plan Comparison Cards */}
      <PlanComparisonCards
        shop={shop}
        onSelectPlanToUpgrade={handleSelectPlanToUpgrade}
      />

      {/* 3. Payment History / Verification Status */}
      {history.length > 0 && (
        <Card className="border-border/40">
          <CardHeader className="py-4 border-b border-border/40">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Subscription & Upgrade History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Plan</th>
                    <th className="px-4 py-2.5">Method</th>
                    <th className="px-4 py-2.5">Ref Number</th>
                    <th className="px-4 py-2.5">Amount</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 font-semibold uppercase">{item.plan_tier}</td>
                      <td className="px-4 py-3 uppercase font-medium">{item.payment_method}</td>
                      <td className="px-4 py-3 font-mono">{item.reference_number}</td>
                      <td className="px-4 py-3 font-bold text-primary">₱{Number(item.amount_paid).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {item.status === 'approved' && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Approved
                          </Badge>
                        )}
                        {item.status === 'pending' && (
                          <Badge variant="secondary" className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            Pending Review
                          </Badge>
                        )}
                        {item.status === 'rejected' && (
                          <Badge variant="destructive" className="text-[10px]" title={item.admin_notes || 'Invalid payment proof'}>
                            Rejected
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.receipt_url ? (
                          <a
                            href={item.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 font-medium"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Payment QR Modal */}
      <PaymentQrModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlanKey={selectedPlanKey}
        shopId={shop.id}
      />
    </div>
  )
}
