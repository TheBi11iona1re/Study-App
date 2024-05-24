import { writable } from 'svelte/store';

// Load cards from localStorage
const storedCards = localStorage.getItem('cards');
const initialCards = storedCards ? JSON.parse(storedCards) : [];

export const cardsStore = writable(initialCards);

// Subscribe to the store and save to localStorage whenever it changes
cardsStore.subscribe(cards => {
    localStorage.setItem('cards', JSON.stringify(cards));
});
