-- ========================================================
-- ISAPROMORD-HUB (biomfntvqbhjmmmggxzj) · Cierre de acceso público
-- Ejecutar en el SQL Editor de Supabase EN DOS PASOS:
--   PASO 1 (seguro, no rompe nada): administradores + funciones públicas.
--   PASO 2 (después de publicar la web nueva): activar RLS solo-dueño.
-- ========================================================


-- ======================= PASO 1 =========================

-- 1.1 Correos con acceso al panel
CREATE TABLE IF NOT EXISTS public.isapromo_admins (
    email TEXT PRIMARY KEY
);
ALTER TABLE public.isapromo_admins ENABLE ROW LEVEL SECURITY;
-- Sin políticas: nadie la lee desde la web; solo las funciones de abajo.

-- >>> Cambia el correo por el de tu cuenta del panel (Authentication > Users) <<<
INSERT INTO public.isapromo_admins (email) VALUES ('TU_CORREO@ejemplo.com')
ON CONFLICT DO NOTHING;

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

  v_props := coalesce(v_matrix -> 'proposals', '[]'::jsonb);
  SELECT i - 1 INTO v_idx FROM jsonb_array_elements(v_props) WITH ORDINALITY AS t(e, i)
  WHERE e ->> 'id' = p_id LIMIT 1;
  IF v_idx IS NOT NULL THEN
    v_props := jsonb_set(v_props, ARRAY[v_idx::text],
      (v_props -> v_idx) || jsonb_build_object('status', 'approved', 'approvedAt', p_payload ->> 'approvedAt'));
    v_matrix := jsonb_set(v_matrix, '{proposals}', v_props);
  END IF;

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

REVOKE ALL ON FUNCTION public.public_submit_lead(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_get_contract(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_sign_contract(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_approve_proposal(TEXT, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_submit_lead(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_get_contract(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_sign_contract(TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_approve_proposal(TEXT, JSONB, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_isapromo_admin() TO anon, authenticated;


-- ======================= PASO 2 =========================
-- Ejecutar SOLO después de publicar la web nueva y de entrar al panel con tu correo.

-- 2.1 Clientes, prospectos y bóveda (contratos, contabilidad): solo el dueño
ALTER TABLE public.agency_clients ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agency_clients' LOOP
    EXECUTE format('DROP POLICY %I ON public.agency_clients', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY "Solo administradores" ON public.agency_clients
  FOR ALL TO authenticated USING (public.is_isapromo_admin()) WITH CHECK (public.is_isapromo_admin());

-- 2.2 Referidos: los socios se pueden leer (enlaces públicos); solo el dueño los edita
DROP POLICY IF EXISTS "Permitir lectura publica a referrals" ON public.isapromo_referrals;
DROP POLICY IF EXISTS "Permitir insercion a referrals" ON public.isapromo_referrals;
CREATE POLICY "Lectura publica de socios" ON public.isapromo_referrals FOR SELECT USING (true);
CREATE POLICY "Solo administradores editan socios" ON public.isapromo_referrals
  FOR ALL TO authenticated USING (public.is_isapromo_admin()) WITH CHECK (public.is_isapromo_admin());

-- 2.3 Clics y conversiones: el público solo registra; solo el dueño lee (tienen teléfonos)
DROP POLICY IF EXISTS "Permitir lectura publica a referral_clicks" ON public.isapromo_referral_clicks;
DROP POLICY IF EXISTS "Permitir lectura publica a referral_conversions" ON public.isapromo_referral_conversions;
CREATE POLICY "Solo administradores leen clics" ON public.isapromo_referral_clicks
  FOR SELECT TO authenticated USING (public.is_isapromo_admin());
CREATE POLICY "Solo administradores leen conversiones" ON public.isapromo_referral_conversions
  FOR SELECT TO authenticated USING (public.is_isapromo_admin());
