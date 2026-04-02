DO $
BEGIN
  CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source TEXT DEFAULT 'WhatsApp',
    phone TEXT,
    "mobilePhone" TEXT,
    "businessPhone" TEXT,
    email TEXT,
    "instagramProfile" TEXT,
    "eventDate" DATE,
    "guestCount" INTEGER,
    "selectedMenu" TEXT,
    "hasVisited" BOOLEAN DEFAULT false,
    "hasTasted" BOOLEAN DEFAULT false,
    "visitDate" DATE,
    observations TEXT,
    score INTEGER DEFAULT 5,
    stage TEXT DEFAULT 'Novo',
    "daysInStage" INTEGER DEFAULT 0,
    "aiSummary" TEXT,
    children JSONB DEFAULT '[]'::jsonb,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
EXCEPTION
  WHEN OTHERS THEN null;
END $;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select" ON public.leads;
CREATE POLICY "authenticated_select" ON public.leads
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert" ON public.leads;
CREATE POLICY "authenticated_insert" ON public.leads
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update" ON public.leads;
CREATE POLICY "authenticated_update" ON public.leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete" ON public.leads;
CREATE POLICY "authenticated_delete" ON public.leads
  FOR DELETE TO authenticated USING (true);
