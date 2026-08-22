'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ImageAdjustments } from '@/types/studio'
import { RotateCw, FlipHorizontal } from 'lucide-react'

interface ImageFilterControlsProps {
  adjustments: ImageAdjustments
  onChangeAdjustments: (newAdj: ImageAdjustments) => void
}

export function ImageFilterControls({ adjustments, onChangeAdjustments }: ImageFilterControlsProps) {
  return (
    <Card className="p-4 border-border/40 space-y-3">
      <h3 className="font-bold text-sm">Image Lighting & Clarity</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Brightness:</span>
          <span>{adjustments.brightness}</span>
        </div>
        <input
          type="range"
          min="-50"
          max="50"
          value={adjustments.brightness}
          onChange={(e) => onChangeAdjustments({ ...adjustments, brightness: Number(e.target.value) })}
          className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Contrast:</span>
          <span>{adjustments.contrast}</span>
        </div>
        <input
          type="range"
          min="-50"
          max="50"
          value={adjustments.contrast}
          onChange={(e) => onChangeAdjustments({ ...adjustments, contrast: Number(e.target.value) })}
          className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Sharpness / Clarity:</span>
          <span>{adjustments.sharpness}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="80"
          value={adjustments.sharpness}
          onChange={(e) => onChangeAdjustments({ ...adjustments, sharpness: Number(e.target.value) })}
          className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onChangeAdjustments({ ...adjustments, rotation: (adjustments.rotation + 90) % 360 })}
        >
          <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Rotate
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onChangeAdjustments({ ...adjustments, flipHorizontal: !adjustments.flipHorizontal })}
        >
          <FlipHorizontal className="mr-1.5 h-3.5 w-3.5" /> Mirror
        </Button>
      </div>
    </Card>
  )
}
