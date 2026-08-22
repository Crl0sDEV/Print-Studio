'use client'

import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles, Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProGateModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
  featureDescription?: string
}

export function ProGateModal({
  isOpen,
  onClose,
  featureName,
  featureDescription = 'This premium tool is part of the Pro Print Master plan.',
}: ProGateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2">
          <Crown className="h-6 w-6 text-amber-500 fill-amber-500" />
        </div>

        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-[10px]">
              PRO FEATURE
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold">
            Unlock {featureName}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {featureDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-3 rounded-xl bg-secondary/30 border border-border/40 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Unlimited AI Background Eraser & High-Res PNGs</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Philippine Formal Attire Suite (Barong, Suits, Uniforms)</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>All Imposition Sheets (4R, 5R, A4, Long, A3)</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Crisp 300 DPI PDF Exports without Watermark</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto text-xs">
            Maybe Later
          </Button>
          <Link
            href="/dashboard/billing"
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }),
              'w-full sm:flex-1 font-bold text-xs shadow-md gap-1 bg-primary text-primary-foreground'
            )}
            onClick={onClose}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Upgrade for ₱199/mo <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
