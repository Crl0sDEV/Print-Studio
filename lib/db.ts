import Dexie, { Table } from 'dexie'

export interface SyncOperation {
  id?: number
  action: 'UPDATE_ORDER_STATUS' | 'UPDATE_PAYMENT_STATUS'
  payload: Record<string, unknown> // e.g. { orderId: string, status: string }
  timestamp: number
}

export class PrintOSDatabase extends Dexie {
  syncQueue!: Table<SyncOperation, number>

  constructor() {
    super('PrintOSDatabase')
    this.version(1).stores({
      syncQueue: '++id, action, timestamp'
    })
  }
}

export const localDb = new PrintOSDatabase()
