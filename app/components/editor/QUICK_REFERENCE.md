# Quick Reference Guide - Editor Components

## Component Usage Examples

### 1. Full Editor (with Title/Subtitle)

```vue
<script setup lang="ts">
import Editor from '~/components/editor/index.vue'

const isSaving = ref(false)

function handleEditorMounted(editor) {
  console.log('Editor ready', editor)
}

async function handleEditorUpdated({ content, title, subtitle }) {
  isSaving.value = true
  try {
    // Save to API
    await $fetch('/api/experiences', {
      method: 'POST',
      body: { content, title, subtitle }
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Editor 
    :is-saving="isSaving"
    @editor-mounted="handleEditorMounted"
    @editor-updated="handleEditorUpdated"
  />
</template>
```

### 2. Read-Only View

```vue
<script setup lang="ts">
import EditorView from '~/components/editor/EditorView.vue'

const props = defineProps<{
  content: string
}>()
</script>

<template>
  <EditorView :initial-content="content" />
</template>
```

### 3. Project Editor

```vue
<script setup lang="ts">
import ProjectEditor from '~/components/editor/ProjectEditor.vue'

const projectDescription = ref('<p>Initial content</p>')

function handleUpdate(content: string) {
  projectDescription.value = content
}
</script>

<template>
  <ProjectEditor 
    :initial-content="projectDescription"
    @editor-updated="handleUpdate"
  />
</template>
```

## Available Commands

All commands follow the pattern: `editor.chain().focus().commandName().run()`

### Text Formatting
- `toggleBold()` - Toggle bold formatting
- `toggleItalic()` - Toggle italic formatting
- `toggleUnderline()` - Toggle underline
- `toggleStrike()` - Toggle strikethrough
- `toggleCode()` - Toggle inline code

### Headings
- `toggleHeading({ level: 1 })` - Toggle H1
- `toggleHeading({ level: 2 })` - Toggle H2
- `toggleHeading({ level: 3 })` - Toggle H3
- `setParagraph()` - Set as paragraph

### Lists
- `toggleBulletList()` - Toggle bullet list
- `toggleOrderedList()` - Toggle ordered list
- `toggleTaskList()` - Toggle task list (if enabled)

### Blocks
- `toggleBlockquote()` - Toggle blockquote
- `toggleCodeBlock()` - Toggle code block
- `setHorizontalRule()` - Insert horizontal rule

### History
- `undo()` - Undo last action
- `redo()` - Redo last action

## Checking Active State

Use `editor.isActive()` to check if a command is active:

```typescript
// Check if text is bold
editor.isActive('bold')

// Check if heading level 2 is active
editor.isActive('heading', { level: 2 })

// Check if in bullet list
editor.isActive('bulletList')
```

## Custom Extensions

The editor includes three custom extensions:

1. **Title** (`<h1 class="title">`) - Required first node
2. **Subtitle** (`<h2 class="subtitle">`) - Required second node
3. **CustomDocument** - Enforces title + subtitle + content structure

These are automatically included in the main `index.vue` editor component.

## Styling

All editor components use the `.ProseMirror` class for the editable area. You can customize styles in your global CSS or component-scoped styles:

```scss
.ProseMirror {
  &:focus {
    outline: none;
  }
  
  h1.title {
    font-size: 2em;
    font-weight: bold;
  }
  
  h2.subtitle {
    font-size: 1.5em;
    color: #666;
  }
}
```

## Common Patterns

### Get HTML Content
```typescript
const html = editor.value?.getHTML()
```

### Get JSON Content
```typescript
const json = editor.value?.getJSON()
```

### Set Content
```typescript
editor.value?.commands.setContent('<p>New content</p>')
```

### Check if Editor is Empty
```typescript
const isEmpty = editor.value?.isEmpty
```

### Destroy Editor
```typescript
onBeforeUnmount(() => {
  editor.value?.destroy()
})
```

## Troubleshooting

### Editor not showing
- Ensure you're using `<client-only>` wrapper if needed
- Check that the editor container has proper dimensions

### Commands not working
- Verify editor is not in read-only mode
- Check that the extension supporting the command is loaded

### Placeholder not showing
- Ensure Placeholder extension is configured
- Check that `showOnlyCurrent` setting is correct

### Code highlighting not working
- Verify lowlight is properly configured
- Check that languages are registered
- Ensure CodeBlockLowlight extension is included
