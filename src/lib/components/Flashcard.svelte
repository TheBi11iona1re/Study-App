<script lang="ts">
    export let flashcard: any;
    export let onDelete: () => void;
    let flipped = false;

    function toggleFlip() {
        flipped = !flipped;
    }
</script>

<div class="relative w-full max-w-sm mx-auto my-4 cursor-pointer perspective-1000" on:click={toggleFlip}>
    <div class="w-full h-64 transition-transform duration-700 transform-style-3d" class:flipped={flipped}>
        <div class="absolute inset-0 bg-nord10 text-white flex items-center justify-center p-4 rounded-lg backface-hidden front-card">
            {flashcard.front}
        </div>
        <div class="absolute inset-0 bg-nord12 text-white flex items-center justify-center p-4 rounded-lg backface-hidden back-card">
            {flashcard.back}
        </div>
    </div>
</div>
<div class="flex justify-center mt-2">
  
</div>

<style>
    .perspective-1000 {
        perspective: 1000px;
    }

    .transform-style-3d {
        transform-style: preserve-3d;
    }

    .transition-transform {
        transition: transform 0.7s ease-in-out;
    }

    .backface-hidden {
        backface-visibility: hidden;
    }

    .front-card, .back-card {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
    }

    .front-card {
        transform: rotateY(0deg);
    }

    .back-card {
        transform: rotateY(180deg);
    }

    .flipped {
        transform: rotateY(180deg);
    }
</style>