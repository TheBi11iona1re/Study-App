<script lang="ts">
    import { cardsStore, saveCardToSupabase } from '$lib/store/cardsStore';
    import { auth } from '$lib/store/authStore';
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';

    export let type: string;
    export let content: string;
    export let onSave: (newContent: string) => void;

    let editableContent = content ? JSON.parse(content) : {
        todos: [],
        flashcards: [],
        document: '',
        timerSettings: { timer: 25 * 60, breakTime: 5 * 60, customMinutes: 25 }
    };

    let todos = editableContent.todos || [];
    let flashcards = editableContent.flashcards || [];
    let documentContent = editableContent.document || '';
    let timerSettings = editableContent.timerSettings || { timer: 25 * 60, breakTime: 5 * 60, customMinutes: 25 };

    onMount(() => {
        if (type === 'Todolist') {
            todos = editableContent.todos || [];
        } else if (type === 'Flashcard Set') {
            flashcards = editableContent.flashcards || [];
        } else if (type === 'Document') {
            documentContent = editableContent.document || '';
        } else if (type === 'Timer') {
            timerSettings = editableContent.timerSettings || { timer: 25 * 60, breakTime: 5 * 60, customMinutes: 25 };
        }
    });

    async function saveContent() {
        const session = get(auth);
        if (session) {
            editableContent = {
                todos,
                flashcards,
                document: documentContent,
                timerSettings
            };
            await saveCardToSupabase({ user_id: session.user.id, type, content: JSON.stringify(editableContent) });
            onSave(JSON.stringify(editableContent));
        }
    }

    async function saveTodos() {
        editableContent.todos = todos;
        await saveContent();
    }

    async function saveFlashcards() {
        editableContent.flashcards = flashcards;
        await saveContent();
    }

    async function saveDocument() {
        editableContent.document = documentContent;
        await saveContent();
    }

    async function saveTimerSettings() {
        editableContent.timerSettings = timerSettings;
        await saveContent();
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
    let newFlashcard = '';

    async function addFlashcard() {
        if (newFlashcard.trim()) {
            flashcards = [...flashcards, { text: newFlashcard }];
            newFlashcard = '';
            await saveFlashcards();
        }
    }

    async function deleteFlashcard(index) {
        flashcards = flashcards.filter((_, i) => i !== index);
        await saveFlashcards();
    }

    // Timer related functions
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
                    }
                }
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(interval);
        isRunning = false;
    }

    function resetTimer() {
        clearInterval(interval);
        timer = customMinutes * 60;
        isBreak = false;
        isRunning = false;
    }

    function setTimer(minutes) {
        clearInterval(interval);
        timer = minutes * 60;
        isBreak = false;
        isRunning = false;
    }

    function setBreak(minutes) {
        breakTime = minutes * 60;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
        background-color: rgba(0, 128, 0, 0.6); /* Green with 60% opacity */
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
                        <span class:todo-item={true} class:completed={todo.completed} on:click={() => toggleTodoCompletion(index)}>
                            {todo.text}
                        </span>
                        <button on:click={() => deleteTodo(index)} class="ml-2 px-2 py-1 bg-nord14 text-white rounded">Done</button>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="flex justify-center">
            <button class="hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75 py-3 px-6 rounded" on:click={saveTodos}>Save</button>
        </div>
    {/if}

    {#if type === 'Document'}
        <div class="mt-10">
            <textarea bind:value={documentContent} class="bg-transparent w-full h-48 text-white"></textarea>
        </div>
        <div class="flex justify-center">
            <button class="hover:backdrop-brightness-50  font-regular py-2 px-4 rounded backdrop-brightness-75 text-white py-3 px-6 rounded" on:click={saveDocument}>Save</button>
        </div>
    {/if}

    {#if type === 'Flashcard Set'}
        <div class="mt-10">
            <input 
                type="text" 
                bind:value={newFlashcard} 
                placeholder="Add a new flashcard..." 
                class="bg-transparent w-full text-white border-b-2 border-white focus:outline-none"
                on:keydown={(e) => e.key === 'Enter' && addFlashcard()}
            />
            <button on:click={addFlashcard} class="mt-2 px-4 py-2 bg-nord10 text-white rounded">Add</button>
            <div class="mt-4">
                {#each flashcards as flashcard, index}
                    <div class="flashcard">
                        <div class="flex justify-between items-center">
                            <span>{flashcard.text}</span>
                            <button on:click={() => deleteFlashcard(index)} class="ml-2 px-2 py-1 bg-nord11 text-white rounded">Delete</button>
                        </div>
                    </div> 
                {/each}
            </div>

            <div class="flex justify-center">
                <button class="hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75 py-3 px-6 rounded" on:click={saveFlashcards}>Save</button>
            </div>
        </div>
    {/if}

    {#if type === 'Timer'}
        <div class="flex items-center justify-center h-full w-full p-6 mt-[-25px]">
            <div class="p-6 rounded-lg text-white w-full max-w-3xl">
                <h1 class="text-3xl font-bold mb-6 text-center">Pomodoro Timer</h1>
                <div class="flex flex-col items-center">
                    <div class="text-5xl md:text-7xl lg:text-9xl xl:text-[18rem] font-bold mb-6">{formatTime(timer)}</div>
                    <div class="flex space-x-4 mb-6">
                        <button class="bg-nord11 hover:bg-red-400 text-white font-bold py-3 px-6 rounded" on:click={startTimer}>Start</button>
                        <button class="bg-nord13 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded" on:click={stopTimer}>Pause</button>
                        <button class="bg-nord9 hover:bg-blue-300 text-white font-bold py-3 px-6 rounded" on:click={resetTimer}>Reset</button>
                    </div>
                </div>

                <h2 class="text-2xl font-semibold mb-4 text-center">Quick Timers</h2>
                <div class="flex justify-center space-x-4 mb-6">
                    <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setTimer(5)}>5 min</button>
                    <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setTimer(10)}>10 min</button>
                    <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setTimer(15)}>15 min</button>
                    <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setTimer(20)}>20 min</button>
                </div>

                <h2 class="text-2xl font-semibold mb-4 text-center">Custom Timer</h2>
                <div class="flex justify-center items-center space-x-4 mb-6 ">
                    <input type="number" min="1" class="w-24 p-3 rounded text-white text-center bg-transparent backdrop-brightness-50" placeholder="Minutes" bind:value={customMinutes} />
                    <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setTimer(customMinutes)}>Set Timer</button>
                </div>

                <h2 class="text-2xl font-semibold mb-4 text-center">Set Break Time</h2>
                <div class="flex justify-center space-x-4 mb-6">
                    <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setBreak(5)}>5 min</button>
                    <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setBreak(10)}>10 min</button>
                    <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setBreak(15)}>15 min</button>
                </div>

                <div class="flex justify-center">
                    <button class="hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75 text-white  py-3 px-6 rounded" on:click={saveTimerSettings}>Save</button>
                </div>
            </div>
        </div>
    {/if}
</div>
