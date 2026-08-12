<script setup>
const props = defineProps({
  id: Number,
  cover: String,
  title: String,
  type: String,
  year: Number,
});
</script>

<template>
  <div
    class="relative group w-48 max-h-84 min-h-72 h-full rounded-xl overflow-hidden shadow-lg bg-zinc-900 cursor-pointer"
  >
    <img
      :src="cover"
      alt="Manga Cover"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    <div
      class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/60 to-transparent"
    />

    <div class="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3">
      <h3
        class="text-white font-semibold text-base line-clamp-2 leading-snug tracking-wide"
      >
        {{ title }} ({{ year }})
      </h3>

      <div class="self-start">
        <UBadge color="neutral" variant="soft">
          {{ type }}
        </UBadge>
      </div>
    </div>
  </div>
</template>
