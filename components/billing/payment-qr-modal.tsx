'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { SAAS_PLANS, PlanTierKey, ADMIN_PAYMENT_INFO } from '@/lib/plans'
import { submitSubscriptionRequest } from '@/app/dashboard/billing/actions'
import { QrDisplayPanel } from './qr-display-panel'
import { Upload, Loader2, Zap, AlertCircle } from 'lucide-react'

interface PaymentQrModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlanKey: PlanTierKey
  shopId: string
}

export function PaymentQrModal({
  isOpen,
  onClose,
  selectedPlanKey,
  shopId,
}: PaymentQrModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'maya'>('gcash')
  const [copied, setCopied] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const plan = SAAS_PLANS[selectedPlanKey] || SAAS_PLANS.pro_monthly
  const paymentDetails = ADMIN_PAYMENT_INFO[paymentMethod]

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentDetails.mobileNumber.replace(/[^0-9]/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('Receipt image must be smaller than 8MB')
        return
      }
      setReceiptFile(file)
      setErrorMessage(null)
      const reader = new FileReader()
      reader.onload = (event) => setPreviewUrl(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!referenceNumber || referenceNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid GCash / Maya Reference Number')
      return
    }
    if (!receiptFile) {
      setErrorMessage('Please upload a screenshot of your payment receipt')
      return
    }

    setErrorMessage(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('shopId', shopId)
      formData.append('planTier', selectedPlanKey)
      formData.append('amountPaid', plan.pricePhp.toString())
      formData.append('paymentMethod', paymentMethod)
      formData.append('referenceNumber', referenceNumber.trim())
      formData.append('receiptFile', receiptFile)

      const res = await submitSubscriptionRequest(formData)
      if (res?.error) {
        setErrorMessage(res.error)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        onClose()
      }
    } catch {
      setErrorMessage('Failed to submit subscription request. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[500px] p-0">
        <DialogHeader className="p-5 pb-3 border-b border-border/40 bg-card/40">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Upgrade to {plan.name}
            </DialogTitle>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-mono text-xs">
              PHP {plan.pricePhp.toLocaleString()}
            </Badge>
          </div>
          <DialogDescription className="text-xs mt-1">
            Scan the QR code below via GCash or Maya and upload your proof of payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/15 text-destructive text-xs font-medium animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <QrDisplayPanel
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            copied={copied}
            handleCopyNumber={handleCopyNumber}
          />

          {/* Reference Number Input */}
          <div className="space-y-1.5">
            <Label htmlFor="refNo" className="text-xs font-semibold">
              {paymentMethod.toUpperCase()} Reference Number
            </Label>
            <Input
              id="refNo"
              type="text"
              placeholder="e.g. 9021 3482 1928"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
              maxLength={30}
              className="h-9 text-sm font-mono"
            />
          </div>

          {/* Receipt File Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Screenshot / Proof of Payment</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            {previewUrl ? (
              <div className="relative rounded-lg border border-border/50 overflow-hidden bg-background p-2 flex items-center justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Receipt preview" className="h-16 w-16 object-cover rounded" />
                <Button size="sm" variant="outline" type="button" onClick={() => fileInputRef.current?.click()} className="text-xs h-7">
                  Change Image
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 rounded-lg border-2 border-dashed border-border/60 hover:border-primary/50 text-center flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:bg-primary/5 transition-all"
              >
                <Upload className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Click to upload payment screenshot</span>
                <span className="text-[10px]">Supports PNG, JPG, WebP up to 8MB</span>
              </button>
            )}
          </div>

          <Button type="submit" className="w-full font-bold h-10 shadow-md mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting for Verification...
              </>
            ) : (
              'Submit Proof & Upgrade Plan'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
