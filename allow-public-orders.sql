-- Run this in your Supabase SQL Editor to allow public form submissions

-- 1. Allow anonymous customers to insert new Orders
CREATE POLICY "Allow public insert to orders" 
ON public.orders FOR INSERT 
TO public 
WITH CHECK (true);

-- 2. Allow anonymous customers to insert Order Items
CREATE POLICY "Allow public insert to order_items" 
ON public.order_items FOR INSERT 
TO public 
WITH CHECK (true);
