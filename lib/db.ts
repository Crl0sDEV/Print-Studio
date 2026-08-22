import Dexie, { Table } from 'dexie'
import { OrderStatus, PaymentStatus } from '@/types/database'

export type OfflineMutationAction = 'UPDATE_ORDER_STATUS' | 'UPDATE_PAYMENT_STATUS'

export interface OfflineSyncItem {
  id?: number
  action: OfflineMutationAction
  payload: {
    orderId: string
    status: OrderStatus | PaymentStatus
  }
  timestamp: number
}

export interface LocalStudioDraft {
  id: string
  shopId: string
  name: string
  canvasState: Record<string, unknown>
  updatedAt: number
}

export class PryntLocalDatabase extends Dexie {
  syncQueue!: Table<OfflineSyncItem, number>
  studioDrafts!: Table<LocalStudioDraft, string>

  constructor() {
    super('PryntLocalDatabase')
    this.version(2).stores({
      syncQueue: '++id, action, timestamp',
      studioDrafts: 'id, shopId, updatedAt',
    })
  }
}

export const localDb = new PryntLocalDatabase()

// Type-safe DAL Repository Helpers
export async function enqueueOfflineAction(
  action: OfflineMutationAction,
  orderId: string,
  status: OrderStatus | PaymentStatus
): Promise<number> {
  return await localDb.syncQueue.add({
    action,
    payload: { orderId, status },
    timestamp: Date.now(),
  })
}

export async function getPendingOfflineActions(): Promise<OfflineSyncItem[]> {
  return await localDb.syncQueue.orderBy('timestamp').toArray()
}

export async function removeOfflineAction(id: number): Promise<void> {
  await localDb.syncQueue.delete(id)
}
