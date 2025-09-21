-- Create collection routes table
CREATE TABLE IF NOT EXISTS public.collection_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  schedule_days TEXT[] DEFAULT '{}', -- Array of days: ['monday', 'wednesday', 'friday']
  schedule_time TIME,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.collection_routes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - all authenticated users can view routes
CREATE POLICY "collection_routes_select_all" ON public.collection_routes 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins and technicians can modify routes
CREATE POLICY "collection_routes_admin_tech_all" ON public.collection_routes 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'tecnico')
    )
  );
