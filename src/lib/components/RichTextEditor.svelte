<script>
    import { Editor } from '@tiptap/core';
    import StarterKit from '@tiptap/starter-kit';
    import Link from '@tiptap/extension-link';
    import Bold from '@tiptap/extension-bold';
    import Italic from '@tiptap/extension-italic';
    import Underline from '@tiptap/extension-underline';
    import Strike from '@tiptap/extension-strike';
    import CodeBlock from '@tiptap/extension-code-block';
    import Blockquote from '@tiptap/extension-blockquote';
    import ListItem from '@tiptap/extension-list-item';
    import BulletList from '@tiptap/extension-bullet-list';
    import OrderedList from '@tiptap/extension-ordered-list';
    import Heading from '@tiptap/extension-heading';
  
    export let value = '';
    export let onChange;
  
    let editor;
  
    function setupEditor() {
      editor = new Editor({
        content: value,
        extensions: [
          StarterKit,
          Link,
          Bold,
          Italic,
          Underline,
          Strike,
          CodeBlock,
          Blockquote,
          ListItem,
          BulletList,
          OrderedList,
          Heading
        ],
        onUpdate: ({ editor }) => {
          const html = editor.getHTML();
          onChange(html);
        }
      });
    }
  
    onMount(() => {
      setupEditor();
    });
  
    $: if (value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  </script>
  
  <style>
    .editor {
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 5px;
      min-height: 300px;
      background: white;
    }
  
    .editor:focus {
      outline: none;
    }
  </style>
  
  <div class="editor" bind:this={editor} contenteditable="true"></div>
  