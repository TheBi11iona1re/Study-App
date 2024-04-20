import { writable } from 'svelte/store';
import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function createAuthStore() {
    const { subscribe, set } = writable<Session | null>(null);

    return {
        subscribe,
        signIn: async (email: string, password: string) => {
            // Update based on new API documentation
            const { data: session, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) throw new Error(error.message);
            set(session);
            return session;
        },
        signOut: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw new Error(error.message);
            set(null);
        },
    };
}

export const auth = createAuthStore();
