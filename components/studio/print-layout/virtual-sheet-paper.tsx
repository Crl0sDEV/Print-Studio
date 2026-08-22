'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PaperSizeKey, CutGuideStyle, PlacedPhotoItem } from '@/types/studio'
import { PAPER_DIMENSIONS } from '@/lib/studio-constants'
import { ZoomIn, ZoomOut, Maximize, AlertTriangle } from 'lucide-react'

interface VirtualSheetPaperProps {
  paperKey: PaperSizeKey
  paperW: number
  paperH: number
  placedItems: PlacedPhotoItem[]
  isOverflow: boolean
  cutGuideStyle: CutGuideStyle
  cutGuideColor: string
  zoom: number
  onChangeZoom: (newZoom: number) => void
}

export function VirtualSheetPaper({
  paperKey,
  paperW,
  paperH,
  placedItems,
  isOverflow,
  cutGuideStyle,
  cutGuideColor,
  zoom,
  onChangeZoom,
}: VirtualSheetPaperProps) {
  const scale = zoom / 100
  const scaledWidthInches = paperW * scale
  const scaledHeightInches = paperH * scale

  return (
    <div className="flex-1 w-full min-w-0 bg-neutral-200/70 dark:bg-neutral-900/60 rounded-xl border border-border/40 p-3 sm:p-4 md:p-6 flex flex-col items-center justify-start overflow-hidden print:p-0 print:m-0 print:border-none print:bg-white print:overflow-visible min-h-[450px]">
      {/* Top Controls & Badges Toolbar (Clean Non-Overlapping Layout) */}
      <div className="print:hidden w-full flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-3 border-b border-border/40">
        {/* Left: Paper Specs & Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Badge variant="outline" className="text-[11px] bg-background font-mono">
            {PAPER_DIMENSIONS[paperKey].name} ({paperW}&quot; × {paperH}&quot;)
          </Badge>
          <Badge className="text-[11px] bg-primary/20 text-primary border-primary/30 font-medium">
            {placedItems.length} Photos Fitted
          </Badge>
          {isOverflow && (
            <Badge variant="destructive" className="text-[11px] flex items-center gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-medium">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Sheet Full • Select A4 / Long paper to fit more
            </Badge>
          )}
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center self-end md:self-auto gap-1 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border/50 shadow-sm shrink-0">
          <Button size="icon-xs" variant="ghost" onClick={() => onChangeZoom(Math.max(20, zoom - 10))} title="Zoom Out">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-mono font-medium px-1.5 min-w-[38px] text-center">{zoom}%</span>
          <Button size="icon-xs" variant="ghost" onClick={() => onChangeZoom(Math.min(150, zoom + 10))} title="Zoom In">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button 
            size="icon-xs" 
            variant="ghost" 
            onClick={() => onChangeZoom(paperKey === 'A3' ? 35 : (paperKey === 'A4' || paperKey === 'Letter' || paperKey === 'Folio' || paperKey === 'Legal') ? 50 : paperKey === '5R' ? 65 : 75)} 
            title="Auto Fit Zoom"
          >
            <Maximize className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* VIRTUAL PAPER VIEWPORT (Bounded so it never breaks dashboard layout) */}
      <div className="w-full min-w-0 flex-1 flex items-start justify-center overflow-auto py-4 px-2">
        {/* Scaled Bounding Box matching exact transformed dimensions */}
        <div
          className="relative transition-all duration-100 ease-out shrink-0"
          style={{
            width: `${scaledWidthInches}in`,
            height: `${scaledHeightInches}in`,
          }}
        >
          <div
            id="print-sheet-paper"
            className="bg-white text-black shadow-2xl relative print:shadow-none print:m-0 print:p-0 origin-top-left"
            style={{
              width: `${paperW}in`,
              height: `${paperH}in`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              pageBreakAfter: 'always',
            }}
          >
            {placedItems.map((item) => (
              <div
                key={item.id}
                className="absolute overflow-hidden"
                style={{
                  left: `${item.xInches}in`,
                  top: `${item.yInches}in`,
                  width: `${item.widthInches}in`,
                  height: `${item.heightInches}in`,
                  border:
                    cutGuideStyle === 'solid_lines'
                      ? `1px solid ${cutGuideColor}`
                      : cutGuideStyle === 'dashed_lines'
                      ? `1px dashed ${cutGuideColor}`
                      : 'none',
                }}
              >
                <Image
                  src={item.imageSrc}
                  alt="ID Photo"
                  fill
                  unoptimized
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {cutGuideStyle === 'crop_ticks' && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-[1px] bg-slate-400" />
                    <div className="absolute top-0 left-0 h-2 w-[1px] bg-slate-400" />
                    <div className="absolute top-0 right-0 w-2 h-[1px] bg-slate-400" />
                    <div className="absolute top-0 right-0 h-2 w-[1px] bg-slate-400" />
                    <div className="absolute bottom-0 left-0 w-2 h-[1px] bg-slate-400" />
                    <div className="absolute bottom-0 left-0 h-2 w-[1px] bg-slate-400" />
                    <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-slate-400" />
                    <div className="absolute bottom-0 right-0 h-2 w-[1px] bg-slate-400" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
