'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { createPreset } from '@/app/dashboard/actions'

export function AddPresetModal({ shopId }: { shopId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" /> Add New Preset
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Preset</DialogTitle>
          <DialogDescription>
            Gumawa ng bagong print setting template para sa shop mo.
          </DialogDescription>
        </DialogHeader>
        <form 
          action={async (formData) => {
             formData.append('shopId', shopId)
             await createPreset(formData)
             setOpen(false)
          }} 
          className="space-y-4 pt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Preset Name</Label>
            <Input id="name" name="name" placeholder="e.g. 2x2 ID Picture" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required defaultValue="document">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="id_card">ID Card / Photo</SelectItem>
                <SelectItem value="large_format">Large Format / Tarp</SelectItem>
                <SelectItem value="merchandise">Merchandise / Cards</SelectItem>
                <SelectItem value="apparel">Apparel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paper_type">Paper Type (Optional)</Label>
            <Input id="paper_type" name="paper_type" placeholder="e.g. Glossy 230gsm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (Inches)</Label>
              <Input id="width" name="width" type="number" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (Inches)</Label>
              <Input id="height" name="height" type="number" step="0.01" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_side_option">Default Side Option</Label>
            <Select name="default_side_option" required defaultValue="one_sided">
              <SelectTrigger>
                <SelectValue placeholder="Select side option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one_sided">One Sided</SelectItem>
                <SelectItem value="two_sided">Two Sided (Back-to-Back)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Save Preset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
