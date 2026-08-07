'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye, WifiOff } from 'lucide-react'
import { OrderDetailsModal } from './order-details-modal'
import { useOfflineSync } from '@/hooks/use-offline-sync'

export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const { isOnline } = useOfflineSync()
  
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  useEffect(() => {
    const channel = supabase
      .channel('realtime_orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const activeOrder = selectedOrder ? orders.find(o => o.id === selectedOrder.id) : null

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string, color: string }> = {
      pending: { label: 'Pending', color: 'bg-amber-500 hover:bg-amber-600' },
      approved: { label: 'Approved', color: 'bg-blue-500 hover:bg-blue-600' },
      printing: { label: 'Printing', color: 'bg-purple-500 hover:bg-purple-600' },
      finishing: { label: 'Finishing', color: 'bg-orange-500 hover:bg-orange-600' },
      ready: { label: 'Ready', color: 'bg-primary hover:bg-primary/90' },
      completed: { label: 'Completed', color: 'bg-green-500 hover:bg-green-600' },
    }
    const config = statusConfig[status] || { label: status, color: 'bg-gray-500' }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  return (
    <>
      {!isOnline && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive border border-destructive/20">
          <WifiOff className="h-4 w-4" />
          You are offline. Changes will be saved locally and synced when connection is restored.
        </div>
      )}
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map(order => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedOrder(order)}>
                  <TableCell className="font-mono font-medium">
                    {order.order_number || order.id.split('-')[0]}
                    {order.is_rush && <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-[10px]">RUSH</Badge>}
                  </TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₱{Number(order.total_amount).toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <OrderDetailsModal 
        isOpen={!!selectedOrder} 
        onClose={(open) => !open && setSelectedOrder(null)} 
        order={activeOrder} 
      />
    </>
  )
}
