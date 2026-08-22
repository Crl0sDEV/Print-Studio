import { ShieldCheck, User } from 'lucide-react'

interface TicketChatBubbleProps {
  message: {
    id: string
    sender_id: string
    sender_role: 'user' | 'admin'
    message: string
    created_at: string
  }
}

export function TicketChatBubble({ message }: TicketChatBubbleProps) {
  const isSenderAdmin = message.sender_role === 'admin'

  return (
    <div
      className={`flex items-start gap-2 sm:gap-3 max-w-[92%] sm:max-w-[80%] ${
        isSenderAdmin ? 'ml-auto flex-row-reverse' : 'mr-auto'
      }`}
    >
      <div
        className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
          isSenderAdmin
            ? 'bg-amber-500 text-white dark:bg-amber-600'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {isSenderAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      <div className="space-y-1 min-w-0 flex-1">
        <div
          className={`flex items-center gap-1.5 text-[10px] text-muted-foreground ${
            isSenderAdmin ? 'justify-end' : ''
          }`}
        >
          <span className="font-semibold text-foreground">
            {isSenderAdmin ? 'Prynt Support Admin' : 'Shop Owner'}
          </span>
          <span>•</span>
          <span>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div
          className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed break-words shadow-2xs ${
            isSenderAdmin
              ? 'bg-amber-500/10 text-foreground border border-amber-500/20 rounded-tr-xs'
              : 'bg-secondary/60 text-foreground border border-border/50 rounded-tl-xs'
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  )
}
