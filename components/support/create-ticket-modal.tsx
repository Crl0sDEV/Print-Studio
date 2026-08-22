'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createSupportTicket } from '@/app/dashboard/support/actions'
import { MessageSquarePlus, Loader2, AlertCircle } from 'lucide-react'

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  shopId: string
}

export function CreateTicketModal({ isOpen, onClose, shopId }: CreateTicketModalProps) {
  const [category, setCategory] = useState<string>('billing')
  const [priority, setPriority] = useState<string>('medium')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      setError('Please provide a subject and describe your inquiry.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('shopId', shopId)
      formData.append('category', category)
      formData.append('priority', priority)
      formData.append('subject', subject.trim())
      formData.append('message', message.trim())

      const res = await createSupportTicket(formData)
      if (res?.error) {
        setError(res.error)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setSubject('')
        setMessage('')
        onClose()
      }
    } catch {
      setError('Failed to submit support ticket. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-5">
        <DialogHeader className="pb-2 border-b border-border/40">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            Submit Help & Support Ticket
          </DialogTitle>
          <DialogDescription className="text-xs">
            Send your question or issue directly to the Prynt Support Team. We respond promptly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/15 text-destructive text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={category} onValueChange={(val) => { if (val) setCategory(val) }}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">💳 Billing & Upgrades</SelectItem>
                  <SelectItem value="studio">🎨 Print Studio & ID Lab</SelectItem>
                  <SelectItem value="orders">📦 Orders & Customer Store</SelectItem>
                  <SelectItem value="bug">🐛 Bug or Technical Issue</SelectItem>
                  <SelectItem value="general">💬 General Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Priority</Label>
              <Select value={priority} onValueChange={(val) => { if (val) setPriority(val) }}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (General)</SelectItem>
                  <SelectItem value="medium">Medium (Standard)</SelectItem>
                  <SelectItem value="high">High (Urgent Issue)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="subject" className="text-xs font-semibold">
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="e.g. Question about GCash Pro renewal verification"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="message" className="text-xs font-semibold">
              How can we help you?
            </Label>
            <textarea
              id="message"
              rows={4}
              placeholder="Describe your question or issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full p-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold text-xs shadow-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Submitting Ticket...
                </>
              ) : (
                'Submit Support Ticket'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
