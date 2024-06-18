// src/lib/store/cardsStore.js
import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';

// Load cards from localStorage as a fallback
const storedCards = localStorage.getItem('cards');
const initialCards = storedCards ? JSON.parse(storedCards) : [];

export const cardsStore = writable(initialCards);

// Subscribe to the store and save to localStorage whenever it changes
cardsStore.subscribe(cards => {
    localStorage.setItem('cards', JSON.stringify(cards));
});

// Function to load cards from Supabase
export async function loadUserCards(userId) {
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error loading cards:', error);
    } else {
        cardsStore.set(data);
    }
}

// Function to save a new card to Supabase
export async function saveCardToSupabase(card) {
    const { data, error } = await supabase
        .from('cards')
        .insert([card]);

    if (error) {
        console.error('Error saving card:', error);
    } else {
        const { user_id } = card;
        await loadUserCards(user_id);
    }
}

// Function to clear the local storage and store
export function clearCardsStore() {
    cardsStore.set([]);
    localStorage.removeItem('cards');
}
