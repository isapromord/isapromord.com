-- ========================================================
-- ISAPROMORD-HUB (biomfntvqbhjmmmggxzj)
-- Migración de Tablas de Referidos y Telemetría
-- Ejecuta este script en el SQL Editor de isapromord-hub
-- ========================================================

-- 1. Tabla de Socios de Referidos
CREATE TABLE IF NOT EXISTS public.isapromo_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_slug TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    website_url TEXT,
    reward_description TEXT DEFAULT '1 Mes de Mantenimiento Web Gratis',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.isapromo_referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura publica a referrals" ON public.isapromo_referrals;
DROP POLICY IF EXISTS "Permitir insercion a referrals" ON public.isapromo_referrals;
CREATE POLICY "Permitir lectura publica a referrals" ON public.isapromo_referrals FOR SELECT USING (true);
CREATE POLICY "Permitir insercion a referrals" ON public.isapromo_referrals FOR ALL USING (true);

-- 2. Tabla de Clics de Referidos (Telemetría de Enlaces)
CREATE TABLE IF NOT EXISTS public.isapromo_referral_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_slug TEXT NOT NULL,
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.isapromo_referral_clicks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura publica a referral_clicks" ON public.isapromo_referral_clicks;
DROP POLICY IF EXISTS "Permitir insercion a referral_clicks" ON public.isapromo_referral_clicks;
CREATE POLICY "Permitir lectura publica a referral_clicks" ON public.isapromo_referral_clicks FOR SELECT USING (true);
CREATE POLICY "Permitir insercion a referral_clicks" ON public.isapromo_referral_clicks FOR INSERT WITH CHECK (true);

-- 3. Tabla de Conversiones de Referidos (Leads / Clics WhatsApp)
CREATE TABLE IF NOT EXISTS public.isapromo_referral_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_slug TEXT NOT NULL,
    conversion_type TEXT DEFAULT 'whatsapp_click',
    contact_name TEXT,
    contact_phone TEXT,
    details TEXT,
    status TEXT DEFAULT 'lead',
    deal_value NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.isapromo_referral_conversions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura publica a referral_conversions" ON public.isapromo_referral_conversions;
DROP POLICY IF EXISTS "Permitir insercion a referral_conversions" ON public.isapromo_referral_conversions;
CREATE POLICY "Permitir lectura publica a referral_conversions" ON public.isapromo_referral_conversions FOR SELECT USING (true);
CREATE POLICY "Permitir insercion a referral_conversions" ON public.isapromo_referral_conversions FOR INSERT WITH CHECK (true);

-- 4. Inserción de Socios Actuales
INSERT INTO public.isapromo_referrals (client_slug, client_name, website_url, reward_description, is_active)
VALUES 
  ('pasionpecuaria', 'Pasión Pecuaria RD', 'https://pasionpecuaria.vercel.app', '1 Mes de Mantenimiento Web Gratis', true)
ON CONFLICT (client_slug) DO UPDATE 
SET client_name = EXCLUDED.client_name, website_url = EXCLUDED.website_url;
