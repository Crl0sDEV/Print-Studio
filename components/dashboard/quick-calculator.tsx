'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator } from 'lucide-react'

import { usePricingCalculator } from '@/hooks/use-pricing-calculator'

interface Preset {
  id: string
  name: string
  category: string
  default_side_option: string
  pricing_matrices?: any[]
}

export function QuickCalculator({ presets }: { presets: Preset[] | null }) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [colorMode, setColorMode] = useState<string>('grayscale')
  const [isRush, setIsRush] = useState<boolean>(false)

  useEffect(() => {
    // Auto-select first preset if available
    if (presets && presets.length > 0 && !selectedPresetId) {
      setSelectedPresetId(presets[0].id)
      if (presets[0].pricing_matrices && presets[0].pricing_matrices.length > 0) {
         setColorMode(presets[0].pricing_matrices[0].color_mode || 'grayscale')
      }
    }
  }, [presets, selectedPresetId])

  const { estimatedPrice } = usePricingCalculator({
    presets: presets as any,
    selectedPresetId,
    quantity,
    colorMode,
    isRush
  })

  if (!presets || presets.length === 0) return null

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Dynamic Quick Calculator</CardTitle>
        </div>
        <CardDescription>Instant estimate based on your preset pricing tiers and options.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Print Preset</Label>
            <Select value={selectedPresetId} onValueChange={(val) => {
              if (!val) return
              setSelectedPresetId(val)
              const preset = presets.find(p => p.id === val)
              if (preset?.pricing_matrices && preset.pricing_matrices.length > 0) {
                 setColorMode(preset.pricing_matrices[0].color_mode || 'grayscale')
              }
            }}>
              <SelectTrigger className="w-full truncate text-left">
                <SelectValue placeholder="Select a preset">
                  {selectedPresetId ? presets.find(p => p.id === selectedPresetId)?.name : 'Select a preset'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-w-[300px] sm:max-w-none">
                {presets.map(p => (
                  <SelectItem key={p.id} value={p.id} className="w-full truncate">
                    {p.name} ({p.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quantity (Pages/Copies)</Label>
            <Input 
              type="number" 
              min={1} 
              value={quantity} 
              onChange={e => setQuantity(parseInt(e.target.value) || 1)} 
            />
          </div>

          <div className="space-y-2">
            <Label>Color Mode</Label>
            <Select value={colorMode} onValueChange={(val) => { if (val) setColorMode(val) }}>
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select a color mode"/>
              </SelectTrigger>
              <SelectContent className="max-w-[300px] sm:max-w-none">
                <SelectItem value="grayscale">Grayscale (B&W)</SelectItem>
                <SelectItem value="colored_light">Colored (Light)</SelectItem>
                <SelectItem value="colored_heavy">Colored (Heavy/Full)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Order Speed</Label>
            <Select value={isRush ? 'rush' : 'standard'} onValueChange={(val) => setIsRush(val === 'rush')}>
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select an order speed"/>
              </SelectTrigger>
              <SelectContent className="max-w-[300px] sm:max-w-none">
                <SelectItem value="standard">Standard Processing</SelectItem>
                <SelectItem value="rush">Rush Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/10 p-4">
            <span className="text-sm font-medium text-foreground">Estimated Total:</span>
            <span className="text-2xl font-bold text-primary">
              ₱{estimatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          {(!presets.find(p => p.id === selectedPresetId)?.pricing_matrices?.length) && (
            <p className="text-xs text-amber-500 font-medium text-center bg-amber-500/10 py-1.5 rounded-md">
              Warning: This preset has no Pricing Matrix configured in the database.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
