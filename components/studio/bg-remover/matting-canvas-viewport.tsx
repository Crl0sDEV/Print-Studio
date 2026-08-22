'use client'

import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { ToolMode } from './matting-tools-panel'

interface MattingCanvasViewportProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  selectedBgColor: string
  activeTool: ToolMode
  zoom: number
  onChangeZoom: (newZoom: number) => void
  onCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerUp: () => void
}

export function MattingCanvasViewport({
  canvasRef,
  selectedBgColor,
  activeTool,
  zoom,
  onChangeZoom,
  onCanvasClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: MattingCanvasViewportProps) {
  const isBrushMode = activeTool === 'eraser' || activeTool === 'restore'

  return (
    <div className="flex-1 bg-secondary/15 rounded-xl border border-border/40 p-2 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] sm:min-h-[420px] lg:min-h-[520px]">
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex items-center gap-1 bg-background/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/50 shadow-sm">
        <Button size="icon-xs" variant="ghost" onClick={() => onChangeZoom(Math.max(30, zoom - 15))}>
          <ZoomOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Button>
        <span className="text-[10px] sm:text-xs font-mono font-medium px-1">{zoom}%</span>
        <Button size="icon-xs" variant="ghost" onClick={() => onChangeZoom(Math.min(250, zoom + 15))}>
          <ZoomIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Button>
      </div>

      <div
        className="relative rounded-lg shadow-lg border border-border/60 overflow-hidden transition-transform duration-100 ease-out max-w-full"
        style={{
          transform: `scale(${zoom / 100})`,
          backgroundColor: selectedBgColor !== 'transparent' ? selectedBgColor : undefined,
        }}
      >
        {selectedBgColor === 'transparent' && (
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] bg-[size:16px_16px]" />
        )}

        <canvas
          ref={canvasRef}
          onClick={onCanvasClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`max-h-[260px] sm:max-h-[380px] md:max-h-[480px] max-w-full object-contain ${
            isBrushMode ? 'touch-none cursor-cell' : activeTool === 'color_key' ? 'cursor-crosshair' : 'cursor-default'
          }`}
        />
      </div>

      <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-3 text-center px-2">
        {activeTool === 'color_key'
          ? 'Tap or click anywhere on the backdrop to remove that color'
          : activeTool === 'eraser'
          ? 'Drag over areas to manually erase'
          : activeTool === 'restore'
          ? 'Drag over erased areas to restore'
          : 'Choose a tool from the panel'}
      </p>
    </div>
  )
}
