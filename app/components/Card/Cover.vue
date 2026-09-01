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
    class="group relative block aspect-2/3 w-full overflow-hidden rounded-xl sm:rounded-2xl border border-default bg-elevated shadow-xs sm:shadow-sm cursor-pointer select-none touch-manipulation [-webkit-tap-highlight-color:transparent] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-[0.97] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  >
    <img
      :src="cover"
      :alt="title"
      loading="lazy"
      decoding="async"
      draggable="false"
      class="absolute inset-0 h-full w-full object-cover pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.06]"
    >

    <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

    <div
      v-if="badge"
      class="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 max-w-[calc(100%-12px)] sm:max-w-[calc(100%-16px)] pointer-events-none"
    >
      <span
        class="inline-flex max-w-full items-center gap-0.5 sm:gap-1 rounded-full px-1.5 py-0.5 sm:px-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
        :class="accentBadge
          ? 'bg-primary/90 text-inverted ring-1 ring-white/25'
          : 'bg-black/55 text-white ring-1 ring-white/20'"
      >
        <UIcon
          v-if="badgeIcon"
          :name="badgeIcon"
          class="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0"
        />
        <span class="truncate">{{ badge }}</span>
      </span>
    </div>

    <div class="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 pt-6 sm:pt-8 pointer-events-none">
      <h3 class="text-xs sm:text-sm font-semibold leading-tight sm:leading-snug text-white line-clamp-2 drop-shadow-xs">
        {{ title }}
      </h3>
    </div>
  </NuxtLink>
</template>
