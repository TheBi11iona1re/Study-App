<script lang="ts">
    import { cardsStore, saveCardToSupabase } from '$lib/store/cardsStore';
    import { auth } from '$lib/store/authStore';
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    export let type: string;
    export let content: string;
    export let onSave: (newContent: string) => void;

    let editableContent = content;

    function saveContent() {
        onSave(editableContent);
        const session = get(auth);
        if (session) {
            saveCardToSupabase({ user_id: session.user.id, type, content: editableContent });
        }
    }

    onMount(() => {

        saveContent() 
    });

    // Timer related variables

    


    let timer = 25 * 60; // 25 minutes in seconds
    let interval;
    let isRunning = false;
    let isBreak = false;
    let breakTime = 5 * 60; // Default 5 minutes break
    let customMinutes = 25; // Default work time

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
                        document.body.classList.remove('break-time');
                    } else {
                        timer = breakTime;
                        isBreak = true;
                        document.body.classList.add('break-time');
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
        document.body.classList.remove('break-time');
    }

    function setTimer(minutes) {
        clearInterval(interval);
        timer = minutes * 60;
        isBreak = false;
        isRunning = false;
        document.body.classList.remove('break-time');
    }

    function setBreak(minutes) {
        breakTime = minutes * 60;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Todo list related variables and functions
    let todos = [];
    let newTodo = '';

    function addTodo() {
        if (newTodo.trim()) {
            todos = [...todos, { text: newTodo, completed: false }];
            newTodo = '';
        }
    }

    function toggleTodoCompletion(index) {
        todos[index].completed = !todos[index].completed;
    }

    function deleteTodo(index) {
        todos = todos.filter((_, i) => i !== index);
    }

    // Flashcard set related variables and functions
    let flashcards = [];
    let newFlashcard = '';

    function addFlashcard() {
        if (newFlashcard.trim()) {
            
            flashcards = [...flashcards, { text: newFlashcard }];
            newFlashcard = '';
        }
    }

    function deleteFlashcard(index) {
        flashcards = flashcards.filter((_, i) => i !== index);
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
</style>

<div class="page-content">
    <h1>{type} Page</h1>

    {#if type === 'Todolist'}
        <div class="mt-10">
            <input 
                type="text " 
                bind:value={newTodo} 
                placeholder="Add a new todo..." 
                class="bg-transparent w-full text-2xl text-white border-b-2 border-white focus:outline-none"
                on:keydown={(e) => e.key === 'Enter' && addTodo()}
            />
            <button on:click={addTodo} class="mt-2 text-2xl px-4 py-2 bg-nord10 text-white rounded">Add</button>
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
            <button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded" on:click={saveContent}>Save</button>
        </div>
    {/if}

    {#if type === 'Document'}
        <div class="mt-10">
            <textarea bind:value={editableContent} class="bg-transparent w-full h-48 text-white"></textarea>
        </div>
        <div class="flex justify-center">
            <button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded" on:click={saveContent}>Save</button>
        </div>
    {/if}

    {#if type === 'Flashcard Set'}
        <div  class="mt-10">
            <input 
                type="text" 
                bind:value={newFlashcard} 
                placeholder="Add a new flashcard..." 
                class="bg-transparent w-full text-white border-b-2 border-white focus:outline-none"
                on:keydown={(e) => e.key === 'Enter' && addFlashcard()}
            />
            <button on:click={addFlashcard} class="mt-2 px-4 py-2 bg-bg-nord10 text-white rounded">Add</button>
            <div class="mt-4">
                {#each flashcards as flashcard, index}
                    <div  class="flashcard">
                        <div class="flex justify-between items-center">
                            <span>{flashcard.text}</span>
                            <button on:click={() => deleteFlashcard(index)} class="ml-2 px-2 py-1 bg-bg-nord11 text-white rounded">Delete</button>
                        </div>
                    </div> 
                {/each}
            </div>

            <div class="flex justify-center">
                <button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded" on:click={saveContent}>Save</button>
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
                    <button class="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded" on:click={stopTimer}>Pause</button>
                    <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded" on:click={resetTimer}>Reset</button>
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
            <div class="flex justify-center items-center space-x-4 mb-6">
                <input type="number" min="1" class="w-24 p-3 rounded bg-gray-700 text-white text-center" placeholder="Minutes" bind:value={customMinutes} />
                <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setTimer(customMinutes)}>Set Timer</button>
            </div>
            
            <h2 class="text-2xl font-semibold mb-4 text-center">Set Break Time</h2>
            <div class="flex justify-center space-x-4 mb-6">
                <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setBreak(5)}>5 min</button>
                <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setBreak(10)}>10 min</button>
                <button class="bg-nord14 hover:bg-green-400 text-white font-bold py-3 px-6 rounded" on:click={() => setBreak(15)}>15 min</button>
            </div>
            
            <div class="flex justify-center">
                <button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded" on:click={saveContent}>Save</button>
            </div>
        </div>
    </div>
    {/if}

    
    

   
</div>
