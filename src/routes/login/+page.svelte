<script lang="ts">
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


<head>
    <style>
      html,
      body {
        background: transparent;
      }
    </style>
  </head>

  <div class="flex flex-col items-center justify-center h-screen">
    <form on:submit|preventDefault={login} class="flex flex-col w-72 mx-auto p-5 shadow-xl backdrop-brightness-[.9] rounded-lg">
        <h2 class="text-lg text-center mb-4 text-white font-bold">Login</h2>
        {#if errorMessage}
            <p class="text-red-500">{errorMessage}</p>
        {/if}
        {#if successMessage}
        <p class="text-green-500">{successMessage}</p>
        {/if}
        <input type="email" bind:value={email} placeholder="Email" required class="my-2 py-2 px-3 border rounded bg-transparent placeholder-gray-400 text-gray-100 leading-tight focus:outline-none focus:border-gray-500">
        <input type="password" bind:value={password} placeholder="Password" required class="my-2 py-2 px-3 border rounded bg-transparent placeholder-gray-400 text-gray-100 leading-tight focus:outline-none focus:border-gray-500">
        <button type="submit" class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75 mb-2">Log in</button>
        <button on:click={() => goto('/')} class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75">Back</button>
    </form>
</div>
