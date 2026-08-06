'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, User, Phone, CheckCircle, CreditCard, Printer } from 'lucide-react'
import { updatePaymentStatus } from '@/app/dashboard/orders/actions'
import { useTransition } from 'react'
import { useOfflineSync } from '@/hooks/use-offline-sync'

export function OrderDetailsModal({ 
  order, 
  isOpen, 
  onClose 
}: { 
  order: any; 
  isOpen: boolean; 
  onClose: (open: boolean) => void 
}) {
  const { enqueueAction } = useOfflineSync()
  const [isPending, startTransition] = useTransition()

  if (!order) return null

  const handleMarkAsPaid = () => {
    startTransition(async () => {
      await enqueueAction('UPDATE_PAYMENT_STATUS', { orderId: order.id, status: 'paid' })
      // Note: Modal state will refresh next time we are online
    })
  }

  const items = order.order_items || []
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between pr-6">
            <div>
              <DialogTitle className="text-xl">
                Order {order.order_number || order.id.split('-')[0]}
              </DialogTitle>
              <DialogDescription>
                Placed on {new Date(order.created_at).toLocaleString()}
              </DialogDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              {order.is_rush && <Badge variant="destructive">RUSH ORDER</Badge>}
              <Button size="sm" variant="outline" className="h-7 text-xs" nativeButton={false} render={<a href={`/dashboard/orders/${order.id}/receipt`} target="_blank" />}>
                <Printer className="mr-1 h-3 w-3" />
                Print Receipt
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 border-b border-border/40 py-4">
          <div className="space-y-1">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" /> Customer
            </h4>
            <p className="text-sm">{order.customer_name}</p>
          </div>
          <div className="space-y-1">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-muted-foreground" /> Contact
            </h4>
            <p className="text-sm">{order.customer_contact || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-4 py-4">
          <h4 className="font-semibold">Order Items</h4>
          {items.map((item: any) => (
            <div key={item.id} className="space-y-3 rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium">{item.presets?.name || 'Custom Print'}</h5>
                  <p className="text-xs text-muted-foreground">{item.presets?.category} • {item.presets?.paper_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₱{Number(item.subtotal).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                  <p className="text-xs text-muted-foreground">{item.quantity} units @ ₱{Number(item.unit_price)}</p>
                </div>
              </div>

              {item.file_url && (
                <div className="flex items-center justify-between border-t border-border/40 pt-2">
                  <div className="flex max-w-[250px] items-center gap-2 overflow-hidden">
                    <Download className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate text-xs">{item.file_name || 'Print_Asset'}</span>
                  </div>
                  <div className="flex gap-2">
                    {item.presets?.category === 'id_card' || item.presets?.category === 'merchandise' ? (
                      <Button size="sm" variant="outline" nativeButton={false} render={<a href={`/dashboard/orders/${order.id}/studio/${item.id}`} target="_blank" />}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Studio
                      </Button>
                    ) : null}
                    <Button size="sm" nativeButton={false} render={<a href={item.file_url} target="_blank" rel="noopener noreferrer" download />}>
                      Download Asset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-4">
          <div className="space-y-1">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-muted-foreground" /> Payment Status
            </h4>
            {order.payment_status === 'paid' ? (
              <Badge className="bg-green-500 hover:bg-green-600">PAID</Badge>
            ) : (
              <Badge variant="secondary" className="border-amber-500/20 text-amber-500">UNPAID</Badge>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary">₱{Number(order.total_amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
          </div>
        </div>

        {order.payment_status !== 'paid' && (
          <div className="mt-4 border-t border-border/40 pt-4">
            <Button 
              className="w-full" 
              variant="default"
              onClick={handleMarkAsPaid}
              disabled={isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isPending ? 'Updating...' : 'Mark as Paid'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
