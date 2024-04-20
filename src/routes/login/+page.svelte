<head>
    <style>
      html,
      body {
        background: transparent;
      }

      input:not(:placeholder-shown) + label,
  input:focus + label {
    top: 0; 
    left: .3rem; 
    font-size: 0.875rem; 
    text-transform: ; 
    color: #f3f4f6; 
  }

    </style>
  </head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/store/authStore';
    import { goto } from '$app/navigation';

    let email: string = '';
    let password: string = '';
    let errorMessage: string = '';
    let successMessage: string = '';

    async function login(): Promise<void> {
       
        errorMessage = '';
        successMessage = '';

        try {
            const result = await auth.signIn(email, password);
            if (result.error) {
                errorMessage = result.error.message;
                console.error('Login error:', result.error);
            } else {
               
                successMessage = "You have successfully logged in!";
               
              
            }
        } catch (error) {
            // Catch and handle unexpected errors
            errorMessage = error.message;
            console.error('Login error:', error);
        }
    }



</script>


<div class="flex flex-col items-center justify-center min-h-screen">
    <form on:submit|preventDefault={login} class="flex flex-col w-72 mx-auto p-5 shadow-2xl bg-opacity-87 rounded-lg backdrop-filter backdrop-brightness-90">
        <h2 class="text-lg text-center mb-2 text-white font-bold">Login</h2>
        {#if errorMessage}
            <p class="text-red-500">{errorMessage}</p>
        {/if}
        {#if successMessage}
            <p class="text-green-500">{successMessage}</p>
        {/if}
        <!-- Email Input with Enhanced Floating Label -->
        <div class="relative mt-4">
            <input type="email" bind:value={email} placeholder=" " required
                class="peer my-2 py-2 px-2 border rounded bg-transparent text-gray-300 leading-tight focus:outline-none focus:border-gray-400">
            <label for="email" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ease-in-out pointer-events-none">
                Email
            </label>
        </div>
        <!-- Password Input with Enhanced Floating Label -->
        <div class="relative mt-2">
            <input type="password" bind:value={password} placeholder=" " required
                class="peer my-2 py-2 px-2 border rounded bg-transparent text-gray-300 leading-tight focus:outline-none focus:border-gray-400">
            <label for="password" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ease-in-out pointer-events-none">
                Password
            </label>
        </div>
        <button type="submit" class="mt-2 py-2 bg-opacity-75 hover:bg-opacity-50 text-white font-normal px-4 rounded hover:backdrop-brightness-50 text-white font-regular rounded backdrop-brightness-75 ripple-button">Log in</button>
        <button on:click={() => goto('/')} class="mt-2 py-2 bg-opacity-75 hover:bg-opacity-50 text-white font-normal px-4 rounded hover:backdrop-brightness-50 text-white font-regular rounded backdrop-brightness-75">Back</button>
    </form>
</div>





