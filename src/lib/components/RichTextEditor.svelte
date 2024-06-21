<script lang="ts">
  import "./styles.scss";
  import Typography from '@tiptap/extension-typography';
  import { Color } from '@tiptap/extension-color';
  import ListItem from '@tiptap/extension-list-item';
  import TextStyle from '@tiptap/extension-text-style';
  import StarterKit from "@tiptap/starter-kit";
  import addFlashcard from '$lib/components/CardPage.svelte';
  import { Editor } from "@tiptap/core";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { get } from 'svelte/store';
  import { auth } from '$lib/store/authStore';
  import { supabase } from '$lib/supabaseClient'; // Adjust the import path as needed
  import { generateText } from 'ai';
  import { useChat } from '@ai-sdk/svelte';
  import { createOpenAI } from '@ai-sdk/openai';
  let isLoading = false;
  let error = false;
// Importing styles and necessary modules for Tiptap editor and AI integration

  import { StreamingTextResponse, streamText } from 'ai';
  // Initializing loading and error states

// Importing AI streaming text response utilities

// Declaring variables for DOM elements, editor instance, and content management

// Function to handle keydown events, focusing input box on '/' key press

// Define local storage key for editor content

// Variable to store AI-generated text

  let element: HTMLDivElement;
  let editor: Editor | undefined;
  let recipe = '';
  const dispatch = createEventDispatcher();
  let aifront = '';
  let aiback = '';
  let inputBox: HTMLInputElement | null = null;

  function handleKeydown(event) {
    if (event.key === '/') {
      event.preventDefault();
      if (inputBox) {
        inputBox.focus();
      }
    }
  }

// Variable to store flashcards

// Initialize OpenAI with API key

// Function to insert AI-generated text into the editor

// Lifecycle function to set up the editor on mount

// Function to load content from Supabase or local storage

  const LOCAL_STORAGE_KEY = 'tiptap-content';
  let aiText = ''; // To store the AI-generated text
  let flashcards = []; // Store the flashcards
  let newFlashcardFront = '';
  let newFlashcardBack = '';

  const openai = createOpenAI({
    apiKey: 'sk-proj-rdR4kvpeM31Kswgrwo9ET3BlbkFJ513qOnTAGHa0QtDBxhNF',
  });

  let paragraph;
  let prompt = '';

  function insertTextToEditor() {
    if (editor) {
      editor.commands.insertContent(aiText); // Insert AI-generated text into the editor
      saveContent(); // Save the updated content
    }
  }

  onMount(async () => {
    const session = get(auth);

    if (session) {
      // Clear local storage if a new session is detected
      const storedUserId = localStorage.getItem('current-user-id');
      if (storedUserId !== session.user.id) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.setItem('current-user-id', session.user.id);
      }
    }

    const content = await loadContent();
    editor = new Editor({
      element: element,
      extensions: [
        Typography.configure({ types: [Typography.name] }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
          bulletList: { HTMLAttributes: { class: 'bullet-list' } },
          orderedList: { HTMLAttributes: { class: 'ordered-list' } },
        }),
      ],
      content: content || `
        <span style="color: #f5f5f5">
          <span style="color: #898989">
            <h1>Untitled...</h1>
          </span>
          <p><span style="color: #898989">Write something, or press '/' and press enter for AI, to see the magic happen. 🎩✨</span></p>
        </span>
      `,
      onTransaction: () => {
        saveContent();
      },
    });

    document.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeydown);
    if (editor) {
      editor.destroy();
    }
  });

  async function loadContent() {
    const session = get(auth);
    if (session) {
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('content')
          .eq('user_id', session.user.id)
          .eq('type', 'Document')
          .single();

        if (error) {
          console.error('Error loading content from Supabase:', error);
          return localStorage.getItem(LOCAL_STORAGE_KEY); // Fallback to local storage
        }

        return data?.content ? JSON.parse(data.content).document : localStorage.getItem(LOCAL_STORAGE_KEY); // Use Supabase content or fallback
      } catch (error) {
        console.error('Error fetching content from Supabase:', error);
        return localStorage.getItem(LOCAL_STORAGE_KEY); // Fallback to local storage
      }
    } else {
      return localStorage.getItem(LOCAL_STORAGE_KEY); // Fallback to local storage if no session
    }
  }

  function saveContent() {
    if (editor) {
      const content = editor.getHTML();
      localStorage.setItem(LOCAL_STORAGE_KEY, content);
      dispatch('save', content);
      saveContentToSupabase(content); // Save to Supabase
    }
  }

  async function saveContentToSupabase(content: string) {
    const session = get(auth);
    if (session) {
      await supabase
        .from('cards')
        .upsert({ user_id: session.user.id, type: 'Document', content: JSON.stringify({ document: content }) }, { onConflict: ['user_id', 'type'] });
    }
  }

  async function generateText1(event) {
    event.preventDefault();
    paragraph.textContent = ''; // Clear the paragraph content before starting

    // Get the current content from the Tiptap editor
    const editorContent = editor ? editor.getHTML() : '';

    // Define the context
    const context = ' Context is in markdown format. Do not use special characters: ' + editorContent + ' Start of prompt: ';

    // Combine context with the main prompt
    const fullPrompt = `${context}\n\n${prompt}`;

    const { textStream } = await streamText({
      model: openai('gpt-4-turbo'),
      prompt: fullPrompt,
    });

    aiText = ''; // Reset aiText
    for await (const textPart of textStream) {
      console.log(textPart); // Log each part to the console
      paragraph.textContent += textPart; // Append each part to the paragraph
      aiText += textPart; // Store the text
    }
  }

  // Lifecycle function to clean up on component destroy

// Function to save editor content to local storage and Supabase

// Function to generate text using AI and update the editor

// Function to generate flashcards using AI

// Function to save flashcards to Supabase and local storage

// Function to delete a flashcard

  async function generateFlashcard(event) {
  event.preventDefault();
  isLoading = true; // Set loading state to true
  const editorContent = editor ? editor.getHTML() : '';

  const { textStream } = await streamText({
    model: openai('gpt-4-turbo'),
    prompt: `Create a new unique flashcard everytime with the following format:
    **Front of Flashcard:** Question goes here
    **Back of Flashcard:** Answer goes here
    Use the following content for context: ${editorContent}`,
  });

  let flashcardText = '';
  for await (const textPart of textStream) {
    flashcardText += textPart;
  }

  console.log("Generated Flashcard Text:", flashcardText);

  // Use a regular expression to extract the front and back content
  const frontMatch = flashcardText.match(/\*\*Front of Flashcard:\*\*([\s\S]*?)\*\*Back of Flashcard:\*\*/);
  const backMatch = flashcardText.match(/\*\*Back of Flashcard:\*\*([\s\S]*)/);

  const front = frontMatch ? frontMatch[1].trim() : undefined;
  const back = backMatch ? backMatch[1].trim() : undefined;

  console.log("Parsed Front:", front);
  console.log("Parsed Back:", back);

  if (front && back) {
    flashcards = [...flashcards, { front, back }];
    localStorage.setItem('flashcards', JSON.stringify(flashcards)); // Save to local storage
    console.log("Updated Flashcards Array:", flashcards);
    await saveFlashcards();
  } else {
    console.error("Failed to parse flashcard front and back correctly.");
    error = true;
    isLoading = false; // Set loading state to false
  }
  isLoading = false; // Set loading state to false
}








  async function saveFlashcards() {
    const session = get(auth);
    if (session) {
      const { data, error } = await supabase
        .from('cards')
        .select('content')
        .eq('user_id', session.user.id)
        .eq('type', 'Document')
        .single();

      let existingContent = {};
      if (data && !error) {
        existingContent = JSON.parse(data.content);
      }

      existingContent.flashcards = flashcards;

      const content = JSON.stringify(existingContent);
      localStorage.setItem('user-content', content); // Save to local storage

      console.log("Saving to Supabase:", content); // Log the content being saved

      const { upsertError } = await supabase
        .from('cards')
        .upsert({ user_id: session.user.id, type: 'Document', content }, { returning: 'minimal' }); // Save to Supabase with minimal return

      if (upsertError) {
        console.error('Error saving content to Supabase:', upsertError);
      } else {
        console.log("Content saved successfully to Supabase.");
      }
    } else {
      console.error("No session found, unable to save flashcards.");
    }
  }

  async function deleteFlashcard(index) {
    flashcards = flashcards.filter((_, i) => i !== index);
    await saveFlashcards();
  }

