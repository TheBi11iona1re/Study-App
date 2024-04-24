


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

  <style>
     .rainbow-effect {
    display: inline-block;
    animation: cycleRainbow 6s infinite;
  }


  
  @keyframes cycleRainbow {
    0%, 100% {
      background-image: none;
      color: white;
    }
    25% {
      background-image: linear-gradient(-45deg, 
        rgb(255, 25, 25), 
        rgb(255, 140, 0), 
        rgb(50, 205, 50), 
        rgb(30, 144, 255)
      );
     
      background-clip: text;
      color: transparent;
    }
    50% {
      background-image: none;
      color: white;
    }
  }
  </style>
<div style="display: flex; justify-content: center; align-items: center;">
  <img src="https://asset.brandfetch.io/idXLgrPD24/idfMf2EB4z.svg?updated=1704985716168" alt="SVG Image" style="width: 17px; height: auto; margin-right: 3px;">
  <h1 class="text-white mt-1 font-thin text-sm drop-shadow-xl text-center">Flashify.ai</h1>
</div>

  <div class="flex flex-col items-center h-screen mr-2">
   


   
    <div class="flex-grow"></div>
  
   
    <div class="text-center text-6xl text-white mt-10"> 
      <span class="rainbow-effect" style="animation-delay: 0s;">Write,</span>
      <span class="rainbow-effect" style="animation-delay: 2s;">Generate,</span>
      <span class="rainbow-effect" style="animation-delay: 4s;">Review</span>
    </div>
  
    <div class="mt-2"></div>
    
    <div class="flex justify-center items-center mb-10">
      <button class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75"  on:click={() => goto('/dashboard')}>
        Dashboard
      </button>
    </div>
  
    <div class="flex flex-wrap justify-center items-center space-x-4 p-4">
    
      <div class="backdrop-brightness-75 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg mb-4 ml-3.5 ">

        
        <h2 class="text-white text-lg font-bold">AI Built Flashcards </h2>
        <p class="text-white">Create and use flashcards powered by Artificial intelligence to enhance your fast learning experience.</p>
      </div>
    
     
      <div class="backdrop-brightness-75 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg mb-[-60px]">
        <h2 class="text-white text-lg font-bold">Visualise, Filter & Sort Any Way You Want</h2>
        <p class="text-white">Customise your viewing options to better organise your content, making it easier to access and study.</p>
      </div>
    </div>
    
    <div class="flex-grow"></div>
  </div>
  
  
  


  