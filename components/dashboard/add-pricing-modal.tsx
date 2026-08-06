'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createPricingMatrix } from '@/app/dashboard/actions'

export function AddPricingModal({ presetId, shopId, presetName }: { presetId: string; shopId: string; presetName: string }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    await createPricingMatrix(formData)
    
    setIsSubmitting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="mt-3 w-full" />}>
        <Plus className="mr-2 h-4 w-4" /> Add Price Rule
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Pricing Rule for {presetName}</DialogTitle>
          <DialogDescription>
            Set the tier constraints (e.g. 1 to 49 copies) and unit price.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="shopId" value={shopId} />
          <input type="hidden" name="presetId" value={presetId} />

          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input id="name" name="name" placeholder="e.g. BW 1-49 pages" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Pricing Unit</Label>
              <Select name="unit" required defaultValue="per_page">
                <SelectTrigger>
                  <SelectValue placeholder="Select unit">Per Page</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_page">Per Page</SelectItem>
                  <SelectItem value="per_sqft">Per Sq. Ft.</SelectItem>
                  <SelectItem value="per_sqin">Per Sq. In.</SelectItem>
                  <SelectItem value="flat_rate">Flat Rate / Package</SelectItem>
                  <SelectItem value="per_unit">Per Unit / Piece</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color_mode">Color Mode</Label>
              <Select name="color_mode" required defaultValue="grayscale">
                <SelectTrigger>
                  <SelectValue placeholder="Select color">Grayscale</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                  <SelectItem value="colored_light">Colored (Light)</SelectItem>
                  <SelectItem value="colored_heavy">Colored (Heavy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_quantity">Min Quantity</Label>
              <Input id="min_quantity" name="min_quantity" type="number" defaultValue="1" required min="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_quantity">Max Quantity (Optional)</Label>
              <Input id="max_quantity" name="max_quantity" type="number" placeholder="No limit" min="2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_price">Price (₱)</Label>
              <Input id="unit_price" name="unit_price" type="number" step="0.01" required min="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rush_multiplier">Rush Multiplier</Label>
              <Input id="rush_multiplier" name="rush_multiplier" type="number" step="0.1" defaultValue="1.5" required min="1" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Pricing Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
