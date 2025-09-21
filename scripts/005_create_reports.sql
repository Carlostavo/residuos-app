-- Create reports table for analytics
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('waste_summary', 'collection_efficiency', 'user_activity', 'environmental_impact')),
  data JSONB NOT NULL DEFAULT '{}',
  generated_by UUID NOT NULL REFERENCES auth.users(id),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can view their own reports
CREATE POLICY "reports_select_own" ON public.reports 
  FOR SELECT USING (auth.uid() = generated_by);

CREATE POLICY "reports_insert_own" ON public.reports 
  FOR INSERT WITH CHECK (auth.uid() = generated_by);

-- Admins can view all reports
CREATE POLICY "reports_admin_select_all" ON public.reports 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
