<script setup lang="ts">
withDefaults(
  defineProps<{
    to: string
    cover?: string
    title?: string
    badge?: string
    badgeIcon?: string
    accentBadge?: boolean
  }>(),
  {
    cover: '',
    title: '',
    badge: '',
    badgeIcon: '',
    accentBadge: false
  }
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative block aspect-2/3 w-full overflow-hidden rounded-2xl border border-default bg-elevated shadow-sm cursor-pointer select-none touch-manipulation [-webkit-tap-highlight-color:transparent] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-[0.97] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  >
    <img
      :src="cover"
      :alt="title"
      loading="lazy"
      decoding="async"
      draggable="false"
      class="absolute inset-0 h-full w-full object-cover pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.06]"
    >

    <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/5 pointer-events-none" />

    <div
      v-if="badge"
      class="absolute top-2.5 left-2.5 max-w-[calc(100%-20px)] pointer-events-none"
    >
      <span
        class="inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
        :class="accentBadge
          ? 'bg-primary/90 text-inverted ring-1 ring-white/25'
          : 'bg-black/45 text-white ring-1 ring-white/20'"
      >
        <UIcon
          v-if="badgeIcon"
          :name="badgeIcon"
          class="h-3 w-3 shrink-0"
        />
        <span class="truncate">{{ badge }}</span>
      </span>
    </div>

    <div class="absolute inset-x-0 bottom-0 p-3 pt-8 pointer-events-none">
      <h3 class="text-sm font-semibold leading-snug text-white line-clamp-2 drop-shadow-sm">
        {{ title }}
      </h3>
    </div>
  </NuxtLink>
</template>
