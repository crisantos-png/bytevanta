
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create bucket if it doesn't exist
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if public bucket exists
    const { data: existingBuckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      throw getBucketsError;
    }
    
    const publicBucket = existingBuckets?.find(bucket => bucket.name === 'public');
    
    if (!publicBucket) {
      // Create public bucket
      const { data: newBucket, error: createBucketError } = await supabase.storage.createBucket('public', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createBucketError) {
        throw createBucketError;
      }
      
      console.log('Public bucket created successfully:', newBucket);
    } else {
      console.log('Public bucket already exists');
    }
    
    return new Response(
      JSON.stringify({ message: 'Storage bucket check completed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in storage bucket check:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
