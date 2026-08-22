'use client'

import { Card } from '@/components/ui/card'
import { BACKDROP_COLORS } from '@/lib/studio-constants'
import { Palette, Check } from 'lucide-react'

interface BackdropColorPaletteProps {
  selectedBgColor: string
  onSelectColor: (color: string) => void
  customHex: string
  onChangeCustomHex: (hex: string) => void
}

export function BackdropColorPalette({
  selectedBgColor,
  onSelectColor,
  customHex,
  onChangeCustomHex,
}: BackdropColorPaletteProps) {
  return (
    <Card className="p-4 border-border/40 space-y-3">
      <h3 className="font-bold text-sm flex items-center gap-2">
        <Palette className="h-4 w-4 text-primary" /> Replace Background Color
      </h3>

      <div className="grid grid-cols-4 gap-2">
        {BACKDROP_COLORS.map((bg) => (
          <button
            key={bg.id}
            type="button"
            onClick={() => onSelectColor(bg.value)}
            className={`group relative flex flex-col items-center justify-center p-2 rounded-md border transition-all ${
              selectedBgColor === bg.value
                ? 'border-primary ring-2 ring-primary/30 font-semibold'
                : 'border-border/60 hover:border-primary/50'
            }`}
            title={bg.name}
          >
            <div
              className={`h-7 w-7 rounded-full border border-black/10 shadow-inner flex items-center justify-center ${
                bg.value === 'transparent'
                  ? 'bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:8px_8px]'
                  : ''
              }`}
              style={{ backgroundColor: bg.value !== 'transparent' ? bg.value : undefined }}
            >
              {selectedBgColor === bg.value && (
                <Check
                  className={`h-4 w-4 ${
                    bg.value === '#FFFFFF' || bg.value === 'transparent'
                      ? 'text-black'
                      : 'text-white'
                  }`}
                />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 line-clamp-1 text-center">
              {bg.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
        <input
          type="color"
          value={customHex}
          onChange={(e) => {
            onChangeCustomHex(e.target.value)
            onSelectColor(e.target.value)
          }}
          className="h-8 w-8 rounded cursor-pointer border border-border"
        />
        <span className="text-xs text-muted-foreground">Custom Color Hex:</span>
        <span className="text-xs font-mono font-medium ml-auto">{customHex.toUpperCase()}</span>
      </div>
    </Card>
  )
}
