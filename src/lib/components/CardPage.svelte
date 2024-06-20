<script lang="ts">
    import { cardsStore, saveCardToSupabase, loadUserCards } from '$lib/store/cardsStore';
    import { auth } from '$lib/store/authStore';
    import { get } from 'svelte/store';
    import { onMount, onDestroy } from 'svelte';
    import Tiptap from '$lib/components/RichTextEditor.svelte';
    import { supabase } from '$lib/supabaseClient';
    import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
    import Flashcard from './Flashcard.svelte';
    import aifront from './RichTextEditor.svelte'
     import aiback from './RichTextEditor.svelte'
// Import necessary modules and components
    export let type: string;
    export let content: string;
    export let onSave: (newContent: string) => void;

    let editableContent = content ? JSON.parse(content) : {
        todos: [],
        flashcards: [],
        document: '',
        timerSettings: { timer: 25 * 60, breakTime: 5 * 60, customMinutes: 25 }
    };

    let todos = [];
    let flashcards = [];
    let documentContent = '';
    let timerSettings = { timer: 25 * 60, breakTime: 5 * 60, customMinutes: 25 };
    let newFlashcardFront = '';
    let newFlashcardBack = '';

    $: ({ todos, flashcards, documentContent, timerSettings } = editableContent);

    onMount(async () => {
        const session = get(auth);
        if (session) {
            await loadUserContent(session.user.id);
        }

        const storedFlashcards = localStorage.getItem('flashcards');
  if (storedFlashcards) {
    flashcards = JSON.parse(storedFlashcards);
  }
        startAutoSave();
    });

    onDestroy(() => {
        stopAutoSave();
    });

    async function loadUserContent(userId) {
        const { data, error } = await supabase
            .from('cards')
            .select('content')
            .eq('user_id', userId)
            .eq('type', type)
            .single();

        if (error) {
            console.error('Error loading content from Supabase:', error);
            const storedContent = localStorage.getItem('user-content');
            if (storedContent) {
                editableContent = JSON.parse(storedContent);
            }
        } else {
            editableContent = JSON.parse(data.content);
            localStorage.setItem('user-content', data.content);
        }

        todos = editableContent.todos || [];
        flashcards = editableContent.flashcards || [];
        documentContent = editableContent.document || '';
        timerSettings = editableContent.timerSettings || { timer: 25 * 60, breakTime: 5 * 60, customMinutes: 25 };
    }

    // Export props

// Initialize editable content

// Initialize individual content elements

// Reactive assignment of individual content elements from editableContent

// Lifecycle function to load user content on mount and start auto-save

// Lifecycle function to stop auto-save on component destroy

// Function to load user content from Supabase or local storage

// Function to save all content to Supabase and local storage

// Function to save document content and then call saveContent

// Function to save todo list and then call saveContent

// Function to save flashcards to Supabase and local storage

// Function to save timer settings and then call saveContent

// Function to handle actions before the window unloads

// Auto-save functionality


    async function saveContent() {
        const session = get(auth);
        if (session) {
            editableContent = {
                todos,
                flashcards,
                document: documentContent,
                timerSettings
            };
            const content = JSON.stringify(editableContent);
            localStorage.setItem('user-content', content);
            await saveCardToSupabase({ user_id: session.user.id, type, content });
            onSave(content);
        }
    }

    async function saveDocumentContent(newContent) {
        documentContent = newContent;
        await saveContent();
    }

    async function saveTodos() {
        editableContent.todos = todos;
        await saveContent();
    }

    async function saveFlashcards() {
  const session = get(auth);
  if (session) {
    editableContent.flashcards = flashcards;
    const content = JSON.stringify(editableContent);
    localStorage.setItem('flashcards', JSON.stringify(flashcards)); // Save to local storage
    await saveCardToSupabase({ user_id: session.user.id, type, content });
    onSave(content);
  }
}

    async function saveTimerSettings() {
        editableContent.timerSettings = {
            timer,
            breakTime,
            customMinutes
        };
        await saveContent();
    }

    function handleBeforeUnload(event) {
        saveContent();
    }

    // Auto-save functionality
    // Function to start auto-save at regular intervals and add unload event listener

// Function to stop auto-save and remove unload event listener

// Todo list related functions

