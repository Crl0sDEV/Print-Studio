'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { usePathname } from 'next/navigation'
import { Lightbulb } from 'lucide-react'
import { TutorialSectionContent } from './tutorial-section-content'

interface TutorialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TutorialModal({ open, onOpenChange }: TutorialModalProps) {
  const pathname = usePathname()

  const getModalTitle = () => {
    if (pathname.includes('/studio')) return 'Photo Studio & ID Lab Guide'
    if (pathname.includes('/orders')) return 'Orders Management Guide'
    if (pathname.includes('/reports')) return 'Reports & Analytics Guide'
    return 'Prynt Workspace Guide'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            {getModalTitle()}
          </DialogTitle>
          <DialogDescription>
            Master key workflows and operational features for your print shop.
          </DialogDescription>
        </DialogHeader>

        <TutorialSectionContent pathname={pathname} />
      </DialogContent>
    </Dialog>
  )
}
