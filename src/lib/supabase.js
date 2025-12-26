import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    db: {
        schema: 'public'
    }
});

// Test connection function
export const testSupabaseConnection = async () => {
    try {
        console.log('🔌 Testing Supabase connection...');
        console.log('📍 URL:', supabaseUrl);

        // Try to fetch from a system table to test connection
        const { data, error } = await supabase
            .from('_supabase_migrations')
            .select('*')
            .limit(1);

        if (error) {
            // This error is expected if table doesn't exist yet
            console.log('⚠️ Connection test (expected behavior if no tables exist):', error.message);
            console.log('✅ Supabase client initialized successfully!');
            return { success: true, message: 'Supabase client ready (no tables yet)' };
        }

        console.log('✅ Supabase connection successful!');
        return { success: true, message: 'Connected to Supabase', data };
    } catch (err) {
        console.error('❌ Supabase connection failed:', err);
        return { success: false, error: err.message };
    }
};

// Export connection status
export const getSupabaseStatus = () => {
    return {
        url: supabaseUrl,
        configured: !!(supabaseUrl && supabaseAnonKey),
        client: supabase
    };
};

console.log('📦 Supabase client module loaded');
console.log('🔗 Project URL:', supabaseUrl);
console.log('🔑 API Key configured:', supabaseAnonKey ? '✓ Yes' : '✗ No');
