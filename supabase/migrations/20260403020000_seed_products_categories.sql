-- Seed file to populate categories, products and services for testing
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get an existing user, or NULL if none exists
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- Create categories if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.product_categories WHERE name = 'Bebidas') THEN
    INSERT INTO public.product_categories (name, user_id)
    VALUES 
      ('Bebidas', v_user_id),
      ('Velas', v_user_id),
      ('Balões', v_user_id),
      ('Descartáveis', v_user_id),
      ('Decoração', v_user_id);
  END IF;

  -- Create products and services if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Coca-Cola 2L') THEN
    INSERT INTO public.products (name, supplier, category, type, current_stock, user_id)
    VALUES
      ('Coca-Cola 2L', 'Ambev', 'Bebidas', 'Produto', 50, v_user_id),
      ('Guaraná Antarctica 2L', 'Ambev', 'Bebidas', 'Produto', 40, v_user_id),
      ('Vela Estrela', 'Velas Mágicas', 'Velas', 'Produto', 100, v_user_id),
      ('Balão Azul nº 9', 'São Roque', 'Balões', 'Produto', 500, v_user_id),
      ('Copo Descartável 200ml', 'Copobras', 'Descartáveis', 'Produto', 1000, v_user_id),
      ('Prato Sobremesa', 'Copobras', 'Descartáveis', 'Produto', 800, v_user_id),
      ('Painel Temático', 'DecoraFest', 'Decoração', 'Produto', 5, v_user_id),
      ('Animação Infantil', 'Equipe Alegria', NULL, 'Serviço', 0, v_user_id),
      ('Pintura Facial', 'Arte Fest', NULL, 'Serviço', 0, v_user_id),
      ('Escultura de Balões', 'Arte Fest', NULL, 'Serviço', 0, v_user_id);
  END IF;
END $$;
