'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IdPresetKey } from '@/types/studio'
import { ID_PRESETS } from '@/lib/studio-constants'

interface IdPresetSelectorProps {
  selectedPreset: IdPresetKey
  onSelectPreset: (key: IdPresetKey) => void
  subjectScale: number
  onChangeScale: (scale: number) => void
  subjectOffsetY: number
  onChangeOffsetY: (y: number) => void
  subjectOffsetX: number
  onChangeOffsetX: (x: number) => void
}

export function IdPresetSelector({
  selectedPreset,
  onSelectPreset,
  subjectScale,
  onChangeScale,
  subjectOffsetY,
  onChangeOffsetY,
  subjectOffsetX,
  onChangeOffsetX,
}: IdPresetSelectorProps) {
  return (
    <Card className="p-4 border-border/40 space-y-4">
      <div>
        <h3 className="font-bold text-sm">Select ID Picture Size</h3>
        <p className="text-xs text-muted-foreground">Standard Philippine & International photo sizes</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.values(ID_PRESETS).filter((p) => p.id !== 'custom').map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.id)}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              selectedPreset === preset.id
                ? 'border-primary bg-primary/10 ring-1 ring-primary font-medium'
                : 'border-border/60 hover:border-primary/40 bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{preset.name.split(' ')[0]}</span>
              {preset.badge && (
                <Badge variant="secondary" className="text-[9px] h-4 px-1">{preset.badge}</Badge>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{preset.widthInches}&quot; × {preset.heightInches}&quot;</p>
          </button>
        ))}
      </div>

      <div className="border-t border-border/40 pt-3 space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground">Subject Position & Zoom</h4>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Zoom / Scale:</span>
            <span>{subjectScale}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={subjectScale}
            onChange={(e) => onChangeScale(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Vertical Pan:</span>
              <span>{subjectOffsetY}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={subjectOffsetY}
              onChange={(e) => onChangeOffsetY(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Horizontal Pan:</span>
              <span>{subjectOffsetX}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={subjectOffsetX}
              onChange={(e) => onChangeOffsetX(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
