'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createSupportTicket(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required' }

  const shopId = formData.get('shopId') as string
  const category = formData.get('category') as string
  const priority = formData.get('priority') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  if (!shopId || !subject || !message) {
    return { error: 'Please fill in all required fields' }
  }

  const ticketNumber = `TICK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

  // 1. Insert ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .insert({
      ticket_number: ticketNumber,
      shop_id: shopId,
      user_id: user.id,
      category,
      priority,
      subject,
      status: 'open',
    })
    .select()
    .single()

  if (ticketError || !ticket) {
    console.error('Ticket insert error:', ticketError)
    return { error: 'Failed to create support ticket' }
  }

  // 2. Insert initial message
  await supabase.from('support_messages').insert({
    ticket_id: ticket.id,
    sender_id: user.id,
    sender_role: 'user',
    message,
  })

  // 3. Notify Super Admins
  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'superadmin')

  if (admins && admins.length > 0) {
    const adminNotifications = admins.map((admin) => ({
      user_id: admin.id,
      title: `New Support Ticket: ${ticketNumber}`,
      message: `${subject} (${category.toUpperCase()})`,
      type: 'support',
      link_url: '/admin/support',
    }))
    await supabase.from('notifications').insert(adminNotifications)
  }

  revalidatePath('/dashboard/support')
  revalidatePath('/admin/support')
  return { success: true, ticketId: ticket.id }
}

export async function sendSupportMessage(
  ticketId: string,
  message: string,
  senderRole: 'user' | 'admin' = 'user'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required' }

  // 1. Insert message
  const { error: msgError } = await supabase.from('support_messages').insert({
    ticket_id: ticketId,
    sender_id: user.id,
    sender_role: senderRole,
    message,
  })

  if (msgError) {
    console.error('Send message error:', msgError)
    return { error: 'Failed to send message' }
  }

  // 2. Update ticket updated_at and reopen if closed
  await supabase
    .from('support_tickets')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  // 3. Fetch ticket to determine recipient for notification
  const { data: ticket } = await supabase
    .from('support_tickets')
    .select('ticket_number, user_id, subject')
    .eq('id', ticketId)
    .single()

  if (ticket) {
    if (senderRole === 'admin') {
      // Notify the Shop Owner
      await supabase.from('notifications').insert({
        user_id: ticket.user_id,
        title: `Admin Replied to Ticket ${ticket.ticket_number}`,
        message: message.length > 80 ? `${message.slice(0, 80)}...` : message,
        type: 'support',
        link_url: `/dashboard/support/${ticketId}`,
      })
    } else {
      // Notify Super Admins
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'superadmin')

      if (admins && admins.length > 0) {
        const adminNotifications = admins.map((admin) => ({
          user_id: admin.id,
          title: `Reply on Ticket ${ticket.ticket_number}`,
          message: message.length > 80 ? `${message.slice(0, 80)}...` : message,
          type: 'support',
          link_url: '/admin/support',
        }))
        await supabase.from('notifications').insert(adminNotifications)
      }
    }
  }

  revalidatePath(`/dashboard/support/${ticketId}`)
  revalidatePath('/dashboard/support')
  revalidatePath('/admin/support')
  return { success: true }
}

export async function closeSupportTicket(ticketId: string) {
  const supabase = await createClient()
  await supabase
    .from('support_tickets')
    .update({ status: 'resolved', updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  revalidatePath(`/dashboard/support/${ticketId}`)
  revalidatePath('/dashboard/support')
  revalidatePath('/admin/support')
  return { success: true }
}
