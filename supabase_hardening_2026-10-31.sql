-- ========================================================
-- ISAPROMORD-HUB · Endurecimiento 2026-10-31 (aplicar después de supabase_hub_schema.sql)
-- Todo lo que llega desde páginas públicas se limpia antes de guardarse:
-- sin caracteres de código (< > " ' `), números como números y tamaños limitados.
-- ========================================================

-- Quita caracteres que permiten inyectar código y limita el largo de cada texto
CREATE OR REPLACE FUNCTION public.isapromo_clean_text(p TEXT, p_max INT DEFAULT 2000)
RETURNS TEXT
LANGUAGE sql IMMUTABLE SET search_path = public
AS $$
  SELECT left(regexp_replace(coalesce(p, ''), '[<>"''`\\]', '', 'g'), p_max);
$$;

-- Aplica isapromo_clean_text a todos los textos de un JSON (y a sus claves)
CREATE OR REPLACE FUNCTION public.isapromo_clean_json(p JSONB, p_depth INT DEFAULT 0)
RETURNS JSONB
LANGUAGE plpgsql IMMUTABLE SET search_path = public
AS $$
DECLARE
  v_out JSONB;
  v_key TEXT;
  v_val JSONB;
BEGIN
  IF p IS NULL OR p_depth > 8 THEN
    RETURN 'null'::jsonb;
  END IF;
  CASE jsonb_typeof(p)
    WHEN 'string' THEN
      RETURN to_jsonb(public.isapromo_clean_text(p #>> '{}'));
    WHEN 'object' THEN
      v_out := '{}'::jsonb;
      FOR v_key, v_val IN SELECT * FROM jsonb_each(p) LOOP
        v_out := v_out || jsonb_build_object(public.isapromo_clean_text(v_key, 80), public.isapromo_clean_json(v_val, p_depth + 1));
      END LOOP;
      RETURN v_out;
    WHEN 'array' THEN
      SELECT coalesce(jsonb_agg(public.isapromo_clean_json(e, p_depth + 1)), '[]'::jsonb) INTO v_out
      FROM (SELECT e FROM jsonb_array_elements(p) e LIMIT 200) s;
      RETURN v_out;
    ELSE
      RETURN p;
  END CASE;
END;
$$;

-- Fuerza que los campos de importe sean números (0 si no lo son)
CREATE OR REPLACE FUNCTION public.isapromo_numeric_fields(p JSONB, p_keys TEXT[])
RETURNS JSONB
LANGUAGE plpgsql IMMUTABLE SET search_path = public
AS $$
DECLARE
  v_key TEXT;
BEGIN
  FOREACH v_key IN ARRAY p_keys LOOP
    IF p ? v_key AND jsonb_typeof(p -> v_key) <> 'number' THEN
      p := p || jsonb_build_object(v_key, 0);
    END IF;
  END LOOP;
  RETURN p;
END;
$$;

-- Aprobar propuesta: solo propuestas del panel, datos limpios, contrato con id válido
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

  -- Solo se aprueban propuestas que la agencia creó desde el panel
  v_props := coalesce(v_matrix -> 'proposals', '[]'::jsonb);
  SELECT i - 1 INTO v_idx FROM jsonb_array_elements(v_props) WITH ORDINALITY AS t(e, i)
  WHERE e ->> 'id' = p_id LIMIT 1;
  IF v_idx IS NULL THEN
    RETURN FALSE;
  END IF;

  p_payload := public.isapromo_clean_json(p_payload);
  IF jsonb_typeof(p_payload) <> 'object' THEN
    RETURN FALSE;
  END IF;
  p_payload := public.isapromo_numeric_fields(p_payload, ARRAY['finalSetup', 'finalMonthly', 'finalAdvance']);

  v_matrix := jsonb_set(v_matrix, '{proposalPayloads}',
    coalesce(v_matrix -> 'proposalPayloads', '{}'::jsonb) || jsonb_build_object(p_id, p_payload));
  v_props := jsonb_set(v_props, ARRAY[v_idx::text],
    (v_props -> v_idx) || jsonb_build_object('status', 'approved', 'approvedAt', left(p_payload ->> 'approvedAt', 40)));
  v_matrix := jsonb_set(v_matrix, '{proposals}', v_props);

  IF jsonb_typeof(p_contract) = 'object' AND (p_contract ->> 'id') ~ '^[A-Za-z0-9_-]{1,64}$' THEN
    p_contract := public.isapromo_clean_json(p_contract)
      - 'signedBy' - 'signerDocId' - 'signatureData' - 'signatureHash' - 'signedAt' - 'signedServerAt' - 'depositRecordedInCfo';
    p_contract := public.isapromo_numeric_fields(p_contract,
      ARRAY['totalSetup', 'totalMonthly', 'depositAmount', 'completionAmount']);
    IF coalesce(p_contract ->> 'contractNumber', '') !~ '^[A-Za-z0-9_-]{0,40}$' THEN
      p_contract := p_contract || jsonb_build_object('contractNumber', p_contract ->> 'id');
    END IF;
    v_contracts := coalesce(v_matrix -> 'contracts', '[]'::jsonb);
    IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(v_contracts) e WHERE e ->> 'id' = p_contract ->> 'id') THEN
      v_matrix := jsonb_set(v_matrix, '{contracts}',
        jsonb_build_array(p_contract || jsonb_build_object('status', 'sent')) || v_contracts);
    END IF;
  END IF;

  UPDATE public.agency_clients
  SET optimization_matrix = v_matrix || jsonb_build_object('updatedAt', now()), updated_at = now()
  WHERE id = '__isapromo_system_vault__';
  RETURN TRUE;
END;
$$;

-- Firmar contrato: solo campos de firma, limpios; la firma debe ser una imagen PNG
CREATE OR REPLACE FUNCTION public.public_sign_contract(p_id TEXT, p_signed JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_matrix JSONB;
  v_list JSONB;
  v_idx INT;
  v_current JSONB;
  v_signature TEXT := coalesce(p_signed ->> 'signatureData', '');
BEGIN
  IF v_signature <> '' AND v_signature !~ '^data:image/png;base64,[A-Za-z0-9+/=]+$' THEN
    RETURN FALSE;
  END IF;

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
    'signedAt', public.isapromo_clean_text(p_signed ->> 'signedAt', 80),
    'signedBy', public.isapromo_clean_text(p_signed ->> 'signedBy', 120),
    'signerDocId', public.isapromo_clean_text(p_signed ->> 'signerDocId', 40),
    'signatureData', left(v_signature, 300000),
    'signatureHash', public.isapromo_clean_text(p_signed ->> 'signatureHash', 120),
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

-- Formulario de diagnóstico: textos limpios; la web solo se guarda si parece un dominio
CREATE OR REPLACE FUNCTION public.public_submit_lead(p_name TEXT, p_whatsapp TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_name TEXT := trim(public.isapromo_clean_text(p_name, 120));
  v_phone TEXT := left(regexp_replace(coalesce(p_whatsapp, ''), '[^0-9+() -]', '', 'g'), 40);
BEGIN
  IF v_name = '' OR trim(v_phone) = '' THEN
    RAISE EXCEPTION 'name and whatsapp are required';
  END IF;
  INSERT INTO public.agency_clients (id, name, category, status, fee, phone, live_url, notes, optimization_matrix, updated_at)
  VALUES (
    'lead-' || replace(gen_random_uuid()::text, '-', ''),
    v_name,
    'Lead Diagnóstico Maps',
    'lead',
    'Prospecto Entrante',
    trim(v_phone),
    CASE WHEN v_name ~* '^(https?://)?[a-z0-9-]+(\.[a-z0-9-]+)+(/[a-z0-9._~/-]*)?$' THEN v_name ELSE '' END,
    'Solicitud de Diagnóstico Maps captada desde isapromord.com.',
    jsonb_build_object('tasks', jsonb_build_array(
      jsonb_build_object('id', 't1', 'title', 'Analizar posición en Google Maps y 3 competidores', 'done', false),
      jsonb_build_object('id', 't2', 'title', 'Enviar diagnóstico por WhatsApp', 'done', false))),
    now()
  );
END;
$$;

-- Límites para lo que los formularios públicos pueden insertar directamente
DROP POLICY IF EXISTS "Formularios registran prospectos" ON public.agency_leads;
CREATE POLICY "Formularios registran prospectos" ON public.agency_leads
  FOR INSERT TO anon, authenticated WITH CHECK (
    length(coalesce(client_id, '')) BETWEEN 1 AND 60
    AND length(coalesce(full_name, '')) <= 200
    AND length(coalesce(phone, '')) <= 40
    AND length(coalesce(email, '')) <= 200
    AND length(coalesce(farm_or_company, '')) <= 200
    AND length(coalesce(service_or_product, '')) <= 300
    AND length(coalesce(notes, '')) <= 2000
    AND length(coalesce(details::text, '')) <= 20000
  );

DROP POLICY IF EXISTS "Registrar clics" ON public.isapromo_referral_clicks;
CREATE POLICY "Registrar clics" ON public.isapromo_referral_clicks FOR INSERT WITH CHECK (
  client_slug ~ '^[a-z0-9-]{1,40}$'
  AND length(coalesce(referrer_url, '')) <= 300
  AND length(coalesce(utm_source, '')) <= 80
  AND length(coalesce(utm_medium, '')) <= 80
  AND length(coalesce(utm_campaign, '')) <= 80
  AND length(coalesce(user_agent, '')) <= 300
);

DROP POLICY IF EXISTS "Registrar conversiones" ON public.isapromo_referral_conversions;
CREATE POLICY "Registrar conversiones" ON public.isapromo_referral_conversions FOR INSERT WITH CHECK (
  client_slug ~ '^[a-z0-9-]{1,40}$'
  AND conversion_type IN ('whatsapp_click', 'form_submit')
  AND length(coalesce(contact_name, '')) <= 120
  AND length(coalesce(contact_phone, '')) <= 40
  AND length(coalesce(details, '')) <= 300
  AND coalesce(status, 'lead') = 'lead'
  AND coalesce(deal_value, 0) = 0
);

-- Socios de referidos que ya tienen la insignia puesta en sus sitios
INSERT INTO public.isapromo_referrals (client_slug, client_name, website_url) VALUES
  ('pasionpecuariard', 'Pasión Pecuaria RD', 'https://pasion-pecuaria-rd.vercel.app'),
  ('alveare', 'Torre La Esperilla', 'https://torrelaesperilla.com'),
  ('isatranslogic', 'IsaTransLogic', 'https://isatranslogic.com'),
  ('lacapra', 'La Capra Cigars', 'https://lacapra.vercel.app'),
  ('kendysastre', 'Kendy Sastre Atelier', 'https://kendysastre-atelier.netlify.app'),
  ('wiseservicesrd', 'Wise Services RD', 'https://wiseservicesrd.com')
ON CONFLICT (client_slug) DO NOTHING;
UPDATE public.isapromo_referrals SET website_url = 'https://pasion-pecuaria-rd.vercel.app'
WHERE client_slug = 'pasionpecuaria';
