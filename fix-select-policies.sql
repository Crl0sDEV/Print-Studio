-- Run this in your Supabase SQL Editor
-- This gives the Shop Owner full access to Read, Update, and Delete their own orders

-- 1. Enable RLS on the tables (just to be safe)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 2. Drop any old confusing policies if they exist (to start clean)
DROP POLICY IF EXISTS "Allow shop owners to manage orders" ON public.orders;
DROP POLICY IF EXISTS "Allow shop owners to manage order_items" ON public.order_items;

-- 3. Create full access policies for the Shop Owner based on authenticated user ID
CREATE POLICY "Allow shop owners to manage orders" 
ON public.orders FOR ALL 
TO authenticated 
USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()))
WITH CHECK (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));

CREATE POLICY "Allow shop owners to manage order_items" 
ON public.order_items FOR ALL 
TO authenticated 
USING (order_id IN (SELECT id FROM orders WHERE shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())))
WITH CHECK (order_id IN (SELECT id FROM orders WHERE shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())));
