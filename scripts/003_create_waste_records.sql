-- Create waste records table
CREATE TABLE IF NOT EXISTS public.waste_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.waste_categories(id),
  weight DECIMAL(10,2) NOT NULL CHECK (weight > 0),
  location TEXT,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'collected', 'processed')),
  collected_by UUID REFERENCES auth.users(id),
  collected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.waste_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for waste records
CREATE POLICY "waste_records_select_own" ON public.waste_records 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "waste_records_insert_own" ON public.waste_records 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "waste_records_update_own" ON public.waste_records 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "waste_records_delete_own" ON public.waste_records 
  FOR DELETE USING (auth.uid() = user_id);

-- Technicians and admins can view and update all records
CREATE POLICY "waste_records_tech_admin_select_all" ON public.waste_records 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'tecnico')
    )
  );

CREATE POLICY "waste_records_tech_admin_update_all" ON public.waste_records 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'tecnico')
    )
  );
