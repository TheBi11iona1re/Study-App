<script lang="ts">
  import "./styles.scss";
  import Typography from '@tiptap/extension-typography';
  import { Color } from '@tiptap/extension-color';
  import ListItem from '@tiptap/extension-list-item';
  import TextStyle from '@tiptap/extension-text-style';
  import StarterKit from "@tiptap/starter-kit";
  import { Editor } from "@tiptap/core";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { get } from 'svelte/store';
  import { auth } from '$lib/store/authStore';
  import { supabase } from '$lib/supabaseClient'; // Adjust the import path as needed

  let element: HTMLDivElement;
  let editor: Editor | undefined;
  const dispatch = createEventDispatcher();
  const LOCAL_STORAGE_KEY = 'tiptap-content';

  onMount(async () => {
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
          <p><span style="color: #898989">Write something, or press '/' for AI, to see the magic happen. 🎩✨</span></p>
        </span>

        
      `,
      onTransaction: () => {
        saveContent();
      },

      
    });
    editor.commands.focus('12');
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
      localStorage.removeItem(LOCAL_STORAGE_KEY);
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
<div class="flex flex-col items-center mt-5">

</div>
