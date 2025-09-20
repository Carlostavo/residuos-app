-- Creating tables for page-specific content management
-- Table for storing page content by page
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing individual page elements
CREATE TABLE IF NOT EXISTS page_elements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  element_id TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  position JSONB DEFAULT '{"x": 0, "y": 0}',
  styles JSONB DEFAULT '{}',
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_slug, element_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_elements_slug ON page_elements(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_elements_element_id ON page_elements(element_id);

-- Enable RLS (Row Level Security)
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_elements ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all page content" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Users can insert page content" ON page_content
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update page content" ON page_content
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete page content" ON page_content
  FOR DELETE USING (true);

CREATE POLICY "Users can view all page elements" ON page_elements
  FOR SELECT USING (true);

CREATE POLICY "Users can insert page elements" ON page_elements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update page elements" ON page_elements
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete page elements" ON page_elements
  FOR DELETE USING (true);
