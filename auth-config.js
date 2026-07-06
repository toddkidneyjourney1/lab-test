(function () {
    const SUPABASE_URL = window.LAB_SUPABASE_URL || 'https://izytzrxrgnahyvgwqhgd.supabase.co';
    const SUPABASE_ANON_KEY = window.LAB_SUPABASE_ANON_KEY || [
        btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, ''),
        'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eXR6cnhyZ25haHl2Z3dxaGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTkwNjMsImV4cCI6MjA5ODQ3NTA2M30',
        'sb_publishable_wo-PDCkLxkuGLsar5by1Sw_ShjHgZDC'
    ].join('.');
    const DEFAULT_REDIRECT_PATH = 'portal-landing.html';

    let supabaseClient;

    function normalizeRole(role) {
        return (role || '').toString().trim().toLowerCase();
    }

    function normalizePath(path) {
        if (!path) {
            return DEFAULT_REDIRECT_PATH;
        }

        try {
            const resolved = new URL(path, window.location.href);
            if (resolved.origin !== window.location.origin) {
                return DEFAULT_REDIRECT_PATH;
            }

            return `${resolved.pathname.replace(/^\//, '')}${resolved.search}${resolved.hash}` || DEFAULT_REDIRECT_PATH;
        } catch (error) {
            return DEFAULT_REDIRECT_PATH;
        }
    }

    function getRedirectPath(defaultPath = DEFAULT_REDIRECT_PATH) {
        const params = new URLSearchParams(window.location.search);
        return normalizePath(params.get('redirect_url') || defaultPath);
    }

    function getRedirectUrl(defaultPath = DEFAULT_REDIRECT_PATH) {
        return new URL(getRedirectPath(defaultPath), window.location.href).toString();
    }

    function buildSignInUrl(redirectPath = DEFAULT_REDIRECT_PATH, extras = {}) {
        const url = new URL('sign-in.html', window.location.href);
        url.searchParams.set('redirect_url', normalizePath(redirectPath));

        Object.entries(extras).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            }
        });

        return `${url.pathname.replace(/^\//, '')}${url.search}${url.hash}`;
    }

    function getSupabaseClient() {
        if (supabaseClient) {
            return supabaseClient;
        }

        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
            throw new Error('Supabase client library failed to load.');
        }

        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });

        return supabaseClient;
    }

    async function getSession() {
        const { data, error } = await getSupabaseClient().auth.getSession();
        if (error) {
            throw error;
        }

        return data.session || null;
    }

    async function getUser() {
        const session = await getSession();
        return session ? session.user : null;
    }

    async function getProfile(userId) {
        if (!userId) {
            return null;
        }

        const { data, error } = await getSupabaseClient()
            .from('profiles')
            .select('id, email, full_name, role')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data || null;
    }

    function getUserDisplayName(user, profile) {
        return profile?.full_name
            || user?.user_metadata?.full_name
            || user?.user_metadata?.name
            || user?.email
            || 'Portal User';
    }

    async function signOut() {
        const { error } = await getSupabaseClient().auth.signOut();
        if (error) {
            throw error;
        }
    }

    window.labAuth = {
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        normalizeRole,
        normalizePath,
        getRedirectPath,
        getRedirectUrl,
        buildSignInUrl,
        getSupabaseClient,
        getSession,
        getUser,
        getProfile,
        getUserDisplayName,
        signOut
    };
})();
