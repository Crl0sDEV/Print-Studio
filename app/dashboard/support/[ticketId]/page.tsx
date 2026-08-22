import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { TicketChatThread } from '@/components/support/ticket-chat-thread'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Ticket Conversation | Prynt Support',
  description: 'Live support conversation thread with administrator.',
}

export default async function TicketConversationPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const { ticketId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch ticket details with shop name
  const { data: ticket } = await supabase
    .from('support_tickets')
    .select('*, shops(name)')
    .eq('id', ticketId)
    .single()

  if (!ticket) notFound()

  // Fetch all messages for this ticket
  const { data: messages } = await supabase
    .from('support_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  return (
    <div className="p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-4">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/support"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Tickets
        </Link>
        <span className="font-mono text-xs text-muted-foreground">
          ID: {ticket.ticket_number}
        </span>
      </div>

      {/* Responsive Main Layout: Fluid Chat (8 cols on lg) + Sidebar Metadata (4 cols on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left/Center: Full fluid chat thread */}
        <div className="lg:col-span-8 w-full">
          <TicketChatThread
            ticket={ticket}
            messages={messages || []}
            currentUserId={user.id}
            isAdminView={false}
          />
        </div>

        {/* Right: Ticket Summary & Help Sidebar */}
        <div className="lg:col-span-4 w-full space-y-4">
          <Card className="border-border/40 bg-card/60 shadow-2xs">
            <CardHeader className="py-3 px-4 border-b border-border/40 bg-secondary/20">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ticket No:</span>
                <span className="font-mono font-bold">{ticket.ticket_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline" className="text-[10px] uppercase">{ticket.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">
                  {ticket.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(ticket.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Replies:</span>
                <span className="font-semibold">{messages?.length || 0} messages</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              <span>Prynt Support Response</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Our team verifies inquiries actively. Replies are delivered in real-time and will also trigger a notification bell alert.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
