-- Create client table for storing client information
CREATE TABLE IF NOT EXISTS public.client (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_context TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create system_prompts table for AI prompts
CREATE TABLE IF NOT EXISTS public.system_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sample_data table for demo/test data
CREATE TABLE IF NOT EXISTS public.sample_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  client_request TEXT NOT NULL,
  stakeholders TEXT,
  systems TEXT,
  processes_context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.client ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_data ENABLE ROW LEVEL SECURITY;

-- Public read access policies (anyone can read)
CREATE POLICY "Anyone can read clients"
  ON public.client FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read system prompts"
  ON public.system_prompts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read sample data"
  ON public.sample_data FOR SELECT
  USING (true);

-- Authenticated users can insert/update policies
CREATE POLICY "Authenticated users can insert clients"
  ON public.client FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON public.client FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_client_updated_at
  BEFORE UPDATE ON public.client
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_prompts_updated_at
  BEFORE UPDATE ON public.system_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sample_data_updated_at
  BEFORE UPDATE ON public.sample_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();