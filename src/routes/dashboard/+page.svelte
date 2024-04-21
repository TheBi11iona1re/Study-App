<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import { blur } from 'svelte/transition';

    onMount(() => {
        // Update widths based on viewport size
      
    });

    let transparentWidth = '100px'; // Default width
let opaqueWidth = '500px'; // Default width





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


.opaque-section {
    background: rgba(35, 35, 35, .8);
    position: fixed;
    top: 0;
    right: 0;
    width: calc(100% - 233px); /* Remaining width */
    height: 100vh; /* Full viewport height */
    backdrop-filter: blur(30px); /* Apply blur effect to the background behind the element */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow-y: scroll; /* Allows vertical scrolling */
    overflow-x: hidden; /* Prevents horizontal scrolling */
}



.sidebar-section {
    
    width: 233px;
    height: 100vh; /* Full viewport height */
    position: fixed;
    top: 0;
    left: 0;
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}

.titlebar-section {
    display: flex;
    backdrop-filter: blur(25px);
    background: rgba(47, 48, 48, 0.5); 
    z-index: 1;
    width: calc(100% - 233px); /* Remaining width */
    height: 50px;
    align-items: center;  
    padding: 0 10px; 
    position: fixed;
    top: 0;
  right: 0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.23);
}

.titlebar-divider {
    display: flex;
    position: fixed;
    z-index: 3;
    top: 50px;
    right: 0;
    height: .5px; /* Example height - adjust as needed */
    width: calc(100% - 233px); /* Remaining width */
    background-color: #444343; /* Gray color */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.23);
}

.divider {
    z-index: 3;
    position: fixed;
    top: 0;
    left: 233px; /* Remaining width */
    height: 100vh; /* Full viewport height */
    width: .5px; /* Width of the line */
    background-color: #444343; /* Gray color */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Bevel effect */
}




</style>

    
   
    <div class="titlebar-section" data-tauri-drag-region>
     
       
        <button on:click={() => goto('/')} class=" ml-2 arrow-button bg-transparent border-none cursor-pointer outline-none p-0 h-7 w-9 transition-all ease-in-out duration-0 hover:bg-customGray hover:rounded-lg text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(170,170,170)" class="w-[32px] h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            
        </button>
        <h1 class="text-white text-center flex-grow mr-[60px] ">Dashboard</h1>
       
    </div>
    
    <div class="titlebar-divider" data-tauri-drag-region></div>


<div  class="sidebar-section" data-tauri-drag-region>
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
    <div class="flex flex-col items-center h-screen">
      <div class="flex-grow"></div>
      <div class="mb-5">
        <h1 class="text-center text-2xl text-white mt-20">Main Content</h1>
      </div>
      <div class="flex justify-center items-center mb-10">
     

        <p1 class="text-white text-center ml-10 mr-10">

            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae posuere eros. Proin dictum ut quam quis ultricies. Integer et nunc ut quam porta lobortis vitae eget turpis. Praesent lacinia nunc metus, vel placerat neque varius at. Nam fringilla risus sed porttitor consequat. Sed rutrum vehicula sollicitudin. Pellentesque eget convallis erat. Ut volutpat elementum gravida. Aenean semper sit amet nulla sit amet iaculis. Vestibulum egestas feugiat enim, eget tempus lacus volutpat eu. Aenean bibendum dolor a commodo pretium. Sed venenatis eleifend ligula et semper. Curabitur pharetra sed elit eget pulvinar. Maecenas et hendrerit felis, in auctor ipsum. Proin laoreet enim at nunc facilisis, in eleifend lectus pretium. Fusce eget mauris a mi vulputate pharetra in vitae velit.
            
            Vestibulum sollicitudin blandit lobortis. Integer malesuada placerat porttitor. Ut ultrices, metus id auctor ultrices, orci enim bibendum justo, eu sollicitudin dolor sem nec lectus. Cras at tempor leo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam venenatis urna ut nisl fringilla facilisis. Donec felis eros, sodales ut tempus vel, sodales id sapien. Morbi varius volutpat commodo. Nam in auctor metus. Mauris libero neque, vehicula et lobortis vel, luctus ac sapien. Nam libero sem, finibus vel velit ac, faucibus imperdiet felis. Nullam quis ullamcorper lorem, sit amet feugiat velit. Praesent porta nisl ante. Aenean tempus massa ultricies sollicitudin condimentum. In laoreet imperdiet mi, id convallis velit dignissim nec. Fusce at purus rutrum, sollicitudin justo nec, ullamcorper enim.
            
            Vivamus vel odio ligula. Cras sagittis turpis nec nisl efficitur, ut sollicitudin libero congue. In hac habitasse platea dictumst. Sed id euismod lacus. Aliquam nulla sapien, cursus eu metus scelerisque, tincidunt varius tellus. Maecenas dolor dui, auctor id risus at, ultrices euismod libero. Praesent mi libero, pharetra et elit ac, sagittis elementum nibh. In at egestas lacus. Proin semper, urna sed facilisis vehicula, dui est tempor mi, eu ullamcorper erat nisi vel urna. Quisque interdum est vel tempus rhoncus. Vestibulum aliquam mi sit amet quam aliquam, ac placerat dolor dapibus. Fusce volutpat tempus justo, vitae ullamcorper nisi suscipit eu. Integer eget nunc ac leo pharetra tincidunt sit amet et diam. Nunc in lacinia augue. Mauris in justo vitae lacus consectetur vehicula sollicitudin nec lectus.
            
            Morbi ultrices maximus ipsum, et sodales velit facilisis ac. Integer tincidunt congue blandit. Quisque imperdiet quam et luctus ullamcorper. Fusce eleifend lacinia semper. Vivamus cursus risus sed enim cursus, molestie fringilla libero posuere. Ut id erat vitae tortor feugiat mattis. Donec viverra nisi vitae porttitor placerat. Vivamus luctus, nisi at hendrerit aliquet, tellus lectus tincidunt metus, vitae vestibulum nibh nibh non urna. Quisque quis metus placerat, feugiat ipsum vel, euismod arcu. Proin ultrices semper venenatis. Mauris ornare elit ut ligula rutrum consequat. Praesent commodo lacus sit amet massa luctus, ac sagittis ligula fermentum. Curabitur sollicitudin, neque non gravida bibendum, libero metus rhoncus magna, a condimentum sem ipsum pretium nisl. Duis euismod sagittis ante, ac tincidunt metus interdum quis. Pellentesque eu leo lorem.
            
            Aenean sed lacus sapien. Suspendisse varius ante ipsum, in efficitur nibh tempor sit amet. Duis odio augue, rutrum ac quam sit amet, ornare sollicitudin elit. Proin tincidunt lectus non pellentesque efficitur. Phasellus sit amet quam lacinia, aliquet odio at, pulvinar velit. Cras pharetra laoreet diam, vel euismod nibh pellentesque ut. Ut dictum, lorem eu sagittis porta, lectus quam bibendum nibh, vel cursus risus arcu non eros. </p1>
            
      </div>
      <button class="backdrop-blur-none hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75" on:click={() => goto('/')}>
        Back
      </button>
      <div class="flex-grow"></div>
    </div>
  </div>


<div class="divider"></div>
