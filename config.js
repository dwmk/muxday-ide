// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://nvrruppxxoaueigskngo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dF0iO4QvIsb-4FYUS38Ckg_E4XlTwaw';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Storage bucket name for avatars and banners
const STORAGE_BUCKET = 'user-uploads';

// App configuration
const APP_CONFIG = {
    siteName: 'MuxDay',
    siteUrl: window.location.origin,
    defaultAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=',
    defaultBanner: 'linear-gradient(135deg, #5865F2, #7289DA)'
};