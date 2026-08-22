'use client'

import { Badge } from '@/components/ui/badge'
import { IdPresetKey } from '@/types/studio'
import { ID_PRESETS } from '@/lib/studio-constants'

interface IdCanvasPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  selectedPreset: IdPresetKey
  isAttireEnabled: boolean
  isNametagEnabled: boolean
}

export function IdCanvasPreview({
  canvasRef,
  selectedPreset,
  isAttireEnabled,
  isNametagEnabled,
}: IdCanvasPreviewProps) {
  const preset = ID_PRESETS[selectedPreset]

  return (
    <div className="flex-1 bg-secondary/15 rounded-xl border border-border/40 p-3 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[280px] sm:min-h-[400px] lg:min-h-[520px]">
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-2.5">
        <Badge variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5 bg-background">
          {preset.name} ({preset.widthInches}&quot; × {preset.heightInches}&quot;)
        </Badge>
        {isAttireEnabled && (
          <Badge className="text-[10px] sm:text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">
            Formal Attire ON
          </Badge>
        )}
        {isNametagEnabled && (
          <Badge className="text-[10px] sm:text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
            Nametag ON
          </Badge>
        )}
      </div>

      <div className="relative rounded-lg shadow-2xl border-2 border-white/90 dark:border-white/20 overflow-hidden max-h-[280px] sm:max-h-[400px] md:max-h-[500px] flex items-center justify-center max-w-full">
        <canvas ref={canvasRef} className="max-h-[250px] sm:max-h-[380px] md:max-h-[470px] max-w-full object-contain rounded-md" />
      </div>

      <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-2.5 text-center px-2">
        Master 1200px calibrated ID canvas. Click &quot;Ready for Print Layout&quot; to tile onto paper.
      </p>
    </div>
  )
}
