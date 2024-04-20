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



.ripple {
  background-position: center;
  transition: background 0.55s;
}
.ripple:hover {
  background: #444f57 radial-gradient(circle, transparent 1%, #697b87 1%) center/15000%;
}
.ripple:active {
  background-color: #444f57;
  background-size: 100%;
  transition: background 0s;
}

.visible {
    opacity: 1;  /* Fully visible */
    transition: opacity 0.2s ease-in-out;
}

.invisible {
    opacity: 0;  /* Fully transparent */
    transition: opacity 0.2s ease-in-out;
}

.message-container {
    height: 20px;  /* Fixed height to reserve space */
    display: flex;
    align-items: center;
    justify-content: center;
}

.message {
    margin: 0;  /* No margin to keep the layout tight */
    padding: 0;  /* No padding for consistency */
    text-align: center;  /* Center the text */
}

.text-red-500 {
    color: #e3342f; /* Example red color for errors */
}

.text-green-500 {
    color: #38c172; /* Example green color for success messages */
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
                setTimeout(() => {
                    goto('/dashboard');
                }, 500)
                
              
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
        <h2 class="text-lg text-center mb-2 text-white font-bold ">Login</h2>
     
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
        <div class="message-container flex items-center justify-center mt-1">
            <p class="{errorMessage ? 'visible' : 'invisible'} message text-red-500">{errorMessage}</p>
            <p class="{successMessage ? 'visible' : 'invisible'} message text-green-500">{successMessage}</p>
        </div>
        <button type="submit" class="ripple mt-2 py-2 bg-opacity-75 hover:bg-opacity-50 text-white font-normal px-4 rounded hover:backdrop-brightness-50 text-white font-regular rounded backdrop-brightness-75 ripple-button" >Log in</button>
        <button on:click={() => goto('/')} class="mt-2 py-2 bg-opacity-75 hover:bg-opacity-50 text-white font-normal px-4 rounded hover:backdrop-brightness-50 text-white font-regular rounded backdrop-brightness-75">Back</button>
    </form>
</div>








