-- ==============================================================================
-- PRYNT STUDIO: PRODUCTION DATABASE SECURITY HARDENING & AUDIT FIXES
-- Applied and verified via Supabase Security Advisor
-- ==============================================================================

-- 1. Fix Search Path & Security Mode on get_user_shop_id (0011 & 0028 & 0029 Fixes)
CREATE OR REPLACE FUNCTION public.get_user_shop_id()
RETURNS UUID
LANGUAGE sql
SECURITY INVOKER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT shop_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Revoke anon execution on get_user_shop_id
REVOKE EXECUTE ON FUNCTION public.get_user_shop_id() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_user_shop_id() TO authenticated;

-- 2. Secure submit_public_order with search_path and defensive validation (0011 Fix)
CREATE OR REPLACE FUNCTION public.submit_public_order(
  p_shop_id UUID,
  p_order_number TEXT,
  p_total_amount NUMERIC,
  p_customer_name TEXT,
  p_customer_contact TEXT,
  p_preset_id UUID,
  p_quantity INTEGER,
  p_file_url TEXT,
  p_file_name TEXT,
  p_unit_price NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  -- Defensive validation
  IF p_shop_id IS NULL OR p_total_amount IS NULL OR p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'Invalid order parameters';
  END IF;

  -- Insert into orders
  INSERT INTO public.orders (
    shop_id, 
    order_number, 
    status, 
    payment_status, 
    total_amount, 
    customer_name, 
    customer_contact
  )
  VALUES (
    p_shop_id, 
    p_order_number, 
    'pending', 
    'unpaid', 
    p_total_amount, 
    p_customer_name, 
    p_customer_contact
  )
  RETURNING id INTO v_order_id;
  
  -- Insert into order_items
  INSERT INTO public.order_items (
    order_id, 
    preset_id, 
    quantity, 
    file_url, 
    file_name, 
    unit_price, 
    subtotal
  )
  VALUES (
    v_order_id, 
    p_preset_id, 
    p_quantity, 
    p_file_url, 
    p_file_name, 
    p_unit_price, 
    p_total_amount
  );
  
  RETURN jsonb_build_object('success', true, 'order_id', v_order_id);
END;
$$;

-- Allow public ordering via submit_public_order RPC
GRANT EXECUTE ON FUNCTION public.submit_public_order(UUID, TEXT, NUMERIC, TEXT, TEXT, UUID, INTEGER, TEXT, TEXT, NUMERIC) TO anon, authenticated;

-- 3. Drop overly permissive RLS policies on orders and order_items (0024 Fix)
DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
DROP POLICY IF EXISTS "Public can create order" ON public.orders;
DROP POLICY IF EXISTS "Staff can insert/update shop orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can view shop orders" ON public.orders;

DROP POLICY IF EXISTS "Allow public insert to order_items" ON public.order_items;
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff can manage order items" ON public.order_items;

-- 4. Clean and robust RLS policies for shop owners and superadmins
DROP POLICY IF EXISTS "Allow shop owners to manage orders" ON public.orders;
CREATE POLICY "Allow shop owners to manage orders" 
ON public.orders FOR ALL 
TO authenticated 
USING (
  shop_id IN (SELECT id FROM public.shops WHERE owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
)
WITH CHECK (
  shop_id IN (SELECT id FROM public.shops WHERE owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
);

DROP POLICY IF EXISTS "Allow shop owners to manage order_items" ON public.order_items;
CREATE POLICY "Allow shop owners to manage order_items" 
ON public.order_items FOR ALL 
TO authenticated 
USING (
  order_id IN (
    SELECT id FROM public.orders 
    WHERE shop_id IN (SELECT id FROM public.shops WHERE owner_id = auth.uid())
       OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
  )
)
WITH CHECK (
  order_id IN (
    SELECT id FROM public.orders 
    WHERE shop_id IN (SELECT id FROM public.shops WHERE owner_id = auth.uid())
       OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'superadmin')
  )
);

-- 5. Drop broad bucket listing policies on storage.objects (0025 Fix)
DROP POLICY IF EXISTS "Allow public viewing of print_assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view receipts" ON storage.objects;
