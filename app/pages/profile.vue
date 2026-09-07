<script setup lang="ts">
const { user } = useAuthUser()

useHead({
  title: computed(() => user.value ? `${user.value.name} (@${user.value.username}) - Profil` : 'Profil - Mangile')
})
</script>

<template>
  <div class="max-w-2xl mx-auto py-1 sm:py-6">
    <ProfileView :is-modal="false" />
  </div>
</template>
