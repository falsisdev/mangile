<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to: string
    cover?: string
    title?: string
    dateStamp?: string
    kind?: string
  }>(),
  {
    cover: '',
    title: '',
    dateStamp: '',
    kind: 'manga'
  }
)

const isNovel = computed(() => props.kind === 'novel' || props.kind === 'lightNovel')
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative flex items-stretch gap-3 w-full overflow-hidden rounded-2xl border border-default bg-elevated/50 p-2.5 cursor-pointer select-none touch-manipulation [-webkit-tap-highlight-color:transparent] transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out hover:border-primary/40 hover:bg-elevated hover:shadow-md active:scale-[0.98] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  >
    <div class="relative w-20 sm:w-24 shrink-0 aspect-2/3 overflow-hidden rounded-xl border border-default/60 bg-muted">
      <img
        :src="cover"
        :alt="title"
        loading="lazy"
        decoding="async"
        draggable="false"
        class="absolute inset-0 h-full w-full object-cover pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105"
      >
    </div>

    <div class="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
      <div class="flex items-center gap-1.5">
        <span
          class="relative flex h-2 w-2 shrink-0"
          aria-hidden="true"
        >
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <UIcon
          name="i-lucide-clock"
          class="h-3 w-3 shrink-0 text-dimmed"
        />
        <span class="truncate text-[11px] font-semibold text-muted">{{ formatTimeAgo(dateStamp) }}</span>
        <span class="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-toned">
          <UIcon
            :name="isNovel ? 'i-lucide-book-open' : 'i-lucide-image'"
            class="h-3 w-3"
          />
          {{ isNovel ? 'Roman' : 'Manga' }}
        </span>
      </div>

      <h3 class="text-sm font-bold leading-snug text-highlighted line-clamp-2">
        {{ title }}
      </h3>

      <span class="mt-auto inline-flex items-center gap-1 text-[11px] font-bold text-primary">
        Oku
        <UIcon
          name="i-lucide-chevron-right"
          class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </div>
  </NuxtLink>
</template>
