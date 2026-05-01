# Migration Summary: Legacy Editor to Tiptap v3

## Overview
This document summarizes the migration of editor components from Tiptap v1 to Tiptap v3 for Nuxt 4 compatibility.

## Files Migrated

### From `app/components/legacy-editor/` to `app/components/editor/`

| Legacy File | New File | Status |
|------------|----------|--------|
| `index.vue` | `index.vue` | ✅ Migrated |
| `BasicMenu.vue` | `BasicMenu.vue` | ✅ Migrated |
| `BubbleMenu.vue` | `BubbleMenu.vue` | ✅ Migrated |
| `EditorView.vue` | `EditorView.vue` | ✅ Migrated |
| `ProjectEditor.vue` | `ProjectEditor.vue` | ✅ Migrated |
| `ProjectEditorMenu.vue` | `ProjectEditorMenu.vue` | ✅ Migrated |
| `components/Title.js` | `extensions/Title.ts` | ✅ Migrated |
| `components/Subtitle.js` | `extensions/Subtitle.ts` | ✅ Migrated |
| `components/Doc.js` | `extensions/CustomDocument.ts` | ✅ Migrated |

## Key Technical Changes

### 1. API Migration

#### Tiptap v1 (Legacy)
```javascript
import { Editor } from "tiptap"
import { Heading, Bold } from "tiptap-extensions"

export default {
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Heading({ levels: [1, 2, 3] }),
        new Bold(),
      ]
    })
  },
  methods: {
    updateContent() {
      this.editor.commands.bold()
    }
  }
}
```

#### Tiptap v3 (New)
```typescript
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  extensions: [
    StarterKit,
  ]
})

function updateContent() {
  editor.value?.chain().focus().toggleBold().run()
}
```

### 2. Custom Extensions

#### Tiptap v1 (Legacy)
```javascript
import { Node } from 'tiptap'

export default class Title extends Node {
  get name() {
    return 'title'
  }
  
  get schema() {
    return {
      content: 'inline*',
      parseDOM: [{ tag: 'h1' }],
      toDOM: () => ['h1', {class: 'title'}, 0],
    }
  }
}
```

#### Tiptap v3 (New)
```typescript
import { Node } from '@tiptap/core'

export const Title = Node.create({
  name: 'title',
  group: 'block',
  content: 'inline*',
  
  parseHTML() {
    return [{ tag: 'h1' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['h1', { class: 'title', ...HTMLAttributes }, 0]
  },
})
```

### 3. Menu Components

#### Tiptap v1 (Legacy)
```vue
<template>
  <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
    <button @click="commands.bold">Bold</button>
  </editor-menu-bar>
</template>
```

#### Tiptap v3 (New)
```vue
<template>
  <div v-if="editor">
    <button 
      :class="{ 'is-active': editor.isActive('bold') }"
      @click="editor.chain().focus().toggleBold().run()"
    >
      Bold
    </button>
  </div>
</template>
```

### 4. Bubble Menu

#### Tiptap v1 (Legacy)
```vue
<template>
  <editor-menu-bubble :editor="editor" v-slot="{ commands, menu }">
    <div :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`">
      <!-- menu items -->
    </div>
  </editor-menu-bubble>
</template>
```

#### Tiptap v3 (New)
```vue
<script setup>
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
</script>

<template>
  <BubbleMenu v-if="editor" :editor="editor">
    <div class="menububble">
      <!-- menu items -->
    </div>
  </BubbleMenu>
</template>
```

### 5. Code Highlighting

#### Tiptap v1 (Legacy)
```javascript
import { CodeBlockHighlight } from "tiptap-extensions"
import javascript from "highlight.js/lib/languages/javascript"

new CodeBlockHighlight({
  languages: { javascript, css }
})
```

#### Tiptap v3 (New)
```typescript
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import { javascript, css } from 'lowlight'

const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('css', css)

CodeBlockLowlight.configure({ lowlight })
```

## Dependencies Comparison

### Tiptap v1 (Legacy)
```json
{
  "tiptap": "^1.30.0",
  "tiptap-extensions": "^1.33.2"
}
```

### Tiptap v3 (New - Already Installed)
```json
{
  "@tiptap/vue-3": "^3.22.4",
  "@tiptap/starter-kit": "^3.22.4",
  "@tiptap/extension-bubble-menu": "^3.22.4",
  "@tiptap/extension-placeholder": "^3.22.4",
  "@tiptap/extension-underline": "^3.22.4",
  "@tiptap/extension-code-block-lowlight": "^3.22.4",
  "@tiptap/extension-document": "^3.22.4",
  "@tiptap/core": "^3.22.4",
  "lowlight": "^3.3.0"
}
```

## Benefits of Migration

1. **Nuxt 4 Compatibility**: Uses Vue 3 Composition API and TypeScript
2. **Better Type Safety**: Full TypeScript support with proper type definitions
3. **Modern API**: Cleaner, more intuitive chain-based command API
4. **Smaller Bundle**: Tree-shakable modules reduce bundle size
5. **Active Maintenance**: Tiptap v3 is actively maintained with regular updates
6. **Better Performance**: Improved rendering and update mechanisms
7. **Enhanced Features**: Access to latest Tiptap features and extensions

## Breaking Changes to Note

1. **Component Names**: All components now use PascalCase with `Editor` prefix for auto-import
2. **Event Handling**: Changed from Vue 2 `$emit` to Vue 3 `defineEmits`
3. **Lifecycle Hooks**: Changed from `mounted`/`beforeDestroy` to `onMounted`/`onBeforeUnmount`
4. **Extension Configuration**: Use `.configure()` method instead of constructor parameters
5. **Command Execution**: Use chain API instead of direct command calls

## Testing Recommendations

1. Test all editor functionality in development environment
2. Verify custom Title/Subtitle nodes work correctly
3. Test code highlighting with JavaScript and CSS
4. Verify placeholder text appears correctly
5. Test save/update functionality
6. Check bubble menu positioning and behavior
7. Verify read-only mode in EditorView component

## Next Steps

1. Update any pages/components that import from `legacy-editor` to use the new `editor` components
2. Remove the `legacy-editor` folder once migration is verified
3. Update documentation to reference new component paths
4. Consider deprecating `editor-old` folder as well
