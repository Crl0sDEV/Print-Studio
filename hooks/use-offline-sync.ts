'use client'

import { useState, useEffect, useCallback } from 'react'
import { localDb } from '@/lib/db'
import { updateOrderStatus, updatePaymentStatus } from '@/app/dashboard/orders/actions'

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Process all queued offline operations
  const syncQueue = useCallback(async () => {
    if (isSyncing) return
    setIsSyncing(true)
    
    try {
      const operations = await localDb.syncQueue.toArray()
      if (operations.length === 0) {
        setIsSyncing(false)
        return
      }

      console.log(`Syncing ${operations.length} offline operations...`)
      
      for (const op of operations) {
        if (op.action === 'UPDATE_ORDER_STATUS') {
          const res = await updateOrderStatus(op.payload.orderId as string, op.payload.status as string)
          if (!res.error) {
            await localDb.syncQueue.delete(op.id!)
          }
        } else if (op.action === 'UPDATE_PAYMENT_STATUS') {
          const res = await updatePaymentStatus(op.payload.orderId as string, op.payload.status as string)
          if (!res?.error) {
            await localDb.syncQueue.delete(op.id!)
          }
        }
      }
      
      console.log('Sync complete!')
    } catch (err) {
      console.error('Failed to sync offline queue:', err)
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing])

  useEffect(() => {
    // We remove the initial setIsOnline check inside useEffect that caused the lint error
    // because React 18+ recommends handling this via useSyncExternalStore or inside the event listeners.
    const handleOnline = () => {
      setIsOnline(true)
      syncQueue()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial check (safe to do once without triggering re-render cascades if handled carefully)
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setIsOnline(false)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, []) // Remove syncQueue from dependency array to prevent infinite loops

  // Call this function when an action is performed
  const enqueueAction = async (action: 'UPDATE_ORDER_STATUS' | 'UPDATE_PAYMENT_STATUS', payload: Record<string, unknown>) => {
    if (isOnline) {
      // Direct execute if online
      if (action === 'UPDATE_ORDER_STATUS') {
        return await updateOrderStatus(payload.orderId as string, payload.status as string)
      } else {
        return await updatePaymentStatus(payload.orderId as string, payload.status as string)
      }
    } else {
      // Save to IndexedDB if offline
      await localDb.syncQueue.add({
        action,
        payload,
        timestamp: Date.now()
      })
      console.log('Saved to offline queue')
      return { success: true, offline: true }
    }
  }

  return { isOnline, enqueueAction }
}
