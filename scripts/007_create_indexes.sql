-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waste_records_user_id ON public.waste_records(user_id);
CREATE INDEX IF NOT EXISTS idx_waste_records_category_id ON public.waste_records(category_id);
CREATE INDEX IF NOT EXISTS idx_waste_records_status ON public.waste_records(status);
CREATE INDEX IF NOT EXISTS idx_waste_records_created_at ON public.waste_records(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_collection_routes_assigned_to ON public.collection_routes(assigned_to);
CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON public.reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_reports_type ON public.reports(type);
