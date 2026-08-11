<template>
  <section :id="id" class="showcase-section">
    <header class="showcase-section__header">
      <div class="showcase-section__title-row">
        <span v-if="badge" class="badge badge--primary">{{ badge }}</span>
        <h2 class="showcase-section__title">{{ title }}</h2>
      </div>
      <p v-if="description" class="showcase-section__description">{{ description }}</p>
    </header>
    <div class="showcase-section__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
export interface Props {
  /** Anchor ID for sidebar navigation */
  id: string;
  /** Section heading */
  title: string;
  /** Optional subtitle below heading */
  description?: string;
  /** Optional badge label (e.g. "Beta", "New") */
  badge?: string;
}

withDefaults(defineProps<Props>(), {
  description: '',
  badge: '',
})
</script>

<style scoped>
.showcase-section {
  padding-bottom: var(--space-16);
  border-bottom: 1px solid var(--color-border-subtle);
  margin-bottom: var(--space-16);
  scroll-margin-top: var(--space-8);
}

.showcase-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.showcase-section__header {
  margin-bottom: var(--space-8);
}

.showcase-section__title-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
}

.showcase-section__title {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
}

.showcase-section__description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-loose);
  max-width: 68ch;
}
</style>
