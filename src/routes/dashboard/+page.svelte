<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import { username } from '$lib/store/authStore';
    import CardPage from '$lib/components/CardPage.svelte';
    import { cardsStore, saveCardToSupabase, deleteCardFromSupabase } from '$lib/store/cardsStore';
    import { get } from 'svelte/store';
    import { auth } from '$lib/store/authStore';
    let loadingBarClass = '';
    let isLoading = false;
    let showSearch = false;
    let showModal = false;
    let selectedCard = null;
    let cards = [];
    let nextCardId = 1;
    let home = false;
    let searchInput;
    let showSettings = false;
// Import necessary Svelte functions and components
    
    function toggleModal() {
        showModal = !showModal;
    }

  



    function toggleSettings() {
        showSettings = !showSettings;
    }

    function updateSidebarScroll() {
        const sidebar = document.querySelector('.sidebar-section');
        if (sidebar) {
            sidebar.style.overflowY = showModal ? 'hidden' : 'scroll';
        }
    }

    function toggleHome() {
        home = !home;
    }

    function toggleSearch() {
        showSearch = !showSearch;
    }
   

// Define reactive variables for UI state and data

// Function to toggle the display of the modal

// Function to toggle the display of the settings

// Function to update sidebar scroll behavior based on modal visibility

// Function to toggle the home state

// Function to toggle the search input display

    async function logout() {
    try {
        isLoading = true;
        loadingBarClass = '';
        await auth.signOut();
        goto('/');
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        loadingBarClass = 'finish';
        setTimeout(() => { isLoading = false; }, 300);
    }
}


// Async function to handle user logout

// Async function to add a new card and save it to Supabase

// Async function to delete a card and remove it from Supabase

// Subscribe to changes in the cardsStore and update the cards array

// Function to select a card for viewing/editing

// Function to update the content of a card

async function addCard(type) {
    try {
        isLoading = true;
        loadingBarClass = '';
        const user = get(auth).user;
        const existingCard = cards.find(card => card.type === type);
        
        if (existingCard) {
            alert("Max amount of particular card reached");
            isLoading = false;
            return;
        }

        const newCard = { type, id: nextCardId++, content: '', user_id: user.id };

        // Save the new card to Supabase
        await saveCardToSupabase(newCard);

        // Update the store with the new card
        cardsStore.update(cards => [...cards, newCard]);

    } catch (error) {
        console.error('Error adding card:', error);
    } finally {
        loadingBarClass = 'finish';
        setTimeout(() => { isLoading = false; showModal = false; }, 300); // Close the modal after adding a card
    }
}

// Lifecycle function to load user cards on component mount

// Ensure search input is focused when showSearch is true

// Subscribe to cardsStore changes and update the cards array

// Global styles for the component

async function deleteCard(cardId) {
    try {
        isLoading = true;
        loadingBarClass = '';
        cardsStore.update(cards => cards.filter(card => card.id !== cardId));
        await deleteCardFromSupabase(cardId);
        const user = get(auth).user;
        await loadUserCards(user.id);
    } catch (error) {
        console.error('Error deleting card:', error);
    } finally {
        loadingBarClass = 'finish';
        setTimeout(() => { isLoading = false; }, 300);
    }
}




    $: cardsStore.subscribe(value => {
        cards = value;
    });

    function selectCard(card) {
        selectedCard = card;
    }

    function updateCardContent(id, newContent) {
        cardsStore.update(cards =>
            cards.map(card => card.id === id ? { ...card, content: newContent } : card)
        );
    }

    onMount(() => {
        cards = get(cardsStore);

        if (cards.length > 0) {
            nextCardId = Math.max(...cards.map(card => card.id)) + 1;
        }
    });

    $: cardsStore.subscribe(value => {
        cards = value;

        if (showSearch) {
            searchInput.focus();
        }
    });

    $: if (showSearch) {
        searchInput?.focus();
    }

    $: cardsStore.subscribe(value => {
        cards = value;
    });

    
</script>

