'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { usePathname } from 'next/navigation'
import { Lightbulb, MousePointerClick, TrendingUp, Users, Settings } from 'lucide-react'

export function TutorialModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname()

  const renderContent = () => {
    if (pathname.includes('/orders')) {
      return (
        <div className="space-y-4 pt-4">
          <div className="flex gap-3 items-start">
            <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0"><MousePointerClick className="w-5 h-5" /></div>
            <div>
              <h4 className="font-semibold text-sm">Smart Data Table</h4>
              <p className="text-sm text-muted-foreground mt-1">View all your orders sorted by latest. Click on any order row to open its full details and change its status.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0"><Lightbulb className="w-5 h-5" /></div>
            <div>
              <h4 className="font-semibold text-sm">Print Receipts & Mark as Paid</h4>
              <p className="text-sm text-muted-foreground mt-1">Inside the Order Details modal, you can mark the order as Paid, change its status from a dropdown, or print a Job Ticket/Receipt.</p>
            </div>
          </div>
        </div>
      )
    }

    if (pathname.includes('/reports')) {
      return (
        <div className="space-y-4 pt-4">
          <div className="flex gap-3 items-start">
            <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <h4 className="font-semibold text-sm">Reading Your Analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">This page tracks your shop's performance. The "Total Paid Revenue" only counts orders that have been marked as PAID in your orders table.</p>
            </div>
          </div>
        </div>
      )
    }

    if (pathname.includes('/customers')) {
      return (
        <div className="space-y-4 pt-4">
          <div className="flex gap-3 items-start">
            <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0"><Users className="w-5 h-5" /></div>
            <div>
              <h4 className="font-semibold text-sm">Customer Lifetime Value (LTV)</h4>
              <p className="text-sm text-muted-foreground mt-1">The system automatically calculates how much each customer has spent in your shop. Customers with 5 or more orders will automatically get a VIP badge!</p>
            </div>
          </div>
        </div>
      )
    }

    if (pathname.includes('/qr')) {
      return (
        <div className="space-y-4 pt-4">
          <div className="flex gap-3 items-start">
            <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0"><Lightbulb className="w-5 h-5" /></div>
            <div>
              <h4 className="font-semibold text-sm">Your Storefront QR Code</h4>
              <p className="text-sm text-muted-foreground mt-1">This QR code points directly to your public file upload page. Print it and display it in your physical shop so walk-in customers can easily send files via their phones!</p>
            </div>
          </div>
        </div>
      )
    }

    if (pathname.includes('/settings')) {
      return (
        <div className="space-y-4 pt-4">
          <div className="flex gap-3 items-start">
            <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0"><Settings className="w-5 h-5" /></div>
            <div>
              <h4 className="font-semibold text-sm">Customizing Your Store</h4>
              <p className="text-sm text-muted-foreground mt-1">Change your shop name or your public URL slug here. Be careful when changing your slug, as your old link will stop working for your customers.</p>
            </div>
          </div>
        </div>
      )
    }

    // Default (Overview)
    return (
      <div className="space-y-4 pt-4">
        <div className="flex gap-3 items-start">
          <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0"><Lightbulb className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-sm">Welcome to the Dashboard!</h4>
            <p className="text-sm text-muted-foreground mt-1">This is your main control panel. From here, you can see quick statistics about your shop and manage your Print Presets.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0"><MousePointerClick className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-sm">Creating Print Presets</h4>
            <p className="text-sm text-muted-foreground mt-1">Scroll down to the "Print Presets Catalog". Here you can add the services you offer (like ID Pictures or Bond Paper). After adding a preset, don't forget to configure its Pricing Matrix!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" /> Page Guide
          </DialogTitle>
          <DialogDescription>
            Tips and instructions for using the current page.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
