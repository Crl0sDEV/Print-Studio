'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { Bell, MessageSquare, Crown, Package, Info, Check, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { fetchUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/app/dashboard/notifications/actions'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const loadNotifications = async () => {
    try {
      const data = await fetchUserNotifications()
      setNotifications(data)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 15000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    })
  }

  const handleItemClick = (notificationId: string) => {
    startTransition(async () => {
      await markNotificationAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      )
    })
    setIsOpen(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'support':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'subscription':
        return <Crown className="h-4 w-4 text-amber-500" />
      case 'order':
        return <Package className="h-4 w-4 text-emerald-500" />
      default:
        return <Info className="h-4 w-4 text-primary" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-8 w-8 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border/50 bg-popover text-popover-foreground shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/40 p-3 bg-secondary/30">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-500/15 px-1.5 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-[11px] text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto divide-y divide-border/30">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No notifications yet. You are all caught up!
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 transition-colors hover:bg-secondary/40 flex items-start gap-2.5 ${
                    !item.is_read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-secondary shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.link_url ? (
                      <Link
                        href={item.link_url}
                        onClick={() => handleItemClick(item.id)}
                        className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 flex items-center justify-between"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-60 ml-1 shrink-0" />
                      </Link>
                    ) : (
                      <h4 className="text-xs font-semibold text-foreground line-clamp-1">{item.title}</h4>
                    )}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                      {item.message}
                    </p>
                    <span className="text-[9px] text-muted-foreground/80 font-mono mt-1 block">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {!item.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
