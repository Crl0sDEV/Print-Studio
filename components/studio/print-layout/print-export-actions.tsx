'use client'

import { Button } from '@/components/ui/button'
import { Printer, Download, FileText, Loader2 } from 'lucide-react'

interface PrintExportActionsProps {
  onDirectPrint: () => void
  onDownloadPNG: () => void
  onDownloadPDF: () => void
  isExporting: boolean
}

export function PrintExportActions({
  onDirectPrint,
  onDownloadPNG,
  onDownloadPDF,
  isExporting,
}: PrintExportActionsProps) {
  return (
    <div className="space-y-2 mt-auto">
      <Button
        size="lg"
        className="w-full font-bold text-base shadow-lg h-12"
        onClick={onDirectPrint}
      >
        <Printer className="mr-2 h-5 w-5" /> PRINT TO PRINTER
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-9"
          onClick={onDownloadPNG}
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1 h-3.5 w-3.5" />}
          300 DPI PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-9"
          onClick={onDownloadPDF}
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <FileText className="mr-1 h-3.5 w-3.5" />}
          Print PDF
        </Button>
      </div>
    </div>
  )
}
