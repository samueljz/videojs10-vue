<template>
  <div class="code-block">
    <div class="code-block__header">
      <span class="code-block__lang">{{ lang }}</span>
      <button class="code-block__copy btn btn--ghost btn--sm" @click="copyCode" :class="{ 'code-block__copy--copied': copied }">
        <svg v-if="!copied" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <pre class="code-block__pre"><code class="code-block__code" v-html="highlighted" /></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface Props {
  /** Source code string to display */
  code: string;
  /** Language label displayed in header */
  lang?: string;
}

const props = withDefaults(defineProps<Props>(), {
  lang: 'vue',
})

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback: select text
  }
}

// Minimal CSS-based syntax highlighting
const highlighted = computed(() => {
  let code = props.code
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Apply token colors via spans
  code = code
    // Comments
    .replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>')
    // Strings
    .replace(/(&quot;[^&]*?&quot;|&#x27;[^]*?&#x27;|`[^`]*?`)/g, '<span class="token-string">$1</span>')
    // Keywords
    .replace(/\b(import|export|from|const|let|var|function|return|if|else|async|await|new|class|extends|default|true|false|null|undefined)\b/g, '<span class="token-keyword">$1</span>')
    // Vue template tags (escaped)
    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="token-tag">$2</span>')
    // Props/attributes
    .replace(/\s([\w-]+)=/g, ' <span class="token-attr">$1</span>=')
    // Numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>')

  return code
})
</script>

<style scoped>
.code-block {
  background: #0d1117;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-size: var(--text-xs);
}

.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
  background: rgba(255, 255, 255, 0.02);
}

.code-block__lang {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.code-block__copy {
  font-size: var(--text-xs);
  padding: 2px var(--space-2);
  gap: var(--space-1);
  border-radius: var(--radius-sm);
}

.code-block__copy--copied {
  color: var(--color-success);
}

.code-block__pre {
  margin: 0;
  padding: var(--space-4) var(--space-5);
  overflow-x: auto;
  line-height: 1.7;
  tab-size: 2;
}

.code-block__pre::-webkit-scrollbar { height: 4px; }
.code-block__pre::-webkit-scrollbar-track { background: transparent; }
.code-block__pre::-webkit-scrollbar-thumb { background: var(--color-border-strong); border-radius: var(--radius-full); }

.code-block__code {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: #c9d1d9;
  white-space: pre;
}

/* Token colors */
:deep(.token-comment) { color: #6e7681; font-style: italic; }
:deep(.token-string)  { color: #a5d6ff; }
:deep(.token-keyword) { color: #ff7b72; }
:deep(.token-tag)     { color: #7ee787; }
:deep(.token-attr)    { color: #79c0ff; }
:deep(.token-number)  { color: #f2cc60; }
</style>
