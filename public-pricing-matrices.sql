-- Run this in your Supabase SQL Editor
-- This ensures that everyone (customers and shop owners) can read the pricing tiers.

-- 1. Enable RLS (if not already enabled)
ALTER TABLE public.pricing_matrices ENABLE ROW LEVEL SECURITY;

-- 2. Drop any old policies
DROP POLICY IF EXISTS "Allow public read access to pricing_matrices" ON public.pricing_matrices;

-- 3. Allow ANYONE to read the pricing matrices (so the calculator can work)
CREATE POLICY "Allow public read access to pricing_matrices" 
ON public.pricing_matrices FOR SELECT 
TO public 
USING (true);

-- (Optional) Make sure presets are also readable
ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to presets" ON public.presets;
CREATE POLICY "Allow public read access to presets" 
ON public.presets FOR SELECT 
TO public 
USING (true);