<style>
    :global(html), :global(body) {
        margin: 0;
        padding: 0;
        height: 100%;
        background: transparent; /* Ensures the background is transparent */
        overflow: hidden; /* Optional: prevents scrolling */
    }

    .opaque-section {
        z-index: 0;
        background: rgba(35, 35, 35, .8);
        position: fixed;
        top: 0;
        right: 0;
        width: calc(100% - 233px); /* Remaining width */
        height: 100vh; /* Full viewport height */
        backdrop-filter: blur(30px); /* Apply blur effect to the background behind the element */
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        overflow-y: scroll; /* Allows vertical scrolling */
        overflow-x: hidden; /* Prevents horizontal scrolling */
    }

    .sidebar-section {
        width: 233px;
        height: 100vh; /* Full viewport height */
        position: fixed;
        top: 0;
        left: 0;
        box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
        position: fixed;
    }
    .fixed {
        position: fixed;
    }

    .auto {
        overflow-y: auto;
    }

    .titlebar-section {
        display: flex;
        backdrop-filter: blur(25px);
        background: rgba(47, 48, 48, 0.5); 
        z-index: 10;
        width: calc(100% - 233px); /* Remaining width */
        height: 50px;
        align-items: center;  
        padding: 0 10px; 
        position: fixed;
        top: 0;
        right: 0;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.23);
    }

    .titlebar-divider {
        display: flex;
        position: fixed;
        z-index: 3;
        top: 50px;
        right: 0;
        height: .5px; /* Example height - adjust as needed */
        width: calc(100% - 233px); /* Remaining width */
        background-color: #444343; /* Gray color */
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.23);
    }

    .loading-bar {
    position: absolute;
    top: 48px;
    left: 0; /* Adjust this to the width of your sidebar */
    height: 2px;
    background-color: rgba(216, 222, 226, 0.9);
    width: 0%; /* Start with 0 width */
    animation: expandWidth 5s cubic-bezier(0.42, 0, 0.58, 1) forwards;
}

@keyframes expandWidth {
    to {
        width: 100%;
    }
}

.loading-bar.finish {
    top: 48px;
    width: 100%;
    transition: width 0.1s ease-out; /* Fast finish transition */
}




    .divider {
        z-index: 3;
        position: fixed;
        top: 0;
        left: 233px; /* Remaining width */
        height: 100vh; /* Full viewport height */
        width: .5px; /* Width of the line */
        background-color: #444343; /* Gray color */
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Bevel effect */
    }

    .modal-hidden {
        overflow-y: auto;
        /* Additional styles for the modal when hidden */
    }

    .zindex {
        z-index: 0;
    }

    .modal-bg {
        @apply bg-gray-900 fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm;
    }

    .modal-content {
        z-index: 51;
        @apply bg-gray-700 bg-opacity-60  p-6 text-gray-200 rounded-lg shadow-xl max-w-md w-full relative backdrop-blur-lg;
    }

    .search-content {
        z-index: 51;
        @apply bg-gray-700 bg-opacity-80 p-6 rounded-lg shadow-xl max-w-3xl w-full relative backdrop-blur-lg;
    }

    .input-container {
        z-index: 51;
        @apply flex items-center w-full;
    }

    .input-field {
        z-index: 51;
        @apply flex-grow py-2 px-4 border-none rounded bg-transparent text-gray-100 leading-tight focus:outline-none focus:border-gray-400;
    }

    .search-icon {
        z-index: 51;
        @apply w-5 h-5 bg-transparent border-none cursor-pointer outline-none p-1 h-[27px] w-[27px] ml-2;
    }

    .size-6 {
        width: 24px;
        height: 24px;
    }
</style>

<div class="dashboard">
    <!-- Additional dashboard content can go here -->
</div>

<div class="absolute top-0 h-20 w-full" data-tauri-drag-region></div>

