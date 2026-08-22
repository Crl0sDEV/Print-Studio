import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, ArrowRight, Clock } from 'lucide-react'

interface TicketListCardProps {
  ticket: {
    id: string
    ticket_number: string
    subject: string
    category: string
    priority: string
    status: string
    created_at: string
    support_messages?: { count: number }[]
  }
}

export function TicketListCard({ ticket }: TicketListCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px]">Open</Badge>
      case 'in_progress':
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">In Progress</Badge>
      case 'resolved':
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Resolved</Badge>
      default:
        return <Badge variant="outline" className="text-[10px] text-muted-foreground">Closed</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return <Badge variant="destructive" className="text-[9px] h-4 px-1">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-[9px] h-4 px-1">Medium</Badge>
      default:
        return <Badge variant="outline" className="text-[9px] h-4 px-1 text-muted-foreground">Low</Badge>
    }
  }

  const messageCount = ticket.support_messages?.[0]?.count || 1

  return (
    <Link href={`/dashboard/support/${ticket.id}`} className="block group">
      <Card className="p-4 border-border/40 hover:border-primary/50 transition-all bg-card/60 hover:bg-card/90 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-muted-foreground">
                {ticket.ticket_number}
              </span>
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
              <span className="text-[10px] uppercase font-semibold text-muted-foreground/70 bg-secondary/50 px-1.5 py-0.5 rounded">
                {ticket.category}
              </span>
            </div>

            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {ticket.subject}
            </h3>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(ticket.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-primary" />
                {messageCount} {messageCount === 1 ? 'message' : 'messages'}
              </span>
            </div>
          </div>

          <div className="flex items-center self-center pl-2 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
