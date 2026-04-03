DO $$
DECLARE
  admin_id uuid;
  gerente_id uuid;
  free_id uuid;
BEGIN
  -- Fix any auth users with NULL tokens that might cause GoTrue to crash (known issue mentioned in rules)
  UPDATE auth.users
  SET
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change = COALESCE(email_change, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, '')
  WHERE
    confirmation_token IS NULL OR recovery_token IS NULL
    OR email_change_token_new IS NULL OR email_change IS NULL
    OR email_change_token_current IS NULL
    OR phone_change IS NULL OR phone_change_token IS NULL
    OR reauthentication_token IS NULL;

  -- Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@tribo.com') THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_id, '00000000-0000-0000-0000-000000000000', 'admin@tribo.com',
      crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  -- Gerente
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gerente@tribo.com') THEN
    gerente_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      gerente_id, '00000000-0000-0000-0000-000000000000', 'gerente@tribo.com',
      crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Gerente"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  -- Freelancer
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'free@tribo.com') THEN
    free_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      free_id, '00000000-0000-0000-0000-000000000000', 'free@tribo.com',
      crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Freelancer"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  -- Current User Seed
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'r.trovo@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'r.trovo@gmail.com',
      crypt('Skip@Pass', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Owner"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  -- Insert required categories if they do not exist
  INSERT INTO public.product_categories (name)
  SELECT 'Bebidas'
  WHERE NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Bebidas');

  INSERT INTO public.product_categories (name)
  SELECT 'Balões'
  WHERE NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Balões');

  INSERT INTO public.product_categories (name)
  SELECT 'Velas da Idade'
  WHERE NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Velas da Idade');
END $$;
