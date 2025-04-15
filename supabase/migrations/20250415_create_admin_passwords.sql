
-- Create table to store admin passwords
CREATE TABLE IF NOT EXISTS public.admin_passwords (
  id SERIAL PRIMARY KEY,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Insert initial password (will be overwritten by the function)
INSERT INTO public.admin_passwords (id, password, created_at, expires_at)
VALUES (1, 'initialpassword', now(), (now() + interval '7 days'))
ON CONFLICT (id) DO NOTHING;

-- Add policies for admin access
ALTER TABLE public.admin_passwords ENABLE ROW LEVEL SECURITY;

-- Anyone can read the password (needed for verification)
CREATE POLICY "Public read access for admin passwords" 
  ON public.admin_passwords 
  FOR SELECT 
  USING (true);

-- Only service role can update passwords
CREATE POLICY "Only service role can update admin passwords" 
  ON public.admin_passwords 
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service role can update admin passwords" 
  ON public.admin_passwords 
  FOR UPDATE 
  USING (auth.role() = 'service_role');
