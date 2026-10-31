-- ========================================================
-- ISAPROMORD-HUB (gaorbufugmltlrssfgzc) · Esquema completo, cerrado desde el inicio
-- Panel: solo correos en public.isapromo_admins. Público: solo funciones acotadas.
-- ========================================================

CREATE TABLE IF NOT EXISTS public.agency_clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Sin nombre',
    category TEXT DEFAULT 'General',
    live_url TEXT DEFAULT '',
    platform TEXT DEFAULT '',
    contact_person TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    status TEXT DEFAULT 'active',
    fee TEXT DEFAULT '',
    renewal_date DATE,
    last_payment_date DATE,
    joined_date DATE,
    repo_url TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    health_score INTEGER DEFAULT 100,
    optimization_matrix JSONB DEFAULT '{}'::jsonb,
    tasks JSONB DEFAULT '[]'::jsonb,
    payment_history JSONB DEFAULT '[]'::jsonb,
    uptime_status TEXT,
    latency_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agency_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    client_id TEXT NOT NULL,
    type TEXT,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    farm_or_company TEXT,
    service_or_product TEXT,
    amount NUMERIC DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'nuevo',
    notes TEXT,
    attribution TEXT
);

CREATE TABLE IF NOT EXISTS public.isapromo_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_slug TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    website_url TEXT,
    reward_description TEXT DEFAULT '1 Mes de Mantenimiento Web Gratis',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

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

-- 1.1 Correos con acceso al panel
CREATE TABLE IF NOT EXISTS public.isapromo_admins (
    email TEXT PRIMARY KEY
);
ALTER TABLE public.isapromo_admins ENABLE ROW LEVEL SECURITY;
-- Sin políticas: nadie la lee desde la web; solo las funciones de abajo.


CREATE OR REPLACE FUNCTION public.is_isapromo_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.isapromo_admins
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 1.2 Formulario de diagnóstico de la portada: crea un prospecto, nada más
CREATE OR REPLACE FUNCTION public.public_submit_lead(p_name TEXT, p_whatsapp TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF coalesce(trim(p_name), '') = '' OR coalesce(trim(p_whatsapp), '') = '' THEN
    RAISE EXCEPTION 'name and whatsapp are required';
  END IF;
  INSERT INTO public.agency_clients (id, name, category, status, fee, phone, live_url, notes, optimization_matrix, updated_at)
  VALUES (
    'lead-' || replace(gen_random_uuid()::text, '-', ''),
    left(trim(p_name), 120),
    'Lead Diagnóstico Maps',
    'lead',
    'Prospecto Entrante',
    left(trim(p_whatsapp), 40),
    CASE WHEN p_name LIKE '%.%' THEN left(trim(p_name), 200) ELSE '' END,
    'Solicitud de Diagnóstico Maps captada desde isapromord.com.',
    jsonb_build_object('tasks', jsonb_build_array(
      jsonb_build_object('id', 't1', 'title', 'Analizar posición en Google Maps y 3 competidores', 'done', false),
      jsonb_build_object('id', 't2', 'title', 'Enviar diagnóstico por WhatsApp', 'done', false))),
    now()
  );
END;
$$;

-- 1.3 Contrato público: leer UN contrato por su id
CREATE OR REPLACE FUNCTION public.public_get_contract(p_id TEXT)
RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c
  FROM public.agency_clients v,
       jsonb_array_elements(coalesce(v.optimization_matrix -> 'contracts', '[]'::jsonb)) c
  WHERE v.id = '__isapromo_system_vault__'
    AND (c ->> 'id' = p_id OR c ->> 'contractNumber' = p_id)
  LIMIT 1;
$$;

-- 1.4 Contrato público: firmar. Solo se guardan los campos de la firma;
-- precios y servicios quedan como los dejó la agencia.
CREATE OR REPLACE FUNCTION public.public_sign_contract(p_id TEXT, p_signed JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_matrix JSONB;
  v_list JSONB;
  v_idx INT;
  v_current JSONB;
BEGIN
  SELECT optimization_matrix INTO v_matrix
  FROM public.agency_clients WHERE id = '__isapromo_system_vault__' FOR UPDATE;
  v_list := coalesce(v_matrix -> 'contracts', '[]'::jsonb);

  SELECT i - 1, e INTO v_idx, v_current
  FROM jsonb_array_elements(v_list) WITH ORDINALITY AS t(e, i)
  WHERE e ->> 'id' = p_id OR e ->> 'contractNumber' = p_id
  LIMIT 1;

  IF v_idx IS NULL OR v_current ->> 'status' = 'signed' THEN
    RETURN FALSE;
  END IF;

  v_current := v_current || jsonb_build_object(
    'status', 'signed',
    'signedAt', left(p_signed ->> 'signedAt', 80),
    'signedBy', left(p_signed ->> 'signedBy', 120),
    'signerDocId', left(p_signed ->> 'signerDocId', 40),
    'signatureData', left(p_signed ->> 'signatureData', 300000),
    'signatureHash', left(p_signed ->> 'signatureHash', 120),
    'signedServerAt', now()
  );
  v_list := jsonb_set(v_list, ARRAY[v_idx::text], v_current);

  UPDATE public.agency_clients
  SET optimization_matrix = jsonb_set(v_matrix, '{contracts}', v_list) || jsonb_build_object('updatedAt', now()),
      updated_at = now()
  WHERE id = '__isapromo_system_vault__';
  RETURN TRUE;
END;
$$;

-- 1.5 Propuesta pública: aprobar. Marca la propuesta como aprobada y, si no
-- existe, deja un contrato pendiente de firma para que la agencia lo revise.
CREATE OR REPLACE FUNCTION public.public_approve_proposal(p_id TEXT, p_payload JSONB, p_contract JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_matrix JSONB;
  v_props JSONB;
  v_contracts JSONB;
  v_idx INT;
BEGIN
  IF coalesce(p_id, '') = '' OR length(p_payload::text) > 200000 OR length(p_contract::text) > 200000 THEN
    RETURN FALSE;
  END IF;

  SELECT optimization_matrix INTO v_matrix
  FROM public.agency_clients WHERE id = '__isapromo_system_vault__' FOR UPDATE;
  IF v_matrix IS NULL THEN
    RETURN FALSE;
  END IF;

  v_matrix := jsonb_set(v_matrix, '{proposalPayloads}',
    coalesce(v_matrix -> 'proposalPayloads', '{}'::jsonb) || jsonb_build_object(p_id, p_payload));

  -- Solo se aprueban propuestas que la agencia creó desde el panel
  v_props := coalesce(v_matrix -> 'proposals', '[]'::jsonb);
  SELECT i - 1 INTO v_idx FROM jsonb_array_elements(v_props) WITH ORDINALITY AS t(e, i)
  WHERE e ->> 'id' = p_id LIMIT 1;
  IF v_idx IS NULL THEN
    RETURN FALSE;
  END IF;
  v_props := jsonb_set(v_props, ARRAY[v_idx::text],
    (v_props -> v_idx) || jsonb_build_object('status', 'approved', 'approvedAt', p_payload ->> 'approvedAt'));
  v_matrix := jsonb_set(v_matrix, '{proposals}', v_props);

  v_contracts := coalesce(v_matrix -> 'contracts', '[]'::jsonb);
  IF p_contract ? 'id' AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(v_contracts) e WHERE e ->> 'id' = p_contract ->> 'id'
  ) THEN
    v_matrix := jsonb_set(v_matrix, '{contracts}',
      jsonb_build_array(p_contract || jsonb_build_object('status', 'sent')) || v_contracts);
  END IF;

  UPDATE public.agency_clients
  SET optimization_matrix = v_matrix || jsonb_build_object('updatedAt', now()), updated_at = now()
  WHERE id = '__isapromo_system_vault__';
  RETURN TRUE;
END;
$$;

-- 1.6 Propuesta pública: leer los textos de una propuesta creada en el panel (los mismos datos que lleva su enlace)
CREATE OR REPLACE FUNCTION public.public_get_proposal(p_id TEXT)
RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT v.optimization_matrix -> 'proposalPayloads' -> p_id
  FROM public.agency_clients v
  WHERE v.id = '__isapromo_system_vault__'
    AND EXISTS (
      SELECT 1 FROM jsonb_array_elements(coalesce(v.optimization_matrix -> 'proposals', '[]'::jsonb)) e
      WHERE e ->> 'id' = p_id
    );
$$;

REVOKE ALL ON FUNCTION public.public_submit_lead(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_get_contract(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_sign_contract(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_approve_proposal(TEXT, JSONB, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_get_proposal(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_submit_lead(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_get_contract(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_sign_contract(TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_approve_proposal(TEXT, JSONB, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_get_proposal(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_isapromo_admin() TO anon, authenticated;



-- Políticas: todo cerrado salvo lo indispensable para las páginas públicas
ALTER TABLE public.agency_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isapromo_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isapromo_referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isapromo_referral_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo administradores" ON public.agency_clients
  FOR ALL TO authenticated USING (public.is_isapromo_admin()) WITH CHECK (public.is_isapromo_admin());

CREATE POLICY "Formularios registran prospectos" ON public.agency_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Solo administradores leen prospectos" ON public.agency_leads
  FOR ALL TO authenticated USING (public.is_isapromo_admin()) WITH CHECK (public.is_isapromo_admin());

CREATE POLICY "Lectura publica de socios" ON public.isapromo_referrals FOR SELECT USING (true);
CREATE POLICY "Solo administradores editan socios" ON public.isapromo_referrals
  FOR ALL TO authenticated USING (public.is_isapromo_admin()) WITH CHECK (public.is_isapromo_admin());

CREATE POLICY "Registrar clics" ON public.isapromo_referral_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Solo administradores leen clics" ON public.isapromo_referral_clicks
  FOR SELECT TO authenticated USING (public.is_isapromo_admin());

CREATE POLICY "Registrar conversiones" ON public.isapromo_referral_conversions FOR INSERT WITH CHECK (true);
CREATE POLICY "Solo administradores leen conversiones" ON public.isapromo_referral_conversions
  FOR SELECT TO authenticated USING (public.is_isapromo_admin());
