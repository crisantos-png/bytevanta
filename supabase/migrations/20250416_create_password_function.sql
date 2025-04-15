
-- Create function to get current admin password
CREATE OR REPLACE FUNCTION public.get_current_admin_password()
RETURNS TABLE (
  password TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT password, expires_at 
  FROM public.admin_passwords 
  WHERE id = 1;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_current_admin_password() TO anon;
GRANT EXECUTE ON FUNCTION public.get_current_admin_password() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_admin_password() TO service_role;
