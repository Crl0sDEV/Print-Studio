-- ==============================================================================
-- PRYNT STUDIO: FREEMIUM SAAS & MANUAL GCASH/MAYA SUBSCRIPTIONS SCHEMA
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. Add 'superadmin' to the existing PostgreSQL user_role enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'superadmin';

-- 2. Extend SHOPS table with subscription columns
ALTER TABLE public.shops 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- 3. Create SUBSCRIPTION_REQUESTS table for manual GCash / Maya proof uploads
CREATE TABLE IF NOT EXISTS public.subscription_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_tier TEXT NOT NULL, -- 'pro_monthly' | 'pro_annual'
    amount_paid NUMERIC(10,2) NOT NULL, -- e.g. 199.00 or 1799.00
    payment_method TEXT NOT NULL, -- 'gcash' | 'maya'
    reference_number TEXT NOT NULL, -- e.g. '9021 3482 1928'
    receipt_url TEXT NOT NULL, -- URL of uploaded screenshot in storage
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    admin_notes TEXT, -- optional rejection reason or verification notes
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Enable Row-Level Security (RLS) on subscription_requests
ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to ensure clean migration
DROP POLICY IF EXISTS "Users can view own subscription requests" ON public.subscription_requests;
DROP POLICY IF EXISTS "Users can insert own subscription requests" ON public.subscription_requests;
DROP POLICY IF EXISTS "Superadmins have full access to subscription requests" ON public.subscription_requests;

-- 6. Create RLS Policies for SUBSCRIPTION_REQUESTS

-- Shop owners can view their own subscription requests or superadmin can view all
CREATE POLICY "Users can view own subscription requests"
ON public.subscription_requests FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

-- Shop owners can insert new subscription requests for their own shop
CREATE POLICY "Users can insert own subscription requests"
ON public.subscription_requests FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid() 
    AND shop_id IN (SELECT id FROM public.shops WHERE owner_id = auth.uid())
);

-- Superadmins can update subscription requests (Approve / Reject)
CREATE POLICY "Superadmins have full access to subscription requests"
ON public.subscription_requests FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

-- 7. Superadmin access to SHOPS (for viewing all shops and manually updating plans)
DROP POLICY IF EXISTS "Superadmins can update all shops" ON public.shops;
CREATE POLICY "Superadmins can update all shops"
ON public.shops FOR ALL
TO authenticated
USING (
    owner_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
)
WITH CHECK (
    owner_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

-- 8. Create Storage Bucket for Payment Receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_receipts', 'payment_receipts', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Storage Policies for payment_receipts bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload receipts" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment_receipts');

DROP POLICY IF EXISTS "Allow authenticated users to view receipts" ON storage.objects;
CREATE POLICY "Allow authenticated users to view receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment_receipts');
