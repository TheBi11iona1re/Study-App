// src/lib/store/authStore.js
import { writable } from 'svelte/store';
import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';
import { cardsStore, loadUserCards, clearCardsStore } from './cardsStore';

export const username = writable('');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function createAuthStore() {
    const { subscribe, set } = writable<Session | null>(null);

    return {
        subscribe,
        signIn: async (email: string, password: string) => {
            const { data: session, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) throw new Error(error.message);
            set(session);
            username.set(session.user.email.split('@')[0]);
            await loadUserCards(session.user.id);
            return session;
        },
        signUp: async (email: string, password: string) => {
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (error) throw new Error(error.message);
            return { user, error };
        },
        signOut: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw new Error(error.message);
            set(null);
            username.set('');
            clearCardsStore();
        },
    };
}

export const auth = createAuthStore();
