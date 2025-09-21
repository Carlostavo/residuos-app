-- Create waste categories table
CREATE TABLE IF NOT EXISTS public.waste_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6B7280',
  icon TEXT DEFAULT 'trash',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.waste_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies - all authenticated users can read categories
CREATE POLICY "waste_categories_select_all" ON public.waste_categories 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can modify categories
CREATE POLICY "waste_categories_admin_all" ON public.waste_categories 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default waste categories
INSERT INTO public.waste_categories (name, description, color, icon) VALUES
  ('Orgánico', 'Residuos biodegradables como restos de comida', '#10B981', 'leaf'),
  ('Reciclable', 'Papel, cartón, plástico, vidrio, metal', '#3B82F6', 'recycle'),
  ('Peligroso', 'Baterías, químicos, medicamentos', '#EF4444', 'alert-triangle'),
  ('Electrónico', 'Dispositivos electrónicos y componentes', '#8B5CF6', 'smartphone'),
  ('General', 'Residuos no clasificados en otras categorías', '#6B7280', 'trash-2')
ON CONFLICT (name) DO NOTHING;
