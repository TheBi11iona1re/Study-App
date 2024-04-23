<script>
  import "../app.css";
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { auth } from '$lib/store/authStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';  // Import the page store

  let userLoggedIn = writable(false);  // Using a Svelte store for better reactivity

  // Subscribe to auth store and update userLoggedIn based on presence of user object
  auth.subscribe(user => {
      userLoggedIn.set(!!user);
      console.log("Auth change detected: ", !!user);  // Debug: Log auth status changes
  });

  // Reactive statement that runs when userLoggedIn or page store changes
  $: $userLoggedIn, $page.url.pathname, (() => {
      console.log("Checking conditions: ", $userLoggedIn, $page.url.pathname);  // Debug: Log check conditions
      if (!$userLoggedIn && $page.url.pathname !== '/') {
          console.log("Redirecting to login...");  // Debug: Log redirection action
          goto('/login');
      }
  })();

  // Ensure redirection is handled on component mount as well
  onMount(() => {
      console.log("Component mounted. User logged in: ", $userLoggedIn);  // Debug: Log on mount
      if (!$userLoggedIn && $page.url.pathname !== '/') {
          goto('/login');
      }
  });
</script>


  


  <div class="absolute top-0 h-10 w-full" data-tauri-drag-region>


    
  </div>
  <slot />