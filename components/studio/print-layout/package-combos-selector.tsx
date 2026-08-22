'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IdPresetKey } from '@/types/studio'
import { ID_PRESETS, PRINT_PACKAGES } from '@/lib/studio-constants'
import { LayoutGrid, Plus, Minus } from 'lucide-react'

interface PackageCombosSelectorProps {
  selectedPackageId: string
  onSelectPackageId: (id: string) => void
  customItems: { presetKey: IdPresetKey; quantity: number }[]
  onUpdateCustomCount: (presetKey: IdPresetKey, delta: number) => void
}

export function PackageCombosSelector({
  selectedPackageId,
  onSelectPackageId,
  customItems,
  onUpdateCustomCount,
}: PackageCombosSelectorProps) {
  return (
    <Card className="p-4 border-border/40 space-y-3">
      <h3 className="font-bold text-sm flex items-center gap-2">
        <LayoutGrid className="h-4 w-4 text-primary" /> Auto-Layout Packages
      </h3>

      <div className="space-y-1.5">
        {PRINT_PACKAGES.map((pkg) => {
          const totalPhotos = pkg.items.reduce((sum, it) => sum + it.quantity, 0)
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelectPackageId(pkg.id)}
              className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                selectedPackageId === pkg.id
                  ? 'border-primary bg-primary/10 ring-1 ring-primary'
                  : 'border-border/60 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{pkg.name}</span>
                <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 font-medium shrink-0">
                  {totalPhotos} Photos
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{pkg.description}</p>
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => onSelectPackageId('custom')}
          className={`w-full p-2.5 rounded-lg border text-left transition-all ${
            selectedPackageId === 'custom'
              ? 'border-primary bg-primary/10 ring-1 ring-primary'
              : 'border-border/60 hover:border-primary/40'
          }`}
        >
          <span className="text-xs font-semibold">Custom Gang Sheet Builder</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">Customize exact photo counts per size</p>
        </button>
      </div>

      {selectedPackageId === 'custom' && (
        <div className="p-3 bg-secondary/30 rounded-lg space-y-2 pt-3 border border-border/40">
          <span className="text-xs font-semibold block text-muted-foreground">Adjust Quantities:</span>
          {(['1x1', '2x2', 'passport_ph', 'wallet'] as IdPresetKey[]).map((pkey) => {
            const currentQty = customItems.find((it) => it.presetKey === pkey)?.quantity || 0
            return (
              <div key={pkey} className="flex items-center justify-between text-xs">
                <span className="font-medium">
                  {ID_PRESETS[pkey].name.split(' ')[0]} ({ID_PRESETS[pkey].widthInches}&quot;×{ID_PRESETS[pkey].heightInches}&quot;):
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="icon-xs"
                    variant="outline"
                    onClick={() => onUpdateCustomCount(pkey, -1)}
                    disabled={currentQty <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-5 text-center font-bold font-mono">{currentQty}</span>
                  <Button
                    size="icon-xs"
                    variant="outline"
                    onClick={() => onUpdateCustomCount(pkey, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
