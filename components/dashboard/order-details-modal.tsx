'use client'

import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Download, User, Phone, CheckCircle, CreditCard, Printer, Sparkles } from 'lucide-react'
import { updatePaymentStatus, updateOrderStatus } from '@/app/dashboard/orders/actions'
import { useTransition } from 'react'
import { useOfflineSync } from '@/hooks/use-offline-sync'
import { OrderStatus } from '@/types/database'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

  const handleStatusChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      await enqueueAction('UPDATE_ORDER_STATUS', { orderId: order.id, status: newStatus })
      // Offline sync queue will process this
    })
  }

  const items = order.order_items || []
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] p-0">
        <DialogHeader className="px-5 py-3 border-b border-border/40 bg-card/40">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl">
                Order {order.order_number || order.id.split('-')[0]}
              </DialogTitle>
              {order.is_rush && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">RUSH</Badge>}
            </div>
            <Link
              href={`/dashboard/orders/${order.id}/receipt`}
              target="_blank"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "h-8 text-xs")}
            >
              <Printer className="mr-2 h-3 w-3" />
              Print Receipt
            </Link>
          </div>
          <DialogDescription className="mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-3">
          {/* Customer & Status Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" /> Customer Name
                </h4>
                <p className="text-sm font-semibold">{order.customer_name}</p>
              </div>
              <div className="space-y-1">
                <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Phone className="h-4 w-4" /> Contact
                </h4>
                <p className="text-sm font-semibold">{order.customer_contact || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground mb-1.5">Order Status</h4>
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="printing">Printing</SelectItem>
                    <SelectItem value="finishing">Finishing</SelectItem>
                    <SelectItem value="ready">Ready for Pickup</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1.5">
                  <CreditCard className="h-4 w-4" /> Payment Status
                </h4>
                {order.payment_status === 'paid' ? (
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">PAID</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">UNPAID</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 pt-4 space-y-3">
            <h4 className="font-semibold text-xs text-muted-foreground tracking-wider uppercase">Order Items</h4>
            <div className="space-y-2">
              {items.map((item: any) => (
                <div key={item.id} className="rounded-lg border border-border/50 bg-secondary/20 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-sm">{item.presets?.name || 'Custom Print'}</h5>
                      <p className="text-[10px] text-muted-foreground">{item.presets?.category} • {item.presets?.paper_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">₱{Number(item.subtotal).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                      <p className="text-[10px] text-muted-foreground">{item.quantity} units @ ₱{Number(item.unit_price)}</p>
                    </div>
                  </div>

                  {item.file_url && (
                    <div className="flex items-center justify-between border-t border-border/40 pt-2 mt-2">
                      <div className="flex max-w-[200px] items-center gap-2 overflow-hidden">
                        <Download className="h-3 w-3 shrink-0 text-primary" />
                        <span className="truncate text-[10px] font-medium text-muted-foreground">{item.file_name || 'Print_Asset'}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/studio?fileUrl=${encodeURIComponent(item.file_url)}&orderNumber=${order.order_number || order.id.slice(0, 8)}&customerName=${encodeURIComponent(order.customer_name)}`}
                          className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), "h-6 text-[10px] px-2 text-primary font-semibold hover:bg-primary/10")}
                          onClick={() => onClose(false)}
                        >
                          <Sparkles className="mr-1 h-3 w-3 text-amber-500" />
                          Photo Studio
                        </Link>
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "h-6 text-[10px] px-2")}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-muted/30 px-5 py-4 border-t border-border/40">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary">₱{Number(order.total_amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
          </div>
          {order.payment_status !== 'paid' && (
            <Button 
              className="w-full" 
              variant="default"
              size="lg"
              onClick={handleMarkAsPaid}
              disabled={isPending}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              {isPending ? 'Updating Payment...' : 'Mark as Paid'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
