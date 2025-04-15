
-- Add public read access to admin_passwords table
CREATE POLICY "Public read access for admin passwords" 
  ON public.admin_passwords 
  FOR SELECT 
  USING (true);
