'use client'

import { useState, useMemo, useEffect } from 'react'
import { PaperSizeKey, IdPresetKey, CutGuideStyle } from '@/types/studio'
import { calculateImpositionLayout, renderHighResPrintCanvas, downloadPrintPDF } from '@/lib/studio-utils'
import { PaperOrientationSelector } from './paper-orientation-selector'
import { PackageCombosSelector } from './package-combos-selector'
import { CutGuidesControls } from './cut-guides-controls'
import { PrintExportActions } from './print-export-actions'
import { VirtualSheetPaper } from './virtual-sheet-paper'

interface PrintLayoutEngineProps {
  imageSrc: string
  preferredPreset?: IdPresetKey
}

export function PrintLayoutEngine({ imageSrc }: PrintLayoutEngineProps) {
  const [paperKey, setPaperKey] = useState<PaperSizeKey>('4R')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const marginInches = 0.2
  const [gapInches, setGapInches] = useState<number>(0.08)
  const [cutGuideStyle, setCutGuideStyle] = useState<CutGuideStyle>('crop_ticks')
  const cutGuideColor = '#94A3B8'
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg_csc_job')

  const [customItems, setCustomItems] = useState<{ presetKey: IdPresetKey; quantity: number }[]>([
    { presetKey: '2x2', quantity: 4 },
    { presetKey: '1x1', quantity: 8 },
  ])

  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(75)

  // Auto adapt initial zoom on screen size mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setZoom(45)
      } else if (window.innerWidth < 1024) {
        setZoom(60)
      } else {
        setZoom(75)
      }
    }
  }, [])

  const handleSelectPaper = (newPaper: PaperSizeKey) => {
    setPaperKey(newPaper)
    if (newPaper === 'A3') {
      setZoom(35)
    } else if (newPaper === 'A4' || newPaper === 'Letter' || newPaper === 'Folio' || newPaper === 'Legal') {
      setZoom(50)
    } else if (newPaper === '5R') {
      setZoom(65)
    } else {
      setZoom(75)
    }
  }

  const layout = useMemo(() => {
    return calculateImpositionLayout(
      paperKey,
      orientation,
      marginInches,
      gapInches,
      selectedPackageId,
      imageSrc,
      customItems
    )
  }, [paperKey, orientation, marginInches, gapInches, selectedPackageId, imageSrc, customItems])

  const handleDirectPrint = () => {
    window.print()
  }

  const handleDownloadPNG = async () => {
    setIsExporting(true)
    try {
      const canvas = await renderHighResPrintCanvas(
        layout.paperW,
        layout.paperH,
        layout.placedItems,
        cutGuideStyle,
        cutGuideColor,
        300
      )
      const link = document.createElement('a')
      link.download = `Print_GangSheet_${paperKey}_300DPI.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      alert('Could not export high-res PNG.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsExporting(true)
    try {
      await downloadPrintPDF(
        layout.paperW,
        layout.paperH,
        layout.placedItems,
        cutGuideStyle,
        cutGuideColor,
        `Print_GangSheet_${paperKey}.pdf`
      )
    } catch {
      alert('Could not export PDF.')
    } finally {
      setIsExporting(false)
    }
  }

  const updateCustomCount = (presetKey: IdPresetKey, delta: number) => {
    setCustomItems((prev) => {
      const existing = prev.find((it) => it.presetKey === presetKey)
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta)
        return prev.map((it) => (it.presetKey === presetKey ? { ...it, quantity: newQty } : it))
      } else if (delta > 0) {
        return [...prev, { presetKey, quantity: delta }]
      }
      return prev
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-full min-h-[600px] w-full min-w-0">
      <div className="w-full lg:w-84 shrink-0 flex flex-col gap-3 sm:gap-4 print:hidden order-2 lg:order-1">
        <PaperOrientationSelector
          paperKey={paperKey}
          onSelectPaper={handleSelectPaper}
          orientation={orientation}
          onToggleOrientation={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
        />

        <PackageCombosSelector
          selectedPackageId={selectedPackageId}
          onSelectPackageId={setSelectedPackageId}
          customItems={customItems}
          onUpdateCustomCount={updateCustomCount}
        />

        <CutGuidesControls
          cutGuideStyle={cutGuideStyle}
          onSelectCutGuide={setCutGuideStyle}
          gapInches={gapInches}
          onChangeGap={setGapInches}
        />

        <PrintExportActions
          onDirectPrint={handleDirectPrint}
          onDownloadPNG={handleDownloadPNG}
          onDownloadPDF={handleDownloadPDF}
          isExporting={isExporting}
        />
      </div>

      <div className="flex-1 w-full min-w-0 flex flex-col print:w-full print:m-0 order-1 lg:order-2">
        <VirtualSheetPaper
          paperKey={paperKey}
          paperW={layout.paperW}
          paperH={layout.paperH}
          placedItems={layout.placedItems}
          isOverflow={layout.isOverflow}
          cutGuideStyle={cutGuideStyle}
          cutGuideColor={cutGuideColor}
          zoom={zoom}
          onChangeZoom={setZoom}
        />
      </div>
    </div>
  )
}
