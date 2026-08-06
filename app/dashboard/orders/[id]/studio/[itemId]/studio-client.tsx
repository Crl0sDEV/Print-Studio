'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Printer, Settings, Maximize, Move } from 'lucide-react'
import { Card } from '@/components/ui/card'

const PAPER_SIZES = {
  'A4': { width: 8.27, height: 11.69 },
  'Letter': { width: 8.5, height: 11 },
  '4R': { width: 4, height: 6 },
}

export function PrintStudioClient({ item }: { item: any }) {
  const [paperSize, setPaperSize] = useState<keyof typeof PAPER_SIZES>('4R')
  const [ppi, setPpi] = useState(96) // standard screen pixels per inch, adjust for accurate print sizing
  
  // Dimensions in inches
  const itemWidth = item.presets?.width_inches || 1
  const itemHeight = item.presets?.height_inches || 1
  
  // Calculate how many fit based on paper size
  const paperW = PAPER_SIZES[paperSize].width
  const paperH = PAPER_SIZES[paperSize].height
  
  const margin = 0.5 // 0.5 inch margin
  const availW = paperW - (margin * 2)
  const availH = paperH - (margin * 2)

  const cols = Math.floor(availW / itemWidth)
  const rows = Math.floor(availH / itemHeight)
  const copiesToGenerate = cols * rows

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex h-screen bg-neutral-100 flex-col md:flex-row print:bg-white print:h-auto">
      
      {/* Sidebar Controls (Hidden on Print) */}
      <div className="w-full md:w-80 bg-white border-r border-border/40 p-6 flex flex-col gap-6 print:hidden shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Printer className="text-primary" /> Auto-Layout Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Smart Imposition Generator</p>
        </div>

        <Card className="p-4 bg-secondary/20 border-border/40 space-y-3">
          <h3 className="font-semibold text-sm border-b pb-2">Preset Details</h3>
          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium text-right">{item.presets?.name}</span>
          </div>
          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Asset Size:</span>
            <span className="font-medium text-right">{itemWidth}" x {itemHeight}"</span>
          </div>
          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Copies Fit:</span>
            <span className="font-medium text-right text-primary">{copiesToGenerate} copies</span>
          </div>
        </Card>

        <div className="space-y-3">
          <label className="text-sm font-medium">Select Paper Size</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(PAPER_SIZES).map((size) => (
              <Button 
                key={size}
                variant={paperSize === size ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaperSize(size as keyof typeof PAPER_SIZES)}
                className="w-full"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border/40">
          <Button className="w-full h-12 text-lg font-bold" onClick={handlePrint}>
            <Printer className="mr-2 h-5 w-5" /> PRINT NOW
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Pressing print will use strict CSS physical dimensions (inches) to guarantee accurate hardware sizing.
          </p>
        </div>
      </div>

      {/* Canvas Workspace (This gets printed) */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center print:p-0 print:overflow-visible bg-neutral-100 print:bg-white">
        
        {/* The Virtual Paper */}
        <div 
          className="bg-white shadow-xl relative print:shadow-none print:m-0"
          style={{
            // Physical sizing using CSS absolute inches. Browsers map this accurately to hardware!
            width: `${paperW}in`,
            height: `${paperH}in`,
            padding: `${margin}in`,
            pageBreakAfter: 'always',
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${itemWidth}in)`,
            gridTemplateRows: `repeat(${rows}, ${itemHeight}in)`,
            justifyContent: 'center',
            alignContent: 'start',
            gap: '0.1in' // slight gap for cutting
          }}
        >
          {Array.from({ length: copiesToGenerate }).map((_, i) => (
            <div 
              key={i} 
              className="relative overflow-hidden border border-dashed border-gray-200 print:border-none"
              style={{ width: `${itemWidth}in`, height: `${itemHeight}in` }}
            >
              {/* Note: In a real app we'd allow crop/pan. Here we use object-cover to fit perfectly. */}
              {item.file_url ? (
                <Image 
                  src={item.file_url} 
                  alt="Print Asset" 
                  fill
                  className="object-cover" 
                  crossOrigin="anonymous" 
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
