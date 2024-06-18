<script lang="ts">
    import { cardsStore, saveCardToSupabase } from '/Users/aditya/Study-App/src/lib/store/cardsStore';
    import { auth } from '/Users/aditya/Study-App/src/lib/store/authStore';
    import { get } from 'svelte/store';

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

    // Timer related variables
    let timer = 0;
    let interval;
    let isRunning = false;

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            interval = setInterval(() => {
                timer += 1;
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(interval);
        isRunning = false;
    }

    function resetTimer() {
        clearInterval(interval);
        timer = 0;
        isRunning = false;
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
                type="text" 
                bind:value={newTodo} 
                placeholder="Add a new todo..." 
                class="bg-transparent w-full text-white border-b-2 border-white focus:outline-none"
                on:keydown={(e) => e.key === 'Enter' && addTodo()}
            />
            <button on:click={addTodo} class="mt-2 px-4 py-2 bg-nord10 text-white rounded">Add</button>
            <ul class="mt-4">
                {#each todos as todo, index}
                    <li class="flex justify-between items-center mt-2 text-white">
                        <span class:todo-item={true} class:completed={todo.completed} on:click={() => toggleTodoCompletion(index)}>
                            {todo.text}
                        </span>
                        <button on:click={() => deleteTodo(index)} class="ml-2 px-2 py-1 bg-nord14 text-white rounded">Done</button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}

    {#if type === 'Document'}
        <div class="mt-10">
            <textarea bind:value={editableContent} class="bg-transparent w-full h-48 text-white"></textarea>
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
            <button on:click={addFlashcard} class="mt-2 px-4 py-2 bg-bg-nord10 text-white rounded">Add</button>
            <div class="mt-4">
                {#each flashcards as flashcard, index}
                    <div class="flashcard">
                        <div class="flex justify-between items-center">
                            <span>{flashcard.text}</span>
                            <button on:click={() => deleteFlashcard(index)} class="ml-2 px-2 py-1 bg-bg-nord11 text-white rounded">Delete</button>
                        </div>
                    </div> 
                {/each}
            </div>
        </div>
    {/if}

    {#if type === 'Timer'}
        <div class="mt-10">
            <div>
                <p class="text-white">Time: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>
                <button on:click={startTimer} class="mt-2 px-4 py-2 bg-nord10 text-white rounded">Start</button>
                <button on:click={stopTimer} class="mt-2 px-4 py-2 bg-nord11 text-white rounded">Stop</button>
                <button on:click={resetTimer} class="mt-2 px-4 py-2 bg-nord-2 text-white rounded">Reset</button>
            </div>
        </div>
    {/if}

    <button on:click={saveContent} class="mt-4 px-4 py-2 backdrop-brightness-75 text-white rounded">Save</button>
</div>
