-- ╔════════════════════════════════════════════════════════════════════════╗
-- ║  Punti Furbi • OFFERS TABLE                                           ║
-- ║  Run this script once in your Supabase SQL editor.                    ║
-- ╚════════════════════════════════════════════════════════════════════════╝

-- 1.  Table ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offers (
  id              UUID PRIMARY KEY            DEFAULT gen_random_uuid(),
  origin          TEXT        NOT NULL,
  destination     TEXT        NOT NULL,
  country         TEXT        NOT NULL,
  price           NUMERIC(10,2) NOT NULL CHECK (price > 0),
  original_price  NUMERIC(10,2) NOT NULL CHECK (original_price > 0),
  discount        INT         NOT NULL CHECK (discount BETWEEN 0 AND 100),
  dates           TEXT        NOT NULL,            -- e.g. "10-25 Feb 2025"
  airline         TEXT        NOT NULL,
  stops           TEXT        NOT NULL,            -- e.g. "Diretto", "1 scalo"
  duration        TEXT,                            -- optional e.g. "6h 30m"
  description     TEXT,
  image_url       TEXT,                            -- Unsplash ID or full URL
  status          TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active','terminated')),
  valid_until     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.  Updated-at trigger ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
CREATE TRIGGER trg_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp();

-- 3.  Indexes ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_offers_status        ON public.offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_origin        ON public.offers(origin);
CREATE INDEX IF NOT EXISTS idx_offers_created_at    ON public.offers(created_at DESC);

-- 4.  Row-Level Security ----------------------------------------------------
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can read ACTIVE offers
CREATE POLICY "public_read_active" ON public.offers
  FOR SELECT USING (status = 'active');

-- Authenticated users can read everything
CREATE POLICY "auth_read_all" ON public.offers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can insert offers
CREATE POLICY "auth_insert" ON public.offers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update offers
CREATE POLICY "auth_update" ON public.offers
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
