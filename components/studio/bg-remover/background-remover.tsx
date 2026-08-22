'use client'

import { Button } from '@/components/ui/button'
import { MattingToolsPanel } from './matting-tools-panel'
import { BackdropColorPalette } from './backdrop-color-palette'
import { MattingCanvasViewport } from './matting-canvas-viewport'
import { useCanvasMatting } from './use-canvas-matting'
import { Check } from 'lucide-react'

interface BackgroundRemoverProps {
  imageSrc: string
  onProceed: (resultDataUrl: string) => void
}

export function BackgroundRemover({ imageSrc, onProceed }: BackgroundRemoverProps) {
  const {
    canvasRef,
    activeTool,
    setActiveTool,
    selectedBgColor,
    setSelectedBgColor,
    tolerance,
    setTolerance,
    feather,
    setFeather,
    brushSize,
    setBrushSize,
    zoom,
    setZoom,
    isProcessingAI,
    aiProgress,
    isDrawing,
    setIsDrawing,
    customHex,
    setCustomHex,
    history,
    historyIndex,
    initializeCanvas,
    pushToHistory,
    handleUndo,
    handleRedo,
    handleAIRemoval,
    handleCanvasClick,
    drawBrushPoint,
  } = useCanvasMatting(imageSrc)

  const handleApply = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const compCanvas = document.createElement('canvas')
    compCanvas.width = canvas.width
    compCanvas.height = canvas.height
    const compCtx = compCanvas.getContext('2d')
    if (!compCtx) return

    if (selectedBgColor !== 'transparent') {
      compCtx.fillStyle = selectedBgColor
      compCtx.fillRect(0, 0, compCanvas.width, compCanvas.height)
    }
    compCtx.drawImage(canvas, 0, 0)
    onProceed(compCanvas.toDataURL('image/png'))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[620px]">
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <MattingToolsPanel
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          tolerance={tolerance}
          onChangeTolerance={setTolerance}
          feather={feather}
          onChangeFeather={setFeather}
          brushSize={brushSize}
          onChangeBrushSize={setBrushSize}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onReset={initializeCanvas}
          isProcessingAI={isProcessingAI}
          aiProgress={aiProgress}
          onExecuteAIRemoval={handleAIRemoval}
        />

        <BackdropColorPalette
          selectedBgColor={selectedBgColor}
          onSelectColor={setSelectedBgColor}
          customHex={customHex}
          onChangeCustomHex={setCustomHex}
        />

        <Button size="lg" className="w-full font-bold text-sm shadow-md" onClick={handleApply}>
          <Check className="mr-2 h-4 w-4" /> Save & Send to ID Studio
        </Button>
      </div>

      <MattingCanvasViewport
        canvasRef={canvasRef}
        selectedBgColor={selectedBgColor}
        activeTool={activeTool}
        zoom={zoom}
        onChangeZoom={setZoom}
        onCanvasClick={handleCanvasClick}
        onPointerDown={(e) => {
          if (activeTool === 'eraser' || activeTool === 'restore') {
            setIsDrawing(true)
            drawBrushPoint(e)
          }
        }}
        onPointerMove={(e) => {
          if (isDrawing && (activeTool === 'eraser' || activeTool === 'restore')) drawBrushPoint(e)
        }}
        onPointerUp={() => {
          if (isDrawing) {
            setIsDrawing(false)
            const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true })
            if (ctx && canvasRef.current) {
              pushToHistory(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height))
            }
          }
        }}
      />
    </div>
  )
}
