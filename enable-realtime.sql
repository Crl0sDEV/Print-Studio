-- Run this in your Supabase SQL Editor
-- This enables Realtime broadcasting for the orders table so your Dashboard updates automatically!

alter publication supabase_realtime add table public.orders;