</script>


{#if editor}
  <div class="control-group">
    <div class="button-group">
      <button
        on:click={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        class={editor.isActive("bold") ? "is-active" : ""}
      >
        Bold
      </button>
      <button
        on:click={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        class={editor.isActive("italic") ? "is-active" : ""}
      >
        Italic
      </button>
      <button
        on:click={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        class={editor.isActive("strike") ? "is-active" : ""}
      >
        Strike
      </button>
      <button
        on:click={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        class={editor.isActive("code") ? "is-active" : ""}
      >
        Code
      </button>
      <button on:click={() => editor.chain().focus().unsetAllMarks().run()}>Clear Styles</button>
      <button on:click={() => editor.chain().focus().clearNodes().run()}>Clear Spaces</button>
      <button
        on:click={() => editor.chain().focus().setParagraph().run()}
        class={editor.isActive("paragraph") ? "is-active" : ""}
      >
        Paragraph
      </button>
      <button
        on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        class={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        H1
      </button>
      <button
        on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        class={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        H2
      </button>
      <button
        on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        class={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        H3
      </button>
      <button
        on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        class={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        H4
      </button>
      <button
        on:click={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        class={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        H5
      </button>
      <button
        on:click={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        class={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        H6
      </button>
      <button
        on:click={() => editor.chain().focus().toggleBulletList().run()}
        class={editor.isActive("bulletList") ? "is-active" : ""}
      >
        Bullet list
      </button>
      <button
        on:click={() => editor.chain().focus().toggleOrderedList().run()}
        class={editor.isActive("orderedList") ? "is-active" : ""}
      >
        Ordered list
      </button>
      <button
        on:click={() => editor.chain().focus().toggleCodeBlock().run()}
        class={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        Code block
      </button>
      <button
        on:click={() => editor.chain().focus().toggleBlockquote().run()}
        class={editor.isActive("blockquote") ? "is-active" : ""}
      >
        Blockquote
      </button>
      <button on:click={() => editor.chain().focus().setHorizontalRule().run()}>
        Horizontal rule
      </button>
      <button on:click={() => editor.chain().focus().setHardBreak().run()}>Hard break</button>
      <button
        on:click={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        Undo
      </button>
      <button
        on:click={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        Redo
      </button>

      <button
        on:click={() => editor.chain().focus().setColor('#FFFFFF').run()}
        class={editor.isActive('textStyle', { color: '#FFFFFF' }) ? 'is-active' : ''}
      >
        White
      </button>
    </div>
  </div>
{/if}

<div bind:this={element} />
<div class="flex flex-col items-center mt-5"></div>

<main>
  <ul></ul>
  <form on:submit={generateText1}>
    <input
      class="bg-transparent bg-opacity-100 text-nord-4 rounded py-2 px-3 ml-[-11px] focus:outline-none "
      type="text"
      bind:this={inputBox}
      bind:value={prompt}
      placeholder="Press '/' & enter to generate text. "
    />
  </form>
  <p class="text-nord-4" bind:this={paragraph}></p>
  <button on:click={insertTextToEditor} class="ml-[-1px] mt-4 bg-nord4 text-black py-2 px-4 rounded-lg">
    Insert AI Text to Editor
  </button>
  <button
    on:click={generateFlashcard}
    class="text-black bg-nord4 py-2 px-4 rounded-lg ml-2"
    disabled={isLoading}
  >
    {#if isLoading}
      Loading...
    {/if}
    {#if !isLoading}
      WIP Generate AI Flashcard
    {/if}
    {#if error}
    Error Parsing Flashcard
  {/if}

  </button>
</main>


