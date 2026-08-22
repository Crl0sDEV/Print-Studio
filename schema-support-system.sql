-- ==============================================================================
-- PRYNT STUDIO: SUPPORT TICKETING & NOTIFICATIONS SYSTEM SCHEMA
-- ==============================================================================

-- 1. Create SUPPORT_TICKETS table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL, -- 'billing' | 'studio' | 'orders' | 'bug' | 'general'
    priority TEXT NOT NULL DEFAULT 'medium', -- 'low' | 'medium' | 'high' | 'urgent'
    status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'in_progress' | 'resolved' | 'closed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create SUPPORT_MESSAGES table
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'system', -- 'support' | 'subscription' | 'order' | 'system'
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to ensure clean migration
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can insert own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Superadmins have full access to tickets" ON public.support_tickets;

DROP POLICY IF EXISTS "Users can view messages of own tickets" ON public.support_messages;
DROP POLICY IF EXISTS "Users can insert messages into own tickets" ON public.support_messages;
DROP POLICY IF EXISTS "Superadmins have full access to messages" ON public.support_messages;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Superadmins can insert notifications" ON public.notifications;

-- 6. RLS Policies for SUPPORT_TICKETS
CREATE POLICY "Users can view own tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

CREATE POLICY "Users can insert own tickets"
ON public.support_tickets FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND shop_id IN (SELECT id FROM public.shops WHERE owner_id = auth.uid())
);

CREATE POLICY "Superadmins have full access to tickets"
ON public.support_tickets FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

-- 7. RLS Policies for SUPPORT_MESSAGES
CREATE POLICY "Users can view messages of own tickets"
ON public.support_messages FOR SELECT
TO authenticated
USING (
    ticket_id IN (SELECT id FROM public.support_tickets WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

CREATE POLICY "Users can insert messages into own tickets"
ON public.support_messages FOR INSERT
TO authenticated
WITH CHECK (
    ticket_id IN (SELECT id FROM public.support_tickets WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

CREATE POLICY "Superadmins have full access to messages"
ON public.support_messages FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

-- 8. RLS Policies for NOTIFICATIONS
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow system/authenticated to insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);
