# Editor Components (Tiptap v3)

This folder contains the migrated editor components using Tiptap v3, which is compatible with Nuxt 4 and Vue 3.

## Migration from Legacy Editor

The components in this folder have been migrated from `app/components/legacy-editor` which used Tiptap v1 (`tiptap@^1.30.0` and `tiptap-extensions@^1.33.2`).

### Key Changes

1. **API Updates**:
   - Changed from `new Editor()` constructor to `useEditor()` composable
   - Commands now use chain API: `editor.chain().focus().commandName().run()`
   - Extensions use `.configure()` method instead of constructor instantiation

2. **Vue 3 Composition API**:
   - All components now use `<script setup lang="ts">`
   - Type-safe props using TypeScript
   - Proper lifecycle management with `onBeforeUnmount`

3. **Extension Changes**:
   - Custom extensions (Title, Subtitle, Document) migrated to new API
   - Code highlighting now uses `@tiptap/extension-code-block-lowlight` with `lowlight` library
   - StarterKit includes most common extensions by default

4. **Menu Components**:
   - `EditorMenuBar` and `EditorMenuBubble` from v1 removed
   - Bubble menu now uses `@tiptap/extension-bubble-menu` directly

## Components

### Main Editor
- **index.vue**: Full-featured editor with custom Title/Subtitle nodes, placeholder text, and code highlighting

### Menu Components
- **BasicMenu.vue**: Toolbar menu with list, blockquote, code block, horizontal rule, undo/redo
- **BubbleMenu.vue**: Floating bubble menu that appears on text selection
- **ProjectEditorMenu.vue**: Simplified menu for project editing

### Editor Views
- **EditorView.vue**: Read-only editor view for displaying content
- **ProjectEditor.vue**: Project-specific editor with simplified formatting options

### Custom Extensions
Located in `extensions/` folder:
- **Title.ts**: Custom h1 node with title class
- **Subtitle.ts**: Custom h2 node with subtitle class
- **CustomDocument.ts**: Document schema requiring title and subtitle nodes

## Usage

```vue
<script setup lang="ts">
import Editor from '~/components/editor/index.vue'

function handleEditorMounted(editor) {
  console.log('Editor mounted', editor)
}

function handleEditorUpdated({ content, title, subtitle }) {
  console.log('Content updated:', { content, title, subtitle })
}
</script>

<template>
  <Editor 
    :is-saving="false"
    @editor-mounted="handleEditorMounted"
    @editor-updated="handleEditorUpdated"
  />
</template>
```

## Dependencies

The following packages are required (already installed in package.json):
- `@tiptap/vue-3`: ^3.22.4
- `@tiptap/starter-kit`: ^3.22.4
- `@tiptap/extension-bubble-menu`: ^3.22.4
- `@tiptap/extension-placeholder`: ^3.22.4
- `@tiptap/extension-underline`: ^3.22.4
- `@tiptap/extension-code-block-lowlight`: ^3.22.4
- `@tiptap/extension-document`: ^3.22.4
- `@tiptap/core`: ^3.22.4
- `lowlight`: ^3.3.0
