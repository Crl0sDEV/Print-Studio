'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import {
  enqueueOfflineAction,
  getPendingOfflineActions,
  removeOfflineAction,
  OfflineMutationAction,
} from '@/lib/db'
import { updateOrderStatus, updatePaymentStatus } from '@/app/dashboard/orders/actions'
import { OrderStatus, PaymentStatus } from '@/types/database'

function subscribeOnlineStatus(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getOnlineSnapshot(): boolean {
  return typeof window !== 'undefined' ? window.navigator.onLine : true
}

function getServerSnapshot(): boolean {
  return true
}

export function useOfflineSync() {
  const isOnline = useSyncExternalStore(
    subscribeOnlineStatus,
    getOnlineSnapshot,
    getServerSnapshot
  )
  const [isSyncing, setIsSyncing] = useState(false)

  // Process all queued offline operations
  const syncQueue = useCallback(async () => {
    if (isSyncing || !isOnline) return
    setIsSyncing(true)

    try {
      const operations = await getPendingOfflineActions()
      if (operations.length === 0) {
        setIsSyncing(false)
        return
      }

      for (const op of operations) {
        if (!op.id) continue

        if (op.action === 'UPDATE_ORDER_STATUS') {
          const res = await updateOrderStatus(op.payload.orderId, op.payload.status as string)
          if (!res?.error) {
            await removeOfflineAction(op.id)
          }
        } else if (op.action === 'UPDATE_PAYMENT_STATUS') {
          const res = await updatePaymentStatus(op.payload.orderId, op.payload.status as string)
          if (!res?.error) {
            await removeOfflineAction(op.id)
          }
        }
      }
    } catch (err) {
      console.error('Failed to sync offline queue:', err)
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing, isOnline])

  const enqueueAction = async (
    action: OfflineMutationAction,
    payload: { orderId: string; status: OrderStatus | PaymentStatus }
  ) => {
    if (isOnline) {
      if (action === 'UPDATE_ORDER_STATUS') {
        return await updateOrderStatus(payload.orderId, payload.status as string)
      } else {
        return await updatePaymentStatus(payload.orderId, payload.status as string)
      }
    } else {
      await enqueueOfflineAction(action, payload.orderId, payload.status)
      return { success: true, offline: true }
    }
  }

  return { isOnline, isSyncing, syncQueue, enqueueAction }
}
