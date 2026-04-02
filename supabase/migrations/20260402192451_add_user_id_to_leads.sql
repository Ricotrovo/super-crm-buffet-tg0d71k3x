DO $$
BEGIN
  -- Add user_id column if it doesn't exist to link leads to the logged-in user
  ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  
  -- Automatically fill user_id with the authenticated user's ID
  ALTER TABLE public.leads ALTER COLUMN user_id SET DEFAULT auth.uid();
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- Ensure RLS is enabled on the table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them clean and guarantee access
DROP POLICY IF EXISTS "authenticated_select" ON public.leads;
DROP POLICY IF EXISTS "authenticated_insert" ON public.leads;
DROP POLICY IF EXISTS "authenticated_update" ON public.leads;
DROP POLICY IF EXISTS "authenticated_delete" ON public.leads;

-- Create policies ensuring authenticated users can perform all operations
CREATE POLICY "authenticated_select" ON public.leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_insert" ON public.leads
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON public.leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete" ON public.leads
  FOR DELETE TO authenticated USING (true);
