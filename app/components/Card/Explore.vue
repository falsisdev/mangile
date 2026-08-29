<script setup>
defineProps({
  id: Number,
  cover: String,
  title: String,
  type: String,
  year: Number
})
</script>

<template>
  <CardCover
    :to="`/title/${id}`"
    :cover="cover"
    :badge="type ?? ''"
    :title="year ? `${title} (${year})` : (title ?? '')"
  />
</template>
