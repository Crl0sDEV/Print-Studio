'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Sparkles, 
  Wand2, 
  Eraser, 
  Pipette, 
  Undo2, 
  Redo2, 
  RotateCcw, 
  Layers, 
  Loader2 
} from 'lucide-react'

export type ToolMode = 'ai' | 'color_key' | 'eraser' | 'restore'

interface MattingToolsPanelProps {
  activeTool: ToolMode
  onSelectTool: (tool: ToolMode) => void
  tolerance: number
  onChangeTolerance: (val: number) => void
  feather: number
  onChangeFeather: (val: number) => void
  brushSize: number
  onChangeBrushSize: (val: number) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
  isProcessingAI: boolean
  aiProgress: string
  onExecuteAIRemoval: () => void
}

export function MattingToolsPanel({
  activeTool,
  onSelectTool,
  tolerance,
  onChangeTolerance,
  feather,
  onChangeFeather,
  brushSize,
  onChangeBrushSize,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  isProcessingAI,
  aiProgress,
  onExecuteAIRemoval,
}: MattingToolsPanelProps) {
  return (
    <Card className="p-4 border-border/40 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" /> Matting & Eraser Tools
        </h3>
        <div className="flex items-center gap-1">
          <Button size="icon-xs" variant="outline" onClick={onUndo} disabled={!canUndo} title="Undo">
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon-xs" variant="outline" onClick={onRedo} disabled={!canRedo} title="Redo">
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon-xs" variant="ghost" onClick={onReset} title="Reset Image">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={activeTool === 'ai' ? 'default' : 'outline'}
          size="sm"
          className="text-xs justify-start h-9"
          onClick={() => onSelectTool('ai')}
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
          AI One-Click
        </Button>
        <Button
          variant={activeTool === 'color_key' ? 'default' : 'outline'}
          size="sm"
          className="text-xs justify-start h-9"
          onClick={() => onSelectTool('color_key')}
        >
          <Wand2 className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
          Magic Wand
        </Button>
        <Button
          variant={activeTool === 'eraser' ? 'default' : 'outline'}
          size="sm"
          className="text-xs justify-start h-9"
          onClick={() => onSelectTool('eraser')}
        >
          <Eraser className="mr-1.5 h-3.5 w-3.5 text-rose-400" />
          Eraser Brush
        </Button>
        <Button
          variant={activeTool === 'restore' ? 'default' : 'outline'}
          size="sm"
          className="text-xs justify-start h-9"
          onClick={() => onSelectTool('restore')}
        >
          <Pipette className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
          Restore Brush
        </Button>
      </div>

      {activeTool === 'ai' && (
        <div className="p-3 bg-secondary/30 rounded-lg space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Neural model runs locally in browser to cleanly isolate foreground.
          </p>
          <Button className="w-full font-semibold shadow-sm" onClick={onExecuteAIRemoval} disabled={isProcessingAI}>
            {isProcessingAI ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4 text-amber-400" /> Remove Background (AI)
              </>
            )}
          </Button>
          {aiProgress && <p className="text-[11px] text-primary text-center animate-pulse">{aiProgress}</p>}
        </div>
      )}

      {activeTool === 'color_key' && (
        <div className="p-3 bg-secondary/30 rounded-lg space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span>Tolerance:</span>
              <span>{tolerance}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              value={tolerance}
              onChange={(e) => onChangeTolerance(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span>Feather:</span>
              <span>{feather}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={feather}
              onChange={(e) => onChangeFeather(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {(activeTool === 'eraser' || activeTool === 'restore') && (
        <div className="p-3 bg-secondary/30 rounded-lg space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Brush Size:</span>
            <span>{brushSize}px</span>
          </div>
          <input
            type="range"
            min="4"
            max="120"
            value={brushSize}
            onChange={(e) => onChangeBrushSize(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </Card>
  )
}
