DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Select a user ID to associate with the records if possible
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- Create Categories
  IF NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Bebidas') THEN
    INSERT INTO public.product_categories (name, user_id) VALUES ('Bebidas', v_user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Balões') THEN
    INSERT INTO public.product_categories (name, user_id) VALUES ('Balões', v_user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Velas da Idade') THEN
    INSERT INTO public.product_categories (name, user_id) VALUES ('Velas da Idade', v_user_id);
  END IF;

  -- Create Products (10 items total including services as per QA tests requirement)
  -- 1. Coca-Cola 2L (Bebidas)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Coca-Cola 2L') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Coca-Cola 2L', 'Bebidas', 'Produto', 50, 8.50, v_user_id);
  END IF;

  -- 2. Guaraná Antarctica 2L (Bebidas)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Guaraná Antarctica 2L') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Guaraná Antarctica 2L', 'Bebidas', 'Produto', 40, 7.90, v_user_id);
  END IF;

  -- 3. Suco de Laranja 1L (Bebidas)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Suco de Laranja 1L') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Suco de Laranja 1L', 'Bebidas', 'Produto', 30, 6.00, v_user_id);
  END IF;

  -- 4. Balão Azul (Pacote 50) (Balões)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Balão Azul (Pacote 50)') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Balão Azul (Pacote 50)', 'Balões', 'Produto', 10, 15.00, v_user_id);
  END IF;

  -- 5. Balão Vermelho (Pacote 50) (Balões)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Balão Vermelho (Pacote 50)') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Balão Vermelho (Pacote 50)', 'Balões', 'Produto', 10, 15.00, v_user_id);
  END IF;

  -- 6. Vela Número 1 (Velas da Idade)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Vela Número 1') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Vela Número 1', 'Velas da Idade', 'Produto', 15, 3.50, v_user_id);
  END IF;

  -- 7. Vela Número 2 (Velas da Idade)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Vela Número 2') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Vela Número 2', 'Velas da Idade', 'Produto', 15, 3.50, v_user_id);
  END IF;

  -- 8. Garçom Extra (Serviço)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Garçom Extra') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Garçom Extra', NULL, 'Serviço', 0, 150.00, v_user_id);
  END IF;

  -- 9. Recreador (Serviço)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Recreador') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Recreador', NULL, 'Serviço', 0, 200.00, v_user_id);
  END IF;

  -- 10. Recepcionista (Serviço)
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Recepcionista') THEN
    INSERT INTO public.products (name, category, type, current_stock, last_paid_value, user_id) 
    VALUES ('Recepcionista', NULL, 'Serviço', 0, 120.00, v_user_id);
  END IF;

END $$;
