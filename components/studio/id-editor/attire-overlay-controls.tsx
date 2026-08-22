'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AttireTransform } from '@/types/studio'
import { ATTIRE_TEMPLATES } from '@/lib/studio-constants'

interface AttireOverlayControlsProps {
  attire: AttireTransform
  onChangeAttire: (newAttire: AttireTransform) => void
}

export function AttireOverlayControls({ attire, onChangeAttire }: AttireOverlayControlsProps) {
  return (
    <Card className="p-4 border-border/40 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">Formal Attire Overlay</h3>
          <p className="text-xs text-muted-foreground">Add Barong or Formal Suit overlay</p>
        </div>
        <Button
          size="sm"
          variant={attire.enabled ? 'default' : 'outline'}
          className="text-xs h-7"
          onClick={() => onChangeAttire({ ...attire, enabled: !attire.enabled })}
        >
          {attire.enabled ? 'Attire ON' : 'Attire OFF'}
        </Button>
      </div>

      {attire.enabled && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {ATTIRE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChangeAttire({ ...attire, templateId: tmpl.id })}
                className={`p-2 rounded-lg border text-left transition-all ${
                  attire.templateId === tmpl.id
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-border/60 hover:border-primary/40'
                }`}
              >
                <span className="text-xs font-semibold block">{tmpl.name.split(' (')[0]}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{tmpl.category}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-border/40 pt-3 space-y-2.5">
            <h4 className="text-xs font-semibold text-muted-foreground">Attire Fit & Position</h4>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Attire Scale:</span>
                <span>{attire.scalePercent}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="150"
                value={attire.scalePercent}
                onChange={(e) => onChangeAttire({ ...attire, scalePercent: Number(e.target.value) })}
                className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Shoulder Height (Y):</span>
                <span>{attire.yPercent}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                value={attire.yPercent}
                onChange={(e) => onChangeAttire({ ...attire, yPercent: Number(e.target.value) })}
                className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Horizontal Alignment (X):</span>
                <span>{attire.xPercent}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="70"
                value={attire.xPercent}
                onChange={(e) => onChangeAttire({ ...attire, xPercent: Number(e.target.value) })}
                className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
