'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PaperSizeKey } from '@/types/studio'
import { PAPER_DIMENSIONS } from '@/lib/studio-constants'
import { Printer, RotateCw } from 'lucide-react'

interface PaperOrientationSelectorProps {
  paperKey: PaperSizeKey
  onSelectPaper: (key: PaperSizeKey) => void
  orientation: 'portrait' | 'landscape'
  onToggleOrientation: () => void
}

export function PaperOrientationSelector({
  paperKey,
  onSelectPaper,
  orientation,
  onToggleOrientation,
}: PaperOrientationSelectorProps) {
  return (
    <Card className="p-4 border-border/40 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Printer className="h-4 w-4 text-primary" /> Paper Specification
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7"
          onClick={onToggleOrientation}
        >
          <RotateCw className="mr-1 h-3 w-3" /> {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {Object.keys(PAPER_DIMENSIONS).map((key) => {
          const p = PAPER_DIMENSIONS[key as PaperSizeKey]
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectPaper(key as PaperSizeKey)}
              className={`p-2 rounded-lg border text-left transition-all ${
                paperKey === key
                  ? 'border-primary bg-primary/10 ring-1 ring-primary font-bold'
                  : 'border-border/60 hover:border-primary/40'
              }`}
            >
              <span className="text-xs block">{p.name.split(' ')[0]}</span>
              <span className="text-[10px] text-muted-foreground">{p.widthInches}&quot;×{p.heightInches}&quot;</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
