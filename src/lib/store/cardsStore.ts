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

// Function to save or update a card in Supabase
export async function saveCardToSupabase(card) {
    // Check if there is an existing card of the same type for the user
    const { data: existingCards, error: selectError } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', card.user_id)
        .eq('type', card.type);

    if (selectError) {
        console.error('Error checking existing cards:', selectError);
        return;
    }

    if (existingCards.length > 0) {
        // Update the existing card
        const existingCard = existingCards[0];
        const { data, error } = await supabase
            .from('cards')
            .update(card)
            .eq('id', existingCard.id);

        if (error) {
            console.error('Error updating card:', error);
        } else {
            await loadUserCards(card.user_id);
        }
    } else {
        // Insert a new card
        const { id, ...cardWithoutId } = card;
        const { data, error } = await supabase
            .from('cards')
            .insert([cardWithoutId]);

        if (error) {
            console.error('Error saving card:', error);
        } else {
            await loadUserCards(card.user_id);
        }
    }
}

// Function to clear the local storage and store
export function clearCardsStore() {
    cardsStore.set([]);
    localStorage.removeItem('cards');
}