<div class="titlebar-section" data-tauri-drag-region>
    {#if isLoading}
    

    <div class="loading-bar {loadingBarClass}"></div>
{/if}

    <button on:click={() => goto('/')} class=" ml-2 arrow-button bg-transparent border-none cursor-pointer outline-none p-0 h-7 w-9 transition-all ease-in-out duration-0 hover:bg-customGray hover:rounded-lg text-white focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(170,170,170)" class="w-[32px] h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
    </button>
    <h1 class="text-white text-center flex-grow mr-[60px]">Dashboard</h1>
</div>

<div class="titlebar-divider" data-tauri-drag-region></div>

<div in:fade={{ delay: 0, duration: 200 }} class="opaque-section">
    <div class="flex flex-col items-center h-screen">
        {#if selectedCard}
        <CardPage type={selectedCard.type} content={selectedCard.content} onSave={(newContent) => updateCardContent(selectedCard.id, newContent)} />

            <div class="flex-grow"></div>
          
            <div class="flex-grow"></div>
        {/if}
        {#if !selectedCard}
      <div in:fade={{ delay: 200, duration: 150 }}>
            <div class="mb-5">
                <h1 class="text-center text-2xl text-white mt-20">Welcome, {$username}!</h1>
            </div>
            <div class="flex justify-center items-center mb-10">
               
                <p class="text-white text-center ml-10 mr-10">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae posuere eros. Proin dictum ut quam quis ultricies. Integer et nunc ut quam porta lobortis vitae eget turpis. Praesent lacinia nunc metus, vel placerat neque varius at. Nam fringilla risus sed porttitor consequat. Sed rutrum vehicula sollicitudin. Pellentesque eget convallis erat. Ut volutpat elementum gravida. Aenean semper sit amet nulla sit amet iaculis. Vestibulum egestas feugiat enim, eget tempus lacus volutpat eu. Aenean bibendum dolor a commodo pretium. Sed venenatis eleifend ligula et semper. Curabitur pharetra sed elit eget pulvinar. Maecenas et hendrerit felis, in auctor ipsum. Proin laoreet enim at nunc facilisis, in eleifend lectus pretium. Fusce eget mauris a mi vulputate pharetra in vitae velit.
                    Vestibulum sollicitudin blandit lobortis. Integer malesuada placerat porttitor. Ut ultrices, metus id auctor ultrices, orci enim bibendum justo, eu sollicitudin dolor sem nec lectus. Cras at tempor leo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam venenatis urna ut nisl fringilla facilisis. Donec felis eros, sodales ut tempus vel, sodales id sapien. Morbi varius volutpat commodo. Nam in auctor metus. Mauris libero neque, vehicula et lobortis vel, luctus ac sapien. Nam libero sem, finibus vel velit ac, faucibus imperdiet felis. Nullam quis ullamcorper lorem, sit amet feugiat velit. Praesent porta nisl ante. Aenean tempus massa ultricies sollicitudin condimentum. In laoreet imperdiet mi, id convallis velit dignissim nec. Fusce at purus rutrum, sollicitudin justo nec, ullamcorper enim.
                    Vivamus vel odio ligula. Cras sagittis turpis nec nisl efficitur, ut sollicitudin libero congue. In hac habitasse platea dictumst. Sed id euismod lacus. Aliquam nulla sapien, cursus eu metus scelerisque, tincidunt varius tellus. Maecenas dolor dui, auctor id risus at, ultrices euismod libero. Praesent mi libero, pharetra et elit ac, sagittis elementum nibh. In at egestas lacus. Proin semper, urna sed facilisis vehicula, dui est tempor mi, eu ullamcorper erat nisi vel urna. Quisque interdum est vel tempus rhoncus. Vestibulum aliquam mi sit amet quam aliquam, ac placerat dolor dapibus. Fusce volutpat tempus justo, vitae ullamcorper nisi suscipit eu. Integer eget nunc ac leo pharetra tincidunt sit amet et diam. Nunc in lacinia augue. Mauris in justo vitae lacus consectetur vehicula sollicitudin nec lectus.
                    Morbi ultrices maximus ipsum, et sodales velit facilisis ac. Integer tincidunt congue blandit. Quisque imperdiet quam et luctus ullamcorper. Fusce eleifend lacinia semper. Vivamus cursus risus sed enim cursus, molestie fringilla libero posuere. Ut id erat vitae tortor feugiat mattis. Donec viverra nisi vitae porttitor placerat. Vivamus luctus, nisi at hendrerit aliquet, tellus lectus tincidunt metus, vitae vestibulum nibh nibh non urna. Quisque quis metus placerat, feugiat ipsum vel, euismod arcu. Proin ultrices semper venenatis. Mauris ornare elit ut ligula rutrum consequat. Praesent commodo lacus sit amet massa luctus, ac sagittis ligula fermentum. Curabitur sollicitudin, neque non gravida bibendum, libero metus rhoncus magna, a condimentum sem ipsum pretium nisl. Duis euismod sagittis ante, ac tincidunt metus interdum quis. Pellentesque eu leo lorem.
                    Aenean sed lacus sapien. Suspendisse varius ante ipsum, in efficitur nibh tempor sit amet. Duis odio augue, rutrum ac quam sit amet, ornare sollicitudin elit. Proin tincidunt lectus non pellentesque efficitur. Phasellus sit amet quam lacinia, aliquet odio at, pulvinar velit. Cras pharetra laoreet diam, vel euismod nibh pellentesque ut. Ut dictum, lorem eu sagittis porta, lectus quam bibendum nibh, vel cursus risus arcu non eros.
                </p>
            </div>

      
            <div class="flex justify-center items-center">
            <button class=" backdrop-blur-none hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75 mb-10 mt-[-20px]" on:click={() => goto('/')}>
                Back
            </button>
            </div>
        </div>   
        {/if}

  
    </div>
</div>

<template>
    <div>
        <h1>Welcome
            <h1>Welcome, {username}!</h1>
            <!-- Rest of your dashboard code -->
        </div>
    </template>
    
    <div class="sidebar-section" class:fixed={showModal || showSettings} class:auto={!showModal && !showSettings} data-tauri-drag-region>
        <!-- Content for the transparent section -->
        <div data-tauri-drag-region class="flex flex-col items-center mt-12">
            <div class="mb-5">
                <div style="display: flex; align-items: center;">
                    <div style="display: flex; align-items: center; padding: 4px 8px;" class="ml-0 bg-transparent border-none cursor-pointer outline-none transition-all ease-in-out duration-0 hover:backdrop-brightness-75 hover:rounded-lg text-white focus:outline-none">
                        <p on:click={() => { selectedCard = null; home = true; }} data-tauri-drag-region class="text-center mr-[0px] text-white">{$username}'s Flashify</p>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="white" class="w-5 h-5 mb-1 bg-transparent border-none cursor-pointer outline-none p-1 h-[27px] w-[30px] ml-[3px] transition-all ease-in-out duration-0 hover:bg-customGray2 hover:rounded-lg text-white focus:outline-none" on:click={toggleModal}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
    
                   
                        <!-- Modal -->
                        {#if showModal}
                            <div class="modal-bg" transition:fade={{ delay: 0, duration: 150 }} on:click={toggleModal}>
                                <div class="modal-content" on:click|stopPropagation>
                                    <h2 class="text-xl font-semibold mb-4">New Card</h2>
                                    
                                    <button class="px-5 py-1 bg-nord14 text-white rounded-xl font-thin hover:bg-nord14 text-sm" on:click={() => addCard('Todolist')}>Todolist</button>
                                    <button class="px-5 py-1 bg-nord8 text-white rounded-xl font-thin hover:bg-nord10 text-sm" on:click={() => addCard('Document')}>Document</button>
                                    <button class="px-5 py-1 bg-nord3 text-white rounded-xl font-thin hover:bg-nord2 text-sm" on:click={() => addCard('Flashcard Set')}>Flashcard Set</button>
                                    <button class="px-5 py-1 bg-nord15 text-white rounded-xl font-thin hover:bg-nord16 text-sm" on:click={() => addCard('Timer')}>Timer</button>
                                    <p class="mb-3 mt-3">Add a new Todolist, Document, Flashcard Set, or Timer</p>
                                    <button class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75" on:click={toggleModal}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
    
                
    
                <div style="display: flex; align-items: center;">
                    <div style="display: flex; align-items: center; padding: 4px 8px;" class="ml-[-1px] bg-transparent border-none cursor-pointer outline-none transition-all ease-in-out duration-0 hover:backdrop-brightness-75 hover:rounded-lg text-white focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="rgb(229 231 235)" class="w-5 h-5 mb-0 bg-transparent border-none cursor-pointer outline-none p-1 h-[27px] w-[27px] ml-[0px]">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                        <p on:click={toggleSettings} data-tauri-drag-region class="font-thin text-center mr-[0px] text-gray-200">Settings</p>
                    </div>
                </div>

                {#if showSettings}
                <div class="modal-bg" transition:fade={{ delay: 0, duration: 150 }} on:click={toggleSettings}>
                    <div class="modal-content" on:click|stopPropagation>
                        <h2 class="text-xl font-semibold mb-4">Settings</h2>
                        <ul>
                            {#each cards as card, index}
                                <li class="card-item flex justify-between items-center mt-2">
                                    <span>{card.type}</span>
                                    <button class="px-5 py-1 bg-nord11 text-white rounded-xl font-thin hover:bg-red-400 text-sm ml-4" on:click={() => deleteCard(card.id)}>Delete</button>
                                </li>
                            {/each}
                        </ul>
                     

                        <button class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75 mt-4" on:click={toggleSettings}>
                            Close
                        </button>

                        <button out:fade={{ delay: 0, duration: 200 }} class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75 mt-4" on:click={logout}>
                            Logout
                        </button>
                    </div>
                </div>
            {/if}
    
             

                <p data-tauri-drag-region class="text-center mt-5 text-sm font-thin text-gray-300 mb-5">{$username}'s Cards</p>
                {#each cards as card (card.id)}
                <div style="padding: 0px 8px;" class="text-center ml-0 font-thin text-gray-200 mt-1 flex items-center cursor-pointer {selectedCard === card ? 'backdrop-brightness-75 rounded-lg' : 'hover:backdrop-brightness-75 hover:rounded-lg'} focus:outline-none" on:click={() => selectCard(card)}>
                    {#if card.type === 'Todolist'}
                        <div style="display: flex; align-items: center; padding: 4px 0px;" class="ml-[-1px] bg-transparent border-none cursor-pointer outline-none transition-all ease-in-out duration-0  text-white {selectedCard === card ? 'rounded-lg' : 'hover:rounded-lg'} focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="rgb(229 231 235)" class="w-5 h-5 mb-0 bg-transparent border-none cursor-pointer outline-none p-1 h-[27px] w-[27px] ml-[0px]">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                    {/if}
                    {#if card.type === 'Document'}
                        <div style="display: flex; align-items: center; padding: 4px 0px;" class="ml-[-1px] bg-transparent border-none cursor-pointer outline-none transition-all ease-in-out duration-0  text-white {selectedCard === card ? 'rounded-lg' : 'hover:rounded-lg'} focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="rgb(229 231 235)" class="w-5 h-5 mb-0 bg-transparent border-none cursor-pointer outline-none p-1 h-[27px] w-[27px] ml-[0px]">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </div>
                    {/if}
                    {#if card.type === 'Flashcard Set'}
                        <div style="display: flex; align-items: center; padding: 4px 0px;" class="ml-[-1px] bg-transparent border-none cursor-pointer outline-none transition-all ease-in-out duration-0  text-white {selectedCard === card ? 'rounded-lg' : 'hover:rounded-lg'} focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="rgb(229 231 235)" class="w-5 h-5 mb-0 bg-transparent border-none cursor-pointer outline-none p-1 h-[27px] w-[27px] ml-[0px]">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg>
                        </div>
                    {/if}
                    {#if card.type === 'Timer'}
                    
                        <div style="display: flex; align-items: center; padding: 4px 0px;" class="ml-[-1px] bg-transparent border-none cursor-pointer outline-none transition-all ease-in-out duration-0  text-white {selectedCard === card ? 'rounded-lg' : 'hover:rounded-lg'} focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="rgb(229 231 235)" class="w-5 h-5 mb-0 bg-transparent border-none cursor-pointer outline-none p-1 h-[27px] w-[27px] ml-[0px]">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    {/if}
                  
                        {card.type} Card
                    
                </div>
            {/each}
        </div>

        <div class="flex justify-center items-center mb-10">
            <button class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75 zindex" on:click={() => goto('/')}>
                Home
            </button>
        </div>
        <div class="flex-grow"></div>
    </div>
</div>

<div class="divider"></div>
