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
            opacity: 1;
            transition: opacity 0.2s ease-in-out;
        }

        .invisible {
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        }

        .message-container {
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .message {
            margin: 0;
            padding: 0;
            text-align: center;
        }

        .text-red-500 {
            color: #e3342f;
        }

        .text-green-500 {
            color: #38c172;
        }
    </style>
</head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/store/authStore';
    import { goto } from '$app/navigation';
    import { username } from '$lib/store/authStore';
    let email: string = '';
    let password: string = '';
    let loginErrorMessage: string = '';
    let registrationErrorMessage: string = '';
    let successMessage: string = '';
    let registrationSuccessMessage: string = '';
    let welcomeMessage: string = 'Login to continue.';

    async function login(): Promise<void> {
        welcomeMessage = '';
        loginErrorMessage = '';
        registrationErrorMessage = '';
        successMessage = '';
        registrationSuccessMessage = '';

        function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


        try {
    const result = await auth.signIn(email, password);
    if (result.error) {
        loginErrorMessage = result.error.message;
        console.error('Login error:', result.error);
    } else {
        const user = result.user;
        const userEmail = user.email;
        const userName = capitalizeFirstLetter(userEmail.split('@')[0]); // Capitalize the first letter
        username.set(userName); // Set the username in the store
        successMessage = `Welcome ${userName}! You have successfully logged in!`;
        setTimeout(() => goto('/dashboard', { props: { username: userName } }), 500);
    }
}  catch (error) {
            loginErrorMessage = error.message;
            console.error('Login error:', error);
        }
    }

 

    async function register(): Promise<void> {
        welcomeMessage = '';
        loginErrorMessage = '';
        registrationErrorMessage = '';
        successMessage = '';
        registrationSuccessMessage = '';

        try {
            const result = await auth.signUp(email, password);
            if (result.error) {
                registrationErrorMessage = result.error.message;
                console.error('Registration error:', result.error);
            } else {
             
                registrationSuccessMessage = `Registered, Click Log In.`;
            }
        } catch (error) {
            registrationErrorMessage = error.message;
            console.error('Registration error:', error);
        }
    }
</script>

<div style="display: flex; justify-content: center; align-items: center;">
    <img src="https://asset.brandfetch.io/idXLgrPD24/idfMf2EB4z.svg?updated=1704985716168" alt="SVG Image" style="width: 17px; height: auto; margin-right: 3px;">
    <h1 class="text-white mt-1 font-thin text-sm drop-shadow-xl text-center">Flashify.ai</h1>
</div>

<button on:click={() => goto('/')} class="ml-1 mt-5 arrow-button bg-transparent border-none cursor-pointer outline-none p-0 h-7 w-9 transition-all ease-in-out duration-0 hover:bg-customGray hover:rounded-lg text-white focus:outline-none">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(170,170,170)" class="w-[32px] h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
</button>

<div class="flex flex-col items-center justify-center min-h-screen mt-[-45px]">
    <form on:submit|preventDefault={login} class="flex flex-col w-72 mx-auto p-5 shadow-2xl bg-opacity-87 rounded-lg backdrop-filter backdrop-brightness-90">
        <h2 class="text-lg text-center mb-2 text-white font-bold">Login / Register</h2>
        <div class="relative mt-4">
            <input type="email" bind:value={email} placeholder=" " required class="peer my-3 py-2 px-2 border rounded bg-transparent text-gray-300 leading-tight focus:outline-none focus:border-gray-400">
            <label for="email" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ease-in-out pointer-events-none">Email</label>
        </div>
        <div class="relative mt-1">
            <input type="password" bind:value={password} placeholder=" " required class="peer my-3 py-2 px-2 border rounded bg-transparent text-gray-300 leading-tight focus:outline-none focus:border-gray-400">
            <label for="password" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ease-in-out pointer-events-none">Password</label>
        </div>
        <div class="message-container flex items-center justify-center mt-2">
            <p class="{welcomeMessage ? 'visible' : 'invisible'} message text-white">{welcomeMessage}</p>
            <p class="{loginErrorMessage ? 'visible' : 'invisible'} message text-red-500">{loginErrorMessage}</p>
            <p class="{registrationErrorMessage ? 'visible' : 'invisible'} message text-red-500">{registrationErrorMessage}</p>
            <p class="{successMessage ? 'visible' : 'invisible'} message text-green-500">{successMessage}</p>
            <p class="{registrationSuccessMessage ? 'visible' : 'invisible'} message text-green-500">{registrationSuccessMessage}</p>
        </div>
        <button type="submit" class="ripple mt-4 py-2 bg-opacity-75 hover:bg-opacity-50 text-white font-normal px-4 rounded hover:backdrop-brightness-50 text-white font-regular rounded backdrop-brightness-75 ripple-button">Log in</button>
        <button type="button" on:click={register} class="ripple mt-2 py-2 bg-opacity-75 hover:bg-opacity-50 text-white font-normal px-4 rounded hover:backdrop-brightness-50 text-white font-regular rounded backdrop-brightness-75">Register</button>
    </form>
</div>
