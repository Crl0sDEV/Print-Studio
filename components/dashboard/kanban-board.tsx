'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, Package, Printer, FileCheck, CircleDashed, WifiOff } from 'lucide-react'
import { OrderDetailsModal } from './order-details-modal'
import { useOfflineSync } from '@/hooks/use-offline-sync'

// Based on enum: 'pending', 'approved', 'printing', 'finishing', 'ready', 'completed'
const COLUMNS = [
  { id: 'pending', title: 'Pending', icon: CircleDashed, color: 'text-amber-500' },
  { id: 'approved', title: 'Approved', icon: FileCheck, color: 'text-blue-500' },
  { id: 'printing', title: 'Printing', icon: Printer, color: 'text-purple-500' },
  { id: 'finishing', title: 'Finishing', icon: Package, color: 'text-orange-500' },
  { id: 'ready', title: 'Ready for Pickup', icon: CheckCircle2, color: 'text-primary' },
  { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-green-500' },
]

export function KanbanBoard({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const { isOnline, enqueueAction } = useOfflineSync()
  
  const [orders, setOrders] = useState(initialOrders)
  const [isPending, startTransition] = useTransition()
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Keep local state in sync with server state (needed for router.refresh)
  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  // Supabase Realtime Subscription
  useEffect(() => {
    const channel = supabase
      .channel('realtime_orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Database change detected:', payload)
          // Tell Next.js to re-fetch the server component data
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const handleDragStart = (e: any, id: string) => {
    e.dataTransfer.setData('orderId', id)
    setDraggedOrderId(id)
  }

  const handleDragOver = (e: any) => {
    e.preventDefault() // Necessary to allow dropping
  }

  const handleDrop = (e: any, newStatus: string) => {
    e.preventDefault()
    const orderId = e.dataTransfer.getData('orderId')
    setDraggedOrderId(null)

    if (!orderId) return

    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

    startTransition(async () => {
      const res = await enqueueAction('UPDATE_ORDER_STATUS', { orderId, status: newStatus })
      if (res && 'error' in res && res.error) {
        // Revert on failure
        setOrders(initialOrders)
      }
    })
  }

  // Effect to sync optimistic updates down to the modal without flickering
  const activeOrder = selectedOrder ? orders.find(o => o.id === selectedOrder.id) : null

  return (
    <>
      {!isOnline && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive border border-destructive/20">
          <WifiOff className="h-4 w-4" />
          You are offline. Changes will be saved locally and synced when connection is restored.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 pb-4">
        {COLUMNS.map(col => {
        const columnOrders = orders.filter(o => o.status === col.id)
        const Icon = col.icon

        return (
          <div 
            key={col.id} 
            className="flex w-full flex-col rounded-xl border border-border/50 bg-secondary/30"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center justify-between rounded-t-xl border-b border-border/40 bg-card/40 p-4">
              <div className="flex items-center gap-2 font-semibold">
                <Icon className={`h-4 w-4 ${col.color}`} />
                <span className="capitalize">{col.title}</span>
              </div>
              <Badge variant="secondary" className="font-mono">{columnOrders.length}</Badge>
            </div>
            
            <div className="flex min-h-[150px] flex-1 flex-col gap-3 p-3">
              {columnOrders.map(order => (
                <div 
                  key={order.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, order.id)}
                  onDragEnd={() => setDraggedOrderId(null)}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-grab active:cursor-grabbing transition-all ${draggedOrderId === order.id ? 'scale-95 opacity-50' : 'opacity-100'}`}
                >
                  <Card className="border-border/60 bg-card transition-all hover:border-primary/50 hover:shadow-md">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs font-medium text-muted-foreground">{order.order_number || order.id.split('-')[0]}</span>
                        {order.is_rush && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">RUSH</Badge>}
                      </div>
                      
                      <div>
                        <p className="line-clamp-1 text-sm font-semibold">{order.customer_name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">₱{Number(order.total_amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                      </div>

                      <div className="flex items-center gap-1.5 border-t border-border/40 pt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
              
              {columnOrders.length === 0 && (
                <div className="m-2 flex h-full items-center justify-center rounded-lg border-2 border-dashed border-border/50 text-sm text-muted-foreground">
                  Drop here
                </div>
              )}
            </div>
          </div>
        )
      })}
      </div>
      <OrderDetailsModal 
        isOpen={!!selectedOrder} 
        onClose={(open) => !open && setSelectedOrder(null)} 
        order={activeOrder} 
      />
    </>
  )
}
