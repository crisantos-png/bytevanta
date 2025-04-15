
-- Add public read access to admin_passwords table
CREATE POLICY "Public read access for admin passwords" 
  ON public.admin_passwords 
  FOR SELECT 
  USING (true);

-- Add this table to the types
COMMENT ON TABLE public.admin_passwords IS '@gen_types';
