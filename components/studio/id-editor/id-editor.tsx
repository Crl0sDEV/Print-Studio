'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { 
  IdPresetKey, 
  ImageAdjustments, 
  AttireTransform, 
  NametagConfig 
} from '@/types/studio'
import { ID_PRESETS, ATTIRE_TEMPLATES } from '@/lib/studio-constants'
import { applyImageFilters, getSafeImageSource } from '@/lib/studio-utils'
import { IdPresetSelector } from './id-preset-selector'
import { AttireOverlayControls } from './attire-overlay-controls'
import { NametagGeneratorControls } from './nametag-generator-controls'
import { ImageFilterControls } from './image-filter-controls'
import { IdCanvasPreview } from './id-canvas-preview'
import { Crop, Shirt, Tag, Sliders, Check } from 'lucide-react'

interface IdEditorProps {
  imageSrc: string
  initialPreset?: IdPresetKey
  onSendToPrintLayout: (renderedPhotoUrl: string, presetKey: IdPresetKey) => void
}

export function IdEditor({ imageSrc, initialPreset = '2x2', onSendToPrintLayout }: IdEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<IdPresetKey>(initialPreset)
  const [activeTab, setActiveTab] = useState<'crop' | 'attire' | 'nametag' | 'adjust'>('crop')

  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 5,
    saturation: 0,
    sharpness: 20,
    smoothness: 0,
    rotation: 0,
    flipHorizontal: false,
  })

  const [attire, setAttire] = useState<AttireTransform>({
    enabled: false,
    templateId: 'barong_mens',
    xPercent: 50,
    yPercent: 72,
    scalePercent: 100,
    rotateDeg: 0,
  })

  const [nametag, setNametag] = useState<NametagConfig>({
    enabled: false,
    fullName: 'DELA CRUZ, JUAN A.',
    middleInitial: '',
    designation: '',
    fontSize: 14,
    fontColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 2,
  })

  const [subjectScale, setSubjectScale] = useState<number>(100)
  const [subjectOffsetX, setSubjectOffsetX] = useState<number>(0)
  const [subjectOffsetY, setSubjectOffsetY] = useState<number>(0)

  const attireImageRef = useRef<HTMLImageElement | null>(null)
  const baseImageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (attire.enabled && attire.templateId) {
      const template = ATTIRE_TEMPLATES.find((t) => t.id === attire.templateId)
      if (template) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => { attireImageRef.current = img; renderCompositeCanvas() }
        img.src = template.svgPath
      }
    } else {
      attireImageRef.current = null
      renderCompositeCanvas()
    }
  }, [attire.enabled, attire.templateId])

  useEffect(() => {
    if (!imageSrc) return
    const safeSrc = getSafeImageSource(imageSrc)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { baseImageRef.current = img; renderCompositeCanvas() }
    img.onerror = () => {
      const retryImg = new Image()
      retryImg.onload = () => { baseImageRef.current = retryImg; renderCompositeCanvas() }
      retryImg.src = safeSrc
    }
    img.src = safeSrc
  }, [imageSrc])

  const renderCompositeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const baseImg = baseImageRef.current
    if (!canvas || !baseImg) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const preset = ID_PRESETS[selectedPreset]
    const targetH = 1200
    const targetW = Math.round(targetH * preset.aspectRatio)
    canvas.width = targetW; canvas.height = targetH
    ctx.clearRect(0, 0, targetW, targetH)

    // 1. Subject Draw
    ctx.save()
    ctx.translate(targetW / 2 + (subjectOffsetX * targetW) / 100, targetH / 2 + (subjectOffsetY * targetH) / 100)
    if (adjustments.flipHorizontal) ctx.scale(-1, 1)
    if (adjustments.rotation !== 0) ctx.rotate((adjustments.rotation * Math.PI) / 180)

    let drawW = targetW * (subjectScale / 100)
    let drawH = (drawW / baseImg.naturalWidth) * baseImg.naturalHeight
    if (drawH < targetH * (subjectScale / 100)) {
      drawH = targetH * (subjectScale / 100)
      drawW = (drawH / baseImg.naturalHeight) * baseImg.naturalWidth
    }
    applyImageFilters(ctx, targetW, targetH, adjustments)
    ctx.drawImage(baseImg, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()

    // 2. Attire Overlay
    if (attire.enabled && attireImageRef.current) {
      ctx.save()
      const attImg = attireImageRef.current
      ctx.translate((attire.xPercent / 100) * targetW, (attire.yPercent / 100) * targetH)
      if (attire.rotateDeg !== 0) ctx.rotate((attire.rotateDeg * Math.PI) / 180)
      const attW = targetW * 1.15 * (attire.scalePercent / 100)
      const attH = (attW / attImg.naturalWidth) * attImg.naturalHeight
      ctx.drawImage(attImg, -attW / 2, -attH / 2, attW, attH)
      ctx.restore()
    }

    // 3. Nametag
    if (nametag.enabled && nametag.fullName.trim()) {
      ctx.save()
      const bH = Math.round(targetH * 0.13), bY = targetH - bH - Math.round(targetH * 0.03)
      const bM = Math.round(targetW * 0.04), bW = targetW - bM * 2
      ctx.fillStyle = nametag.backgroundColor; ctx.fillRect(bM, bY, bW, bH)
      ctx.strokeStyle = nametag.borderColor; ctx.lineWidth = Math.round(targetW * 0.008); ctx.strokeRect(bM, bY, bW, bH)
      ctx.fillStyle = nametag.fontColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'

      if (nametag.designation && nametag.designation.trim()) {
        ctx.font = `bold ${Math.round(targetH * 0.045)}px Arial, sans-serif`
        ctx.fillText(nametag.fullName.toUpperCase(), targetW / 2, bY + bH * 0.38)
        ctx.font = `normal ${Math.round(targetH * 0.026)}px Arial, sans-serif`
        ctx.fillText(nametag.designation.toUpperCase(), targetW / 2, bY + bH * 0.78)
      } else {
        ctx.font = `bold ${Math.round(targetH * 0.055)}px Arial, sans-serif`
        ctx.fillText(nametag.fullName.toUpperCase(), targetW / 2, bY + bH / 2)
      }
      ctx.restore()
    }
  }, [selectedPreset, adjustments, attire, nametag, subjectScale, subjectOffsetX, subjectOffsetY])

  useEffect(() => { renderCompositeCanvas() }, [renderCompositeCanvas])

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-full min-h-[580px]">
      <div className="w-full lg:w-84 flex flex-col gap-3 sm:gap-4 order-2 lg:order-1">
        <div className="grid grid-cols-4 gap-1 p-1 bg-secondary/40 rounded-lg border border-border/50">
          <Button variant={activeTab === 'crop' ? 'default' : 'ghost'} size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8 px-0.5 sm:px-1" onClick={() => setActiveTab('crop')}><Crop className="h-3 w-3 mr-0.5 sm:mr-1" /> Size</Button>
          <Button variant={activeTab === 'attire' ? 'default' : 'ghost'} size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8 px-0.5 sm:px-1" onClick={() => setActiveTab('attire')}><Shirt className="h-3 w-3 mr-0.5 sm:mr-1" /> Attire</Button>
          <Button variant={activeTab === 'nametag' ? 'default' : 'ghost'} size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8 px-0.5 sm:px-1" onClick={() => setActiveTab('nametag')}><Tag className="h-3 w-3 mr-0.5 sm:mr-1" /> Name</Button>
          <Button variant={activeTab === 'adjust' ? 'default' : 'ghost'} size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8 px-0.5 sm:px-1" onClick={() => setActiveTab('adjust')}><Sliders className="h-3 w-3 mr-0.5 sm:mr-1" /> Filter</Button>
        </div>

        {activeTab === 'crop' && <IdPresetSelector selectedPreset={selectedPreset} onSelectPreset={setSelectedPreset} subjectScale={subjectScale} onChangeScale={setSubjectScale} subjectOffsetY={subjectOffsetY} onChangeOffsetY={setSubjectOffsetY} subjectOffsetX={subjectOffsetX} onChangeOffsetX={setSubjectOffsetX} />}
        {activeTab === 'attire' && <AttireOverlayControls attire={attire} onChangeAttire={setAttire} />}
        {activeTab === 'nametag' && <NametagGeneratorControls nametag={nametag} onChangeNametag={setNametag} />}
        {activeTab === 'adjust' && <ImageFilterControls adjustments={adjustments} onChangeAdjustments={setAdjustments} />}

        <Button size="lg" className="w-full font-bold text-sm shadow-md mt-2" onClick={() => { if (canvasRef.current) onSendToPrintLayout(canvasRef.current.toDataURL('image/png', 1.0), selectedPreset) }}>
          <Check className="mr-2 h-4 w-4" /> Ready for Print Layout
        </Button>
      </div>

      <div className="flex-1 order-1 lg:order-2">
        <IdCanvasPreview canvasRef={canvasRef} selectedPreset={selectedPreset} isAttireEnabled={attire.enabled} isNametagEnabled={nametag.enabled} />
      </div>
    </div>
  )
}