// Function to add a new todo item
    let autoSaveInterval;

    function startAutoSave() {
        autoSaveInterval = setInterval(saveContent, 30000); // Auto-save every 30 seconds
        window.addEventListener('beforeunload', handleBeforeUnload);
    }

    function stopAutoSave() {
        clearInterval(autoSaveInterval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }

    // Todo list related functions
    let newTodo = '';

    async function addTodo() {
        if (newTodo.trim()) {
            todos = [...todos, { text: newTodo, completed: false }];
            newTodo = '';
            await saveTodos();
        }
    }

    async function toggleTodoCompletion(index) {
        todos[index].completed = !todos[index].completed;
        await saveTodos();
    }

    async function deleteTodo(index) {
        todos = todos.filter((_, i) => i !== index);
        await saveTodos();
    }

    // Flashcard set related functions
    // Function to toggle the completion status of a todo item

// Function to delete a todo item

// Flashcard set related functions

// Function to shuffle an array (used for flashcards)

// Function to shuffle flashcards array

// Function to add a new flashcard

// Function to delete a flashcard

// Timer related functions

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function shuffleFlashcards() {
        
        flashcards = shuffleArray([...flashcards]);
    }

async function addFlashcard() {
    shuffleFlashcards() 
  if (newFlashcardFront.trim() && newFlashcardBack.trim()) {
    flashcards = [...flashcards, { front: newFlashcardFront, back: newFlashcardBack }];
    newFlashcardFront = '';
    newFlashcardBack = '';
    await saveFlashcards();
  }
}

async function deleteFlashcard(index) {
  flashcards = flashcards.filter((_, i) => i !== index);
  await saveFlashcards();
}



    // Timer related functions
    // Function to start the timer

// Function to stop the timer

// Function to reset the timer

// Function to set the timer to a specific duration

// Function to set the break time duration

// Function to format time in minutes and seconds

// Function to send a break notification if permission is granted

// Page content container with conditional rendering based on type (Todo list, Document, Flashcard Set, Timer)
    let timer = timerSettings.timer;
    let breakTime = timerSettings.breakTime;
    let customMinutes = timerSettings.customMinutes;
    let interval;
    let isRunning = false;
    let isBreak = false;

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            interval = setInterval(() => {
                if (timer > 0) {
                    timer -= 1;
                } else {
                    clearInterval(interval);
                    isRunning = false;
                    if (isBreak) {
                        resetTimer();
                        isBreak = false;
                    } else {
                        timer = breakTime;
                        isBreak = true;
                        startTimer();
                        sendBreakNotification();
                    }
                    saveTimerSettings(); // Save timer settings when the timer completes
                }
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(interval);
        isRunning = false;
        saveTimerSettings(); // Save timer settings when the timer stops
    }

    function resetTimer() {
        clearInterval(interval);
        timer = customMinutes * 60;
        isBreak = false;
        isRunning = false;
        saveTimerSettings(); // Save timer settings when the timer resets
    }

    function setTimer(minutes) {
        clearInterval(interval);
        timer = minutes * 60;
        isBreak = false;
        isRunning = false;
        saveTimerSettings(); // Save timer settings when the timer is set
    }

    function setBreak(minutes) {
        breakTime = minutes * 60;
        saveTimerSettings(); // Save timer settings when the break time is set
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    async function sendBreakNotification() {
        let permissionGranted = await isPermissionGranted();
        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
        }

        if (permissionGranted) {
            new Notification('Flashify Timer', {
                body: "It's time for a break!",
                requireInteraction: true // This keeps the notification on screen until the user interacts with it
            });
        }
    }
</script>

<style>
    .page-content {
        padding: 20px;
        border-radius: 8px;
    }

    .todo-item.completed {
        text-decoration: line-through;
        color: gray;
    }

    .flashcard {
        backdrop-filter: brightness(75%);
        border-radius: 8px;
        padding: 10px;
        margin-top: 10px;
        color: white;
    }

    .break-time {
        width: 100%;
        height: 100%;
        background-color: rgba(115, 157, 208, 0.5);
    }
</style>

<div class="page-content {isBreak ? 'break-time' : ''}">
    <h1>.</h1>

    {#if type === 'Todolist'}
        <div class="mt-10">
            <input 
                type="text" 
                bind:value={newTodo} 
                placeholder="Add a new todo..." 
                class="bg-transparent w-full text-2xl text-white border-b-2 border-white focus:outline-none"
                on:keydown={(e) => e.key === 'Enter' && addTodo()}
            />
            <button on:click={addTodo} class="mt-2 text-xl px-4 py-2 bg-nord10 text-white rounded">Add</button>
            <ul class="mt-4">
                {#each todos as todo, index}
                    <li class="flex justify-between items-center mt-2 text-white text-2xl">
                        <span class:todo-item={true} class:completed={todo.completed} on:click={() => {toggleTodoCompletion(index), saveContent()}}>
                            {todo.text} 
                        </span>
                        <button on:click={() => {deleteTodo(index), saveContent()}} class="ml-2 px-2 py-1 bg-nord14 text-white rounded">Done</button>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="flex justify-center"></div>
    {/if}

    {#if type === 'Document'}
        <div class="mt-5 mb-5">
            <Tiptap on:save={e => saveDocumentContent(e.detail)} />
        </div>
        <div class="flex justify-center"></div>
    {/if}

    {#if type === 'Flashcard Set'}
        <div class="mt-10">
            <input 
                type="text" 
                bind:value={newFlashcardFront} 
                placeholder="Front of new flashcard..." 
                class="bg-transparent w-full text-white border-b-2 border-white focus:outline-none"
                on:keydown={(e) => e.key === 'Enter' && addFlashcard()}
            />
            <input 
                type="text" 
                bind:value={newFlashcardBack} 
                placeholder="Back of new flashcard..." 
                class="bg-transparent w-full text-white border-b-2 border-white focus:outline-none mt-2"
                on:keydown={(e) => e.key === 'Enter' && addFlashcard()}
            />
            <button on:click={addFlashcard} class="mt-2 px-4 py-2 bg-nord10 text-white rounded">Add</button>
            <button on:click={shuffleFlashcards} class="mt-2 ml-2 px-4 py-2 bg-nord14 text-white rounded">Shuffle</button>
            <div class="mt-4 grid grid-cols-1 gap-4">
                {#each flashcards as flashcard, index (index)}
                    <Flashcard {flashcard} on:delete={() => deleteFlashcard(index)} />
                    <button on:click={() => {deleteFlashcard(index), saveContent()}} class="px-0 py-2 bg-nord11 text-white rounded">Delete Flashcard</button>
                {/each}
            </div>
        </div>
    {/if}

    {#if type === 'Timer'}
        <div class="mt-[33px]"></div>
        <div class="flex flex-col items-center h-full w-full p-7">
            <div class="p-6 rounded-lg text-white w-full max-w-5xl">
                <h1 class="text-5xl font-bold mb-6 text-center">Pomodoro Timer</h1>
                <div class="flex flex-col items-center mb-8">
                    <div class="text-7xl md:text-9xl font-bold mb-6">{formatTime(timer)}</div>
                    <div class="flex space-x-4 mb-6">
                        <button class="bg-nord11 hover:bg-red-400 text-white font-bold py-3 px-6 rounded" on:click={startTimer}>Start</button>
                        <button class="bg-nord13 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded" on:click={stopTimer}>Pause</button>
                        <button class="bg-nord9 hover:bg-blue-300 text-white font-bold py-3 px-6 rounded" on:click={resetTimer}>Reset</button>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-6">
                    <div>
                        <h2 class="text-2xl font-semibold mb-4 text-center ml-3">Quick Timers</h2>
                        <div class="flex justify-center space-x-3">
                            <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-5 rounded" on:click={() => setTimer(5)}>5m</button>
                            <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-5 rounded" on:click={() => setTimer(10)}>10m</button>
                            <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-5 rounded" on:click={() => setTimer(15)}>15m</button>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-2xl font-semibold mb-4 text-center">Custom Timer</h2>
                        <div class="flex justify-center items-center space-x-3">
                            <input type="number" min="1" class="w-16 p-3 rounded text-white text-center bg-transparent backdrop-brightness-50" placeholder="Minutes" bind:value={customMinutes} />
                            <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-5 rounded" on:click={() => setTimer(customMinutes)}>Set Timer</button>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-2xl font-semibold mb-4 text-center mr-3">Set Break Time</h2>
                        <div class="flex justify-center space-x-3">
                            <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-5 rounded" on:click={() => setBreak(5)}>5m</button>
                            <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-5 rounded" on:click={() => setBreak(10)}>10m</button>
                            <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-5 rounded" on:click={() => setBreak(15)}>15m</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
