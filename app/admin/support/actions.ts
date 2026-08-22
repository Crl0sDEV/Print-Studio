'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Verify Super Admin
async function verifySuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

export async function adminReplyTicket(ticketId: string, message: string) {
  const { supabase, user } = await verifySuperAdmin()

  // 1. Insert message
  const { error: msgError } = await supabase.from('support_messages').insert({
    ticket_id: ticketId,
    sender_id: user.id,
    sender_role: 'admin',
    message,
  })

  if (msgError) {
    console.error('Admin reply error:', msgError)
    return { error: 'Failed to send admin reply' }
  }

  // 2. Fetch ticket to notify user
  const { data: ticket } = await supabase
    .from('support_tickets')
    .select('user_id, ticket_number')
    .eq('id', ticketId)
    .single()

  if (ticket) {
    await supabase.from('notifications').insert({
      user_id: ticket.user_id,
      title: `Admin Replied to Ticket ${ticket.ticket_number}`,
      message: message.length > 80 ? `${message.slice(0, 80)}...` : message,
      type: 'support',
      link_url: `/dashboard/support/${ticketId}`,
    })
  }

  revalidatePath('/admin/support')
  revalidatePath(`/dashboard/support/${ticketId}`)
  return { success: true }
}

export async function adminUpdateTicketStatus(ticketId: string, status: string) {
  const { supabase } = await verifySuperAdmin()

  const { error } = await supabase
    .from('support_tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  if (error) {
    console.error('Update status error:', error)
    return { error: 'Failed to update ticket status' }
  }

  // Fetch ticket to notify user
  const { data: ticket } = await supabase
    .from('support_tickets')
    .select('user_id, ticket_number')
    .eq('id', ticketId)
    .single()

  if (ticket && status === 'resolved') {
    await supabase.from('notifications').insert({
      user_id: ticket.user_id,
      title: `Ticket ${ticket.ticket_number} Resolved`,
      message: 'Your support inquiry has been marked as resolved by the admin team.',
      type: 'support',
      link_url: `/dashboard/support/${ticketId}`,
    })
  }

  revalidatePath('/admin/support')
  revalidatePath(`/dashboard/support/${ticketId}`)
  return { success: true }
}
