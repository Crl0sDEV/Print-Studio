'use client'

import { useState, useTransition } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { approveSubscription, rejectSubscription } from '@/app/admin/actions'
import { Check, X, Eye, Loader2, Clock, ExternalLink } from 'lucide-react'

interface SubscriptionApprovalQueueProps {
  requests: any[]
}

export function SubscriptionApprovalQueue({ requests }: SubscriptionApprovalQueueProps) {
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleApprove = (requestId: string, shopId: string, planTier: string) => {
    const durationDays = planTier === 'pro_annual' ? 365 : 30
    startTransition(async () => {
      await approveSubscription(requestId, shopId, durationDays)
    })
  }

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectingId) return
    startTransition(async () => {
      await rejectSubscription(rejectingId, rejectReason)
      setRejectingId(null)
      setRejectReason('')
    })
  }

  return (
    <Card className="border-border/40">
      <CardHeader className="py-4 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-500" />
          Pending Payment Approvals ({requests.length})
        </CardTitle>
        {requests.length > 0 && (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs">
            Action Required
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No pending subscription requests. All payments are verified and active.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Shop Name</th>
                  <th className="px-4 py-2.5">Plan</th>
                  <th className="px-4 py-2.5">Method</th>
                  <th className="px-4 py-2.5">Ref Number</th>
                  <th className="px-4 py-2.5">Amount</th>
                  <th className="px-4 py-2.5">Submitted</th>
                  <th className="px-4 py-2.5">Proof</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <strong className="block text-foreground">{req.shops?.name || 'Unnamed Shop'}</strong>
                      <span className="text-[10px] text-muted-foreground">/{req.shops?.slug}</span>
                    </td>
                    <td className="px-4 py-3 uppercase font-semibold text-primary">{req.plan_tier}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {req.payment_method}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">{req.reference_number}</td>
                    <td className="px-4 py-3 font-bold text-foreground">₱{Number(req.amount_paid).toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                      {new Date(req.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="xs"
                        variant="secondary"
                        className="text-[10px] gap-1 h-6"
                        onClick={() => setSelectedReceiptUrl(req.receipt_url)}
                      >
                        <Eye className="h-3 w-3" /> View Slip
                      </Button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="xs"
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 gap-1"
                          onClick={() => handleApprove(req.id, req.shop_id, req.plan_tier)}
                          disabled={isPending}
                        >
                          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10 h-7"
                          onClick={() => setRejectingId(req.id)}
                          disabled={isPending}
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Receipt Image Viewer Modal */}
      <Dialog open={!!selectedReceiptUrl} onOpenChange={() => setSelectedReceiptUrl(null)}>
        <DialogContent className="max-h-[90vh] sm:max-w-[550px] p-4 flex flex-col items-center">
          <DialogHeader className="w-full flex flex-row items-center justify-between pb-2 border-b border-border/40">
            <DialogTitle className="text-sm font-bold">Payment Receipt Proof</DialogTitle>
            {selectedReceiptUrl && (
              <a
                href={selectedReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                Open Original <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </DialogHeader>
          <div className="mt-3 max-h-[70vh] overflow-auto rounded-lg border border-border/40 flex items-center justify-center bg-black/5 p-2">
            {selectedReceiptUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedReceiptUrl}
                alt="Payment Slip"
                className="max-h-[65vh] w-auto object-contain rounded"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Reason Modal */}
      <Dialog open={!!rejectingId} onOpenChange={() => setRejectingId(null)}>
        <DialogContent className="sm:max-w-[420px] p-5">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-destructive">Reject Subscription Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRejectSubmit} className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Please enter the reason for rejection (e.g. Reference number not found in GCash record):
            </p>
            <textarea
              className="w-full p-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
              placeholder="e.g. Reference number does not match GCash transaction."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => setRejectingId(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="destructive" disabled={isPending}>
                {isPending ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
