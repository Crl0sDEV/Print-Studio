-- Run this in your Supabase SQL Editor
-- This creates a secure server-side function to bypass RLS for public order submissions

-- 1. Ensure quantity column exists (it seems to be missing in your schema)
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;

-- 2. Create the RPC function
CREATE OR REPLACE FUNCTION submit_public_order(
  p_shop_id UUID, 
  p_order_number TEXT, 
  p_total_amount NUMERIC, 
  p_customer_name TEXT, 
  p_customer_contact TEXT, 
  p_preset_id UUID, 
  p_quantity INT, 
  p_file_url TEXT, 
  p_file_name TEXT, 
  p_unit_price NUMERIC
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This makes it run with admin privileges (bypassing RLS)
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  -- Insert into orders
  INSERT INTO public.orders (shop_id, order_number, status, payment_status, total_amount, customer_name, customer_contact)
  VALUES (p_shop_id, p_order_number, 'pending', 'unpaid', p_total_amount, p_customer_name, p_customer_contact)
  RETURNING id INTO v_order_id;
  
  -- Insert into order_items
  INSERT INTO public.order_items (order_id, preset_id, quantity, file_url, file_name, unit_price, subtotal)
  VALUES (v_order_id, p_preset_id, p_quantity, p_file_url, p_file_name, p_unit_price, p_total_amount);
  
  RETURN jsonb_build_object('success', true, 'order_id', v_order_id);
END;
$$;
