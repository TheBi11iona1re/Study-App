


<head>
    <style>
      html,
      body {
        background: transparent;
      }
    </style>
  </head>

  <script>
    import { goto } from '$app/navigation';
  </script>

  <div class="flex flex-col items-center h-screen">
  
    <div class="flex-grow"></div>
  
   
    <div class="mb-5"> 
      <h1 class="text-center text-6xl text-white ">Next Generation Study Tool</h1>
    </div>
  
    
    <div class="flex justify-center items-center mb-10">
      <button class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75"  on:click={() => goto('/login')}>
        Dashboard
      </button>
    </div>
  
   
    <div class="flex-grow"></div>
  </div>
  
  
  


  