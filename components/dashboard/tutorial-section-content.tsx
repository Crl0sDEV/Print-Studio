'use client'

import {
  MousePointerClick,
  TrendingUp,
  Users,
  Settings,
  Crop,
  Printer,
  FileText,
  Zap,
} from 'lucide-react'

interface TutorialSectionContentProps {
  pathname: string
}

export function TutorialSectionContent({ pathname }: TutorialSectionContentProps) {
  if (pathname.includes('/studio')) {
    return (
      <div className="space-y-4 pt-3 max-h-[70vh] overflow-y-auto pr-1">
        <div className="flex gap-3 items-start">
          <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">1. Background Eraser & Color Swap</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Use <strong>AI One-Click</strong> for automatic subject cutout or <strong>Magic Wand</strong> for instant backdrop erasing. Replace background with White, Studio Blue, or Red with 1 click.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="bg-blue-500/10 p-2 rounded-full text-blue-500 shrink-0">
            <Crop className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">2. Philippine ID Lab & Attire</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Crop directly to 1x1, 2x2, Passport (35x45mm), or PRC/CSC sizes. Overlay <strong>Barong Tagalog</strong> or <strong>Business Suit</strong>, and generate official <strong>CSC/PRC Nametag</strong> banners.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="bg-emerald-500/10 p-2 rounded-full text-emerald-500 shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">3. Automated Gang Sheet Imposition</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Select your paper size (4R, A4, Short, Long) and pick a 1-click combo package (e.g. 4pcs 2x2 + 8pcs 1x1). Add corner crop ticks or cutting lines, then click <strong>PRINT TO PRINTER</strong> or download 300 DPI PNG/PDF.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="bg-purple-500/10 p-2 rounded-full text-purple-500 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">4. Document & Photocopy Enhancer</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Need to photocopy a dark receipt, contract, or ID? Use the Document Enhancer tab to remove gray toner noise and boost text contrast for crystal-clear prints.
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-[11px] text-muted-foreground">
          Tip: Press <kbd className="px-1 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl+B</kbd> or click <strong>Maximize Workspace</strong> to collapse the sidebar for full screen canvas editing.
        </div>
      </div>
    )
  }

  if (pathname.includes('/orders')) {
    return (
      <div className="space-y-4 pt-4">
        <div className="flex gap-3 items-start">
          <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
            <MousePointerClick className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Smart Orders Board</h4>
            <p className="text-sm text-muted-foreground mt-1">
              View all orders with real-time status updates. Click on any row to open the full order details, contact info, and uploaded print assets.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="bg-amber-500/10 p-2 rounded-full text-amber-500 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Direct Photo Studio Integration</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Click <strong>Open in Studio</strong> on any order item to instantly import customer photos into the AI background remover and Philippine ID lab.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="bg-blue-500/10 p-2 rounded-full text-blue-500 shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Thermal Receipts</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Generate 58mm / 80mm ESC/POS compatible thermal receipts or print A4 claim stubs with QR verification codes for your customers.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (pathname.includes('/reports')) {
    return (
      <div className="space-y-4 pt-4">
        <div className="flex gap-3 items-start">
          <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Sales Analytics</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Track daily, weekly, and monthly revenue performance with interactive visual charts and gross profit calculations.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="bg-emerald-500/10 p-2 rounded-full text-emerald-500 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Customer Retention</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Identify top customers and repeat print volume to grow your local printing business.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex gap-3 items-start">
        <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Integrated Print OS</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome to Prynt. Navigate via the sidebar to manage Orders, ID Photo Studio, Customer Directories, and Financial Reports.
          </p>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <div className="bg-purple-500/10 p-2 rounded-full text-purple-500 shrink-0">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Storefront Configuration</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Visit <strong>Settings</strong> to customize your shop branding, public URL slug, and pricing matrix presets.
          </p>
        </div>
      </div>
    </div>
  )
}
