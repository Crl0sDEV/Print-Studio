'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TicketListCard } from '@/components/support/ticket-list-card'
import { CreateTicketModal } from '@/components/support/create-ticket-modal'
import { SupportFaqAccordion } from '@/components/support/support-faq-accordion'
import { MessageSquarePlus, LifeBuoy } from 'lucide-react'

interface SupportClientViewProps {
  shop: {
    id: string
    name: string
  }
  tickets: any[]
}

export function SupportClientView({ shop, tickets }: SupportClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all')

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'open') return t.status === 'open' || t.status === 'in_progress'
    if (filterStatus === 'resolved') return t.status === 'resolved' || t.status === 'closed'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Top Actions & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-secondary/30 p-3.5 rounded-xl border border-border/40">
        <div className="flex items-center gap-1.5 p-1 bg-background rounded-lg border border-border/50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md transition-all ${
              filterStatus === 'all' ? 'bg-secondary text-foreground font-bold shadow-2xs' : 'text-muted-foreground'
            }`}
          >
            All Tickets ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('open')}
            className={`px-3 py-1 rounded-md transition-all ${
              filterStatus === 'open' ? 'bg-secondary text-blue-500 font-bold shadow-2xs' : 'text-muted-foreground'
            }`}
          >
            Active Inquiries
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('resolved')}
            className={`px-3 py-1 rounded-md transition-all ${
              filterStatus === 'resolved' ? 'bg-secondary text-emerald-500 font-bold shadow-2xs' : 'text-muted-foreground'
            }`}
          >
            Resolved
          </button>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Create Support Ticket
        </Button>
      </div>

      {/* Main Grid: Tickets on Left, FAQ on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-dashed border-border/60 bg-card/40 space-y-3">
              <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">No support tickets found</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Have a question or encounter an issue? Submit a ticket and our team will assist you.
                </p>
              </div>
              <Button size="sm" onClick={() => setIsModalOpen(true)} className="text-xs font-semibold">
                Submit Your First Ticket
              </Button>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketListCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>

        <div className="space-y-4">
          <SupportFaqAccordion />
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopId={shop.id}
      />
    </div>
  )
}
