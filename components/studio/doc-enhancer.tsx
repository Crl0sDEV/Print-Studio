'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { processDocumentEnhance, getSafeImageSource } from '@/lib/studio-utils'
import { FileText, Download, Check } from 'lucide-react'

interface DocEnhancerProps {
  imageSrc: string
  onSendToPrint: (enhancedImageUrl: string) => void
}

type EnhanceMode = 'high_contrast' | 'bw_clean' | 'grayscale' | 'magic_color'

export function DocEnhancer({ imageSrc, onSendToPrint }: DocEnhancerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [mode, setMode] = useState<EnhanceMode>('high_contrast')
  const [threshold, setThreshold] = useState<number>(135)
  const baseImageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!imageSrc) return
    const safeSrc = getSafeImageSource(imageSrc)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      baseImageRef.current = img
      applyEnhancement()
    }
    img.onerror = () => {
      const retryImg = new Image()
      retryImg.onload = () => {
        baseImageRef.current = retryImg
        applyEnhancement()
      }
      retryImg.src = safeSrc
    }
    img.src = safeSrc
  }, [imageSrc])

  const applyEnhancement = useCallback(() => {
    const canvas = canvasRef.current
    const img = baseImageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    ctx.drawImage(img, 0, 0)
    processDocumentEnhance(ctx, canvas.width, canvas.height, mode, threshold)
  }, [mode, threshold])

  useEffect(() => {
    applyEnhancement()
  }, [applyEnhancement])

  const handleSend = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    onSendToPrint(canvas.toDataURL('image/png'))
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = 'Enhanced_Document.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-full min-h-[580px]">
      <div className="w-full lg:w-80 flex flex-col gap-3 sm:gap-4 order-2 lg:order-1">
        <Card className="p-4 border-border/40 space-y-4">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Document Photocopy Optimizer
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Clean up dark receipts, contracts, and IDs for high-contrast photocopy printing.
            </p>
          </div>

          <div className="space-y-1.5">
            {[
              { id: 'high_contrast', title: 'High Contrast Document', desc: 'Whitens dirty paper, boosts dark text' },
              { id: 'bw_clean', title: 'Pure Black & White', desc: 'Crisp 1-bit photocopier threshold' },
              { id: 'magic_color', title: 'Magic Color Document', desc: 'Preserves colored seals, cleans paper' },
              { id: 'grayscale', title: 'Smooth Grayscale', desc: 'Standard gray photo document' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id as EnhanceMode)}
                className={`w-full p-2 rounded-lg border text-left transition-all ${
                  mode === m.id
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-border/60 hover:border-primary/40'
                }`}
              >
                <span className="text-xs font-bold block">{m.title}</span>
                <span className="text-[10px] text-muted-foreground">{m.desc}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <div className="flex justify-between text-xs font-medium">
              <span>Threshold Intensity:</span>
              <span>{threshold}</span>
            </div>
            <input
              type="range"
              min="60"
              max="210"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </Card>

        <div className="space-y-2 mt-auto">
          <Button size="lg" className="w-full font-bold" onClick={handleSend}>
            <Check className="mr-2 h-4 w-4" /> Send to Print Layout
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={handleDownload}>
            <Download className="mr-2 h-3.5 w-3.5" /> Download Enhanced File
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-secondary/15 rounded-xl border border-border/40 p-3 sm:p-4 flex flex-col items-center justify-center overflow-auto min-h-[280px] sm:min-h-[400px] lg:min-h-[520px] order-1 lg:order-2">
        <div className="relative rounded-lg shadow-xl border border-border/60 overflow-hidden max-h-[280px] sm:max-h-[400px] md:max-h-[500px]">
          <canvas ref={canvasRef} className="max-h-[260px] sm:max-h-[380px] md:max-h-[480px] max-w-full object-contain" />
        </div>
      </div>
    </div>
  )
}
