CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_all_categories" ON public.product_categories;
CREATE POLICY "authenticated_all_categories" ON public.product_categories
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Ensure products RLS is properly set
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all_products" ON public.products;
CREATE POLICY "authenticated_all_products" ON public.products
FOR ALL TO authenticated USING (true) WITH CHECK (true);
