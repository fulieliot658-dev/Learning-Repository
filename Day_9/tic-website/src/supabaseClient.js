import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yzwnhjkaflweueegccjr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6d25oamthZmx3ZXVlZWdjY2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDQzNDEsImV4cCI6MjEwMzQyMDM0MX0.wLcWS9B_alRonud5Z9-Zsge6clduIOzFoZIf_90SHW4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);