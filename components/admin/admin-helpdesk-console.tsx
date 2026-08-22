'use client'

import { useState, useTransition } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TicketChatThread } from '@/components/support/ticket-chat-thread'
import { adminUpdateTicketStatus } from '@/app/admin/support/actions'
import { Search, MessageSquare, Clock, Filter, CheckCircle2 } from 'lucide-react'

interface AdminHelpdeskConsoleProps {
  tickets: any[]
  currentAdminId: string
}

export function AdminHelpdeskConsole({ tickets, currentAdminId }: AdminHelpdeskConsoleProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isPending, startTransition] = useTransition()

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      t.ticket_number?.toLowerCase().includes(term) ||
      t.subject?.toLowerCase().includes(term) ||
      t.shops?.name?.toLowerCase().includes(term)
    )
  })

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || filteredTickets[0]

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    startTransition(async () => {
      await adminUpdateTicketStatus(ticketId, newStatus)
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      {/* Left Column: Tickets Queue (4 cols) */}
      <Card className="lg:col-span-4 border-border/40 flex flex-col h-[400px] lg:h-[calc(100vh-14rem)] min-h-[380px] max-h-[850px] shadow-sm bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-3 border-b border-border/40 space-y-2 shrink-0 bg-secondary/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-amber-500" />
              Inquiries Queue ({filteredTickets.length})
            </CardTitle>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search ticket #, shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 text-[10px] font-semibold overflow-x-auto pb-1">
            {['all', 'open', 'in_progress', 'resolved'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-all ${
                  filterStatus === st
                    ? 'bg-amber-500 text-white font-bold'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-2 divide-y divide-border/30 space-y-1">
          {filteredTickets.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No inquiries matching filters.
            </div>
          ) : (
            filteredTickets.map((t) => {
              const isSelected = t.id === (activeTicket?.id || '')
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all block ${
                    isSelected
                      ? 'bg-amber-500/10 border border-amber-500/30'
                      : 'hover:bg-secondary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground">
                      {t.ticket_number}
                    </span>
                    <Badge variant={t.priority === 'high' ? 'destructive' : 'outline'} className="text-[9px] h-3.5 px-1 uppercase">
                      {t.priority}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-foreground line-clamp-1">{t.subject}</h4>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">{t.shops?.name || 'Shop'}</span>
                    <span>{new Date(t.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                </button>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Right Column: Chat & Thread View (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        {activeTicket ? (
          <div className="space-y-3">
            {/* Quick Status Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">Ticket Status:</span>
                <Badge className={activeTicket.status === 'resolved' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : 'bg-blue-500/15 text-blue-600 border-blue-500/30'}>
                  {activeTicket.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="xs"
                  variant="outline"
                  className="text-[11px] h-7"
                  onClick={() => handleStatusChange(activeTicket.id, 'in_progress')}
                  disabled={isPending || activeTicket.status === 'in_progress'}
                >
                  Mark In Progress
                </Button>
                <Button
                  size="xs"
                  variant="default"
                  className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={() => handleStatusChange(activeTicket.id, 'resolved')}
                  disabled={isPending || activeTicket.status === 'resolved'}
                >
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Mark Resolved
                </Button>
              </div>
            </div>

            <TicketChatThread
              ticket={activeTicket}
              messages={activeTicket.support_messages || []}
              currentUserId={currentAdminId}
              isAdminView={true}
            />
          </div>
        ) : (
          <div className="p-16 text-center border border-dashed border-border/50 rounded-xl text-xs text-muted-foreground">
            Select a ticket from the queue on the left to view the conversation.
          </div>
        )}
      </div>
    </div>
  )
}
