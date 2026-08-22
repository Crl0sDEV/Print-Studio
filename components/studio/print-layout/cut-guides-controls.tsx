'use client'

import { Card } from '@/components/ui/card'
import { CutGuideStyle } from '@/types/studio'
import { Scissors } from 'lucide-react'

interface CutGuidesControlsProps {
  cutGuideStyle: CutGuideStyle
  onSelectCutGuide: (style: CutGuideStyle) => void
  gapInches: number
  onChangeGap: (gap: number) => void
}

export function CutGuidesControls({
  cutGuideStyle,
  onSelectCutGuide,
  gapInches,
  onChangeGap,
}: CutGuidesControlsProps) {
  return (
    <Card className="p-4 border-border/40 space-y-3">
      <h3 className="font-bold text-sm flex items-center gap-2">
        <Scissors className="h-4 w-4 text-primary" /> Cut Guides & Spacing
      </h3>

      <div className="grid grid-cols-2 gap-1.5">
        {[
          { id: 'crop_ticks', name: 'Crop Marks (Ticks)' },
          { id: 'dashed_lines', name: 'Dashed Cutter Lines' },
          { id: 'solid_lines', name: 'Solid Border' },
          { id: 'none', name: 'None (Borderless)' },
        ].map((guide) => (
          <button
            key={guide.id}
            type="button"
            onClick={() => onSelectCutGuide(guide.id as CutGuideStyle)}
            className={`p-2 rounded-lg border text-left text-xs transition-all ${
              cutGuideStyle === guide.id
                ? 'border-primary bg-primary/10 ring-1 ring-primary font-medium'
                : 'border-border/60 hover:border-primary/40'
            }`}
          >
            {guide.name}
          </button>
        ))}
      </div>

      <div className="space-y-2 pt-2 border-t border-border/40">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Photo Gap (Spacing):</span>
            <span>{gapInches.toFixed(2)}&quot; ({Math.round(gapInches * 25.4)}mm)</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.25"
            step="0.01"
            value={gapInches}
            onChange={(e) => onChangeGap(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </Card>
  )
}
