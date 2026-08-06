'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePricingCalculator } from '@/hooks/use-pricing-calculator'
import { PresetWithMatrix } from '@/types/database'
import { submitOrder } from '@/app/[slug]/actions'
import { Calculator, Upload, User } from 'lucide-react'

export function OrderForm({ presets, shopId, shopSlug }: { presets: PresetWithMatrix[] | null; shopId: string; shopSlug: string }) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [colorMode, setColorMode] = useState<string>('grayscale')
  const [isRush, setIsRush] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string | null>(null)

  useEffect(() => {
    if (presets && presets.length > 0 && !selectedPresetId) {
      setSelectedPresetId(presets[0].id)
      if (presets[0].pricing_matrices && presets[0].pricing_matrices.length > 0) {
         setColorMode(presets[0].pricing_matrices[0].color_mode || 'grayscale')
      }
    }
  }, [presets, selectedPresetId])

  const { estimatedPrice } = usePricingCalculator({ presets, selectedPresetId, quantity, colorMode, isRush })

  if (!presets || presets.length === 0) {
    return (
      <Card className="border-border/40 bg-card/60 p-8 text-center text-muted-foreground">
        No active products available for this shop right now.
      </Card>
    )
  }

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle>Place an Order</CardTitle>
        <CardDescription>Configure your print options and get an instant quote.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={submitOrder} className="space-y-6">
          <input type="hidden" name="shopId" value={shopId} />
          <input type="hidden" name="slug" value={shopSlug} />
          <input type="hidden" name="presetId" value={selectedPresetId} />
          <input type="hidden" name="estimatedPrice" value={estimatedPrice.toString()} />
          <input type="hidden" name="quantity" value={quantity.toString()} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Print Product</Label>
              <Select value={selectedPresetId} onValueChange={(val) => {
                if (!val) return
                setSelectedPresetId(val)
                const preset = presets.find(p => p.id === val)
                if (preset?.pricing_matrices && preset.pricing_matrices.length > 0) {
                   setColorMode(preset.pricing_matrices[0].color_mode || 'grayscale')
                }
              }}>
                <SelectTrigger className="w-full truncate text-left">
                  <SelectValue placeholder="Select a product">
                    {selectedPresetId ? presets.find(p => p.id === selectedPresetId)?.name : 'Select a product'}
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
              <Input type="number" min={1} value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} />
            </div>

            <div className="space-y-2">
              <Label>Color Mode</Label>
              <Select value={colorMode} onValueChange={(v: string | null) => { if(v) setColorMode(v) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="grayscale">Grayscale (B&W)</SelectItem>
                  <SelectItem value="colored_light">Colored (Light)</SelectItem>
                  <SelectItem value="colored_heavy">Colored (Heavy/Full)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Order Speed</Label>
              <Select value={isRush ? 'rush' : 'standard'} onValueChange={(v: string | null) => { if(v) setIsRush(v === 'rush') }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Processing</SelectItem>
                  <SelectItem value="rush">Rush Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Estimated Total</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              ₱{estimatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="space-y-4 border-t border-border/20 pt-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <User className="h-4 w-4 text-muted-foreground" /> Customer Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name</Label>
                <Input id="customerName" name="customerName" required placeholder="Juan Dela Cruz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email / Phone</Label>
                <Input id="customerEmail" name="customerEmail" required placeholder="juan@example.com" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Upload Print Assets</Label>
              <div className="flex w-full items-center justify-center">
                <label htmlFor="dropzone-file" className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-card/40 transition-colors hover:bg-card/60">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <Upload className="mb-3 h-8 w-8 text-primary" />
                    <p className="mb-2 text-sm text-foreground">
                      {fileName ? <span className="font-semibold text-primary">{fileName}</span> : <><span className="font-semibold text-primary">Click to upload</span> or drag and drop</>}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 50MB)</p>
                  </div>
                  <input 
                    id="dropzone-file" 
                    name="printFile"
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setFileName(file.name)
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <Button type="submit" className="h-12 w-full text-lg">
            Submit Order
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
