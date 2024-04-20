<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import { blur } from 'svelte/transition';

    onMount(() => {
        // Update widths based on viewport size
        updateWidths();
        window.addEventListener('resize', updateWidths);
    });

    let transparentWidth = '100px'; // Default width
let opaqueWidth = '500px'; // Default width

function updateWidths() {
    const viewportWidth = window.innerWidth;

    if (viewportWidth >= 1100) {
        transparentWidth = '2%'; // One fiftieth of the window
        opaqueWidth = '98%'; // One fiftieth of the window
        console.log(1100);
    } else if (viewportWidth >= 1000) {
        transparentWidth = '5%'; // One twentieth of the window
        opaqueWidth = '95%'; // One twentieth of the window
        console.log(1000);
    } else if (viewportWidth >= 600) {
        transparentWidth = '10%'; // One tenth of the window
        opaqueWidth = '90%'; // One tenth of the window
        console.log(600);
    } else if (viewportWidth >= 500) {
        transparentWidth = '20%'; // One fifth of the window
        opaqueWidth = '80%'; // One fifth of the window
        console.log(500);
    } else if (viewportWidth >= 400) {
        transparentWidth = '33.33%'; // One third of the window
        opaqueWidth = '66.67%'; // One third of the window
        console.log(400);
    }

    // After updating the widths, you might want to apply them to your elements
    // For example:
    // document.getElementById('yourElementId').style.width = transparentWidth;
    // document.getElementById('anotherElementId').style.width = opaqueWidth;
}

// Call the function initially to set the widths based on the viewport size
updateWidths();

// Add an event listener to update widths when the window is resized
window.addEventListener('resize', updateWidths);

</script>

<div class="absolute top-0 h-20 w-full" data-tauri-drag-region></div>
<style>
    :global(html), :global(body) {
        margin: 0;
        padding: 0;
        height: 100%;
        background: transparent; /* Ensures the background is transparent */
        overflow: hidden; /* Optional: prevents scrolling */
    }
    
    .transparent-section {
        width: 33.33%; /* One third of the window */
        height: 100vh; /* Full viewport height */
        position: fixed;
        top: 0;
        left: 0;
        box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
    }

    .opaque-section {
        width: 66.67%; /* Two thirds of the window */
        height: 100vh; /* Full viewport height */
        background: rgba(40, 40, 40, .9); /* Semi-transparent background color */
        backdrop-filter: blur(30px); /* Apply blur effect to the background behind the element */
        position: fixed;
        top: 0;
        right: 0;
        box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

    }

    .divider {
    position: fixed;
    top: 0;
    left: 33.33%; /* Position at the end of the transparent section */
    height: 100vh; /* Full viewport height */
    width: .5px; /* Width of the line */
    background-color: #444343; /* Gray color */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Bevel effect */
}
</style>


<div  class="transparent-section" data-tauri-drag-region>
    <!-- Content for the transparent section -->
    <div data-tauri-drag-region class="flex flex-col items-center h-screen">
        <div class="flex-grow"></div>
        <div class="mb-5">
            <h1 data-tauri-drag-region class="text-center text-2xl text-white ">Sidebar</h1>
        </div>
        <div class="flex justify-center items-center mb-10">
            <button   class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75" on:click={() => goto('/')}>
                Home
            </button>
        </div>
        <div class="flex-grow"></div>
    </div>
</div>
<div in:fade={{ delay: 0, duration: 200 }} class="opaque-section">
    <!-- Content for the opaque section -->
    <div class="flex flex-col items-center h-screen">
        <div class="flex-grow"></div>
        <div class="mb-5">
            <h1 class="text-center text-2xl text-white ">Main Content</h1>
        </div>
        <div class="flex justify-center items-center mb-10">
            <button class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75" on:click={() => goto('/')}>
                Back
            </button>
        </div>
        <div class="flex-grow"></div>
    </div>
</div>

<div class="divider"></div>
