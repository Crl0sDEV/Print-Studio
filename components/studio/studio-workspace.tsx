'use client'

import { useState, useRef } from 'react'
import { BackgroundRemover } from './background-remover'
import { IdEditor } from './id-editor'
import { PrintLayoutEngine } from './print-layout-engine'
import { DocEnhancer } from './doc-enhancer'
import { IdPresetKey } from '@/types/studio'
import { StudioWorkspaceNav, StudioTabKey } from './studio-workspace-nav'

const SAMPLE_PORTRAIT = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'

interface StudioWorkspaceProps {
  initialImageUrl?: string
  initialPreset?: IdPresetKey
  orderInfo?: {
    orderNumber?: string
    customerName?: string
  }
}

export function StudioWorkspace({ initialImageUrl, initialPreset = '2x2', orderInfo }: StudioWorkspaceProps) {
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(initialImageUrl || SAMPLE_PORTRAIT)
  const [activeTab, setActiveTab] = useState<StudioTabKey>('bg_remover')
  const [currentPreset, setCurrentPreset] = useState<IdPresetKey>(initialPreset)
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImageSrc(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProceedToIdLab = (processedImage: string) => {
    setCurrentImageSrc(processedImage)
    setActiveTab('id_lab')
  }

  const handleProceedToPrint = (processedIdImage: string, preset: IdPresetKey) => {
    setCurrentImageSrc(processedIdImage)
    setCurrentPreset(preset)
    setActiveTab('print_layout')
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-5 md:p-6 max-w-[1600px] w-full min-w-0 mx-auto min-h-screen">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <StudioWorkspaceNav
        orderInfo={orderInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUploadClick={() => fileInputRef.current?.click()}
        onResetSampleClick={() => setCurrentImageSrc(SAMPLE_PORTRAIT)}
      />

      {/* Main Studio Viewports */}
      <div className="flex-1 w-full min-w-0">
        {activeTab === 'bg_remover' && (
          <div className="animate-in fade-in duration-200">
            <BackgroundRemover
              imageSrc={currentImageSrc}
              onProceed={handleProceedToIdLab}
            />
          </div>
        )}

        {activeTab === 'id_lab' && (
          <div className="animate-in fade-in duration-200">
            <IdEditor
              imageSrc={currentImageSrc}
              initialPreset={currentPreset}
              onSendToPrintLayout={handleProceedToPrint}
            />
          </div>
        )}

        {activeTab === 'print_layout' && (
          <div className="animate-in fade-in duration-200">
            <PrintLayoutEngine
              imageSrc={currentImageSrc}
              preferredPreset={currentPreset}
            />
          </div>
        )}

        {activeTab === 'doc_enhancer' && (
          <div className="animate-in fade-in duration-200">
            <DocEnhancer
              imageSrc={currentImageSrc}
              onSendToPrint={(enhancedImage: string) => {
                setCurrentImageSrc(enhancedImage)
                setActiveTab('print_layout')
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
