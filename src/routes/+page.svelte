


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

body {
  overflow-y: hidden;
  overflow-x: hidden; 
}
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
        rgb(191, 97, 106), 
        rgb( 208, 135, 112), 
        rgb( 163, 190, 140), 
        rgb(136, 192, 208)
      );
     
      background-clip: text;
      color: transparent;
    }
    50% {
      
      background-image: none;
      color: white;
    }
  }


  .glow-border {
      position: relative;
    }




    .glow-border {
      position: relative;
      border-radius: 5px;
    }

    .glow-border:before {
      content: '';
      position: absolute;
      top: -5px;
      bottom: -5px;
      left: -5px;
      right: -5px;
      border: 5px solid rgba(255, 255, 255, 0.9);
      border-radius: 10px;
      filter: blur(10px);
      z-index: -1;
    }
  </style>


<div style="display: flex; justify-content: center; align-items: center;">
  <img src="https://asset.brandfetch.io/idXLgrPD24/idfMf2EB4z.svg?updated=1704985716168" alt="SVG Image" style="width: 17px; height: auto; margin-right: 3px;">
  <h1 class="text-white mt-1 font-thin text-sm drop-shadow-xl text-center">Flashify.ai</h1>
</div>

  <div class="flex flex-col items-center h-screen mr-2">
   


   
    <div class="flex-grow"></div>
  
   
    <div class="text-center text-6xl text-white mt-[4rem]"> 
      <span class="rainbow-effect" style="animation-delay: 0s;">Write,</span>
      <span class="rainbow-effect" style="animation-delay: 2s;">Generate,</span>
      <span class="rainbow-effect" style="animation-delay: 4s;">Review</span>
    </div>
  
    <div class="mt-2"></div>
    
    <div class="flex justify-center items-center mb-2">
      <button class="backdrop-blur-[0px] hover:backdrop-brightness-50 text-white font-regular py-2 px-4 rounded backdrop-brightness-75"  on:click={() => goto('/dashboard')}>
        Dashboard
      </button>
    </div>
  
    <div class="flex flex-wrap justify-center items-center space-x-4 p-4">
    
      <div class="backdrop-brightness-75 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg mb-4 ml-3.5 ">
   
        <div style="display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          <h2 class="text-white text-lg font-bold" style="margin-left: 6px;">AI Built Flashcards</h2>
        </div>
        
        <p class="text-white">Create and use flashcards powered by Artificial intelligence to enhance your fast learning experience.</p>
      </div>
    
     
      <div class="backdrop-brightness-75 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg ">
        <div style="display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
          </svg>
          
  <h2 class="text-white text-lg font-bold" style="margin-left: 6px;">Visualise, Filter & Sort Any Way You Want</h2>
</div>

      
        
        <p class="text-white">Customise your viewing options to better organise your content, making it easier to access and study.</p>
      </div>
    </div>
    
    <div class="flex-grow"></div>
  </div>
  
  
  


