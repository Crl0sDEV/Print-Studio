'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSidebar } from '@/components/ui/sidebar'
import {
  Printer,
  Upload,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowRight,
  Zap,
  Crop,
  FileText,
} from 'lucide-react'

export type StudioTabKey = 'bg_remover' | 'id_lab' | 'print_layout' | 'doc_enhancer'

interface StudioWorkspaceNavProps {
  orderInfo?: {
    orderNumber?: string
    customerName?: string
  }
  activeTab: StudioTabKey
  setActiveTab: (tab: StudioTabKey) => void
  onUploadClick: () => void
  onResetSampleClick: () => void
}

export function StudioWorkspaceNav({
  orderInfo,
  activeTab,
  setActiveTab,
  onUploadClick,
  onResetSampleClick,
}: StudioWorkspaceNavProps) {
  const { state: sidebarState, toggleSidebar } = useSidebar()

  return (
    <div className="space-y-4 print:hidden">
      {/* Top Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Printer className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Print Studio Pro</h1>
              {orderInfo && (
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    Order #{orderInfo.orderNumber}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] sm:text-xs hidden sm:inline-flex">
                    {orderInfo.customerName}
                  </Badge>
                </div>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              AI Background Eraser • Philippine ID Photo Lab • Auto Gang Sheet Imposition
            </p>
          </div>
        </div>

        {/* Upload, Focus Mode & Sample Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="text-xs font-semibold h-8"
            title="Toggle Sidebar (Ctrl+B)"
          >
            {sidebarState === 'collapsed' ? (
              <>
                <PanelLeftOpen className="mr-1 sm:mr-1.5 h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Show Sidebar</span>
                <span className="sm:hidden">Sidebar</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="mr-1 sm:mr-1.5 h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Maximize</span>
                <span className="sm:hidden">Focus</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onUploadClick}
            className="text-xs font-semibold h-8"
          >
            <Upload className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Upload Photo</span>
            <span className="sm:hidden">Upload</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onResetSampleClick}
            className="text-xs text-muted-foreground h-8 px-2"
          >
            <RotateCcw className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Sample</span>
          </Button>
        </div>
      </div>

      {/* Main Workflow Steps Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-secondary/30 rounded-xl border border-border/40 overflow-x-auto scrollbar-none">
        <Button
          variant={activeTab === 'bg_remover' ? 'default' : 'ghost'}
          size="sm"
          className="text-[11px] sm:text-xs font-semibold h-8 sm:h-9 rounded-lg shrink-0 px-2.5 sm:px-3"
          onClick={() => setActiveTab('bg_remover')}
        >
          <Zap className="mr-1 sm:mr-1.5 h-3.5 w-3.5 text-primary" />
          <span>1. Background Eraser</span>
        </Button>

        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0 hidden lg:block" />

        <Button
          variant={activeTab === 'id_lab' ? 'default' : 'ghost'}
          size="sm"
          className="text-[11px] sm:text-xs font-semibold h-8 sm:h-9 rounded-lg shrink-0 px-2.5 sm:px-3"
          onClick={() => setActiveTab('id_lab')}
        >
          <Crop className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
          <span>2. Philippine ID Lab</span>
        </Button>

        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0 hidden lg:block" />

        <Button
          variant={activeTab === 'print_layout' ? 'default' : 'ghost'}
          size="sm"
          className="text-[11px] sm:text-xs font-semibold h-8 sm:h-9 rounded-lg shrink-0 px-2.5 sm:px-3"
          onClick={() => setActiveTab('print_layout')}
        >
          <Printer className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
          <span>3. Auto Gang Sheet Imposition</span>
        </Button>

        <span className="text-border/60 hidden sm:inline">|</span>

        <Button
          variant={activeTab === 'doc_enhancer' ? 'default' : 'ghost'}
          size="sm"
          className="text-[11px] sm:text-xs font-semibold h-8 sm:h-9 rounded-lg shrink-0 px-2.5 sm:px-3"
          onClick={() => setActiveTab('doc_enhancer')}
        >
          <FileText className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
          <span>Doc / Photocopy Enhancer</span>
        </Button>
      </div>
    </div>
  )
}
