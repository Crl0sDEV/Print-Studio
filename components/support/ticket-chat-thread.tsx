'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { sendSupportMessage, closeSupportTicket } from '@/app/dashboard/support/actions'
import { TicketChatBubble } from './ticket-chat-bubble'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'

interface Message {
  id: string
  sender_id: string
  sender_role: 'user' | 'admin'
  message: string
  created_at: string
}

interface TicketChatThreadProps {
  ticket: {
    id: string
    ticket_number: string
    subject: string
    category: string
    status: string
    priority: string
    created_at: string
  }
  messages: Message[]
  currentUserId: string
  isAdminView?: boolean
}

export function TicketChatThread({
  ticket,
  messages: initialMessages,
  currentUserId,
  isAdminView = false,
}: TicketChatThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [ticketStatus, setTicketStatus] = useState(ticket.status)
  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const messageText = inputMessage.trim()
    setInputMessage('')

    // Optimistic message append
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      sender_id: currentUserId,
      sender_role: isAdminView ? 'admin' : 'user',
      message: messageText,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMessage])
    if (ticketStatus === 'resolved' || ticketStatus === 'closed') {
      setTicketStatus('open')
    }

    startTransition(async () => {
      await sendSupportMessage(ticket.id, messageText, isAdminView ? 'admin' : 'user')
    })
  }

  const handleResolveTicket = () => {
    startTransition(async () => {
      await closeSupportTicket(ticket.id)
      setTicketStatus('resolved')
    })
  }

  return (
    <Card className="border-border/40 flex flex-col w-full h-[calc(100vh-14rem)] min-h-[500px] max-h-[850px] shadow-sm bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Responsive Chat Header */}
      <CardHeader className="py-3 px-3.5 sm:px-6 border-b border-border/40 flex flex-row items-center justify-between gap-2 shrink-0 bg-secondary/20">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-mono text-[11px] sm:text-xs font-bold text-muted-foreground">
              {ticket.ticket_number}
            </span>
            <Badge variant="outline" className="text-[9px] sm:text-[10px] uppercase font-semibold">
              {ticket.category}
            </Badge>
            {ticketStatus === 'resolved' ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] sm:text-[10px]">
                Resolved
              </Badge>
            ) : (
              <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[9px] sm:text-[10px]">
                {ticketStatus.toUpperCase()}
              </Badge>
            )}
          </div>
          <CardTitle className="text-sm sm:text-base font-bold mt-1 text-foreground truncate">
            {ticket.subject}
          </CardTitle>
        </div>

        {ticketStatus !== 'resolved' && ticketStatus !== 'closed' ? (
          <Button
            size="xs"
            variant="outline"
            onClick={handleResolveTicket}
            disabled={isPending}
            className="text-[11px] sm:text-xs font-semibold gap-1 h-7 sm:h-8 px-2 sm:px-3 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 shrink-0"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mark as Resolved</span>
            <span className="sm:hidden">Resolve</span>
          </Button>
        ) : (
          <Badge variant="secondary" className="text-[10px] hidden sm:flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            Resolved
          </Badge>
        )}
      </CardHeader>

      {/* Fluid Messages Body */}
      <CardContent className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            No messages yet. Send a message below.
          </div>
        ) : (
          messages.map((msg) => (
            <TicketChatBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Sticky Responsive Input Footer */}
      <CardFooter className="p-2.5 sm:p-3 border-t border-border/40 shrink-0 bg-background/95 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
          <input
            type="text"
            placeholder={
              ticketStatus === 'resolved'
                ? 'Ticket resolved. Type to reopen and continue...'
                : 'Type your message to support...'
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
          />
          <Button
            type="submit"
            size="sm"
            className="font-bold text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 gap-1.5 shadow-sm shrink-0"
            disabled={isPending || !inputMessage.trim()}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
