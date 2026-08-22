'use client'

import { Button } from '@/components/ui/button'
import { QrCode, Copy, Check } from 'lucide-react'
import { ADMIN_PAYMENT_INFO } from '@/lib/plans'

interface QrDisplayPanelProps {
  paymentMethod: 'gcash' | 'maya'
  setPaymentMethod: (method: 'gcash' | 'maya') => void
  copied: boolean
  handleCopyNumber: () => void
}

export function QrDisplayPanel({
  paymentMethod,
  setPaymentMethod,
  copied,
  handleCopyNumber,
}: QrDisplayPanelProps) {
  const paymentDetails =
    paymentMethod === 'gcash' ? ADMIN_PAYMENT_INFO.gcash : ADMIN_PAYMENT_INFO.maya

  return (
    <div className="space-y-3">
      {/* Payment Method Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setPaymentMethod('gcash')}
          className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
            paymentMethod === 'gcash'
              ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500'
              : 'border-border/60 hover:border-primary/40 text-muted-foreground'
          }`}
        >
          GCash QR
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('maya')}
          className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
            paymentMethod === 'maya'
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500'
              : 'border-border/60 hover:border-primary/40 text-muted-foreground'
          }`}
        >
          Maya QR
        </button>
      </div>

      {/* QR Code & Account Box */}
      <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-secondary/20 space-y-2.5 text-center">
        <div className="h-40 w-40 bg-white p-2 rounded-lg border border-border/40 shadow-xs flex items-center justify-center">
          <QrCode className="h-32 w-32 text-slate-800" />
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Account Name:</span>
          <strong className="text-xs">{ADMIN_PAYMENT_INFO.accountName}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold bg-background px-2.5 py-1 rounded-md border border-border/40">
            {paymentDetails.mobileNumber}
          </span>
          <Button size="icon-xs" variant="outline" type="button" onClick={handleCopyNumber} title="Copy number">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
