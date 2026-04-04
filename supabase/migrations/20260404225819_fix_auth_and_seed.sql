DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Seed user: admin@tribo.com
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@tribo.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@tribo.com',
      crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin Teste"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;

  -- Seed user: r.trovo@gmail.com
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'r.trovo@gmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'r.trovo@gmail.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;

  -- Insert requested categories
  IF NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Bebidas') THEN
    INSERT INTO public.product_categories (id, name, created_at) VALUES (gen_random_uuid(), 'Bebidas', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Balões') THEN
    INSERT INTO public.product_categories (id, name, created_at) VALUES (gen_random_uuid(), 'Balões', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Velas da Idade') THEN
    INSERT INTO public.product_categories (id, name, created_at) VALUES (gen_random_uuid(), 'Velas da Idade', NOW());
  END IF;
END $$;
