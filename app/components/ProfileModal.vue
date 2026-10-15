<script setup lang="ts">
const { isOpen, closeProfile } = useProfileModal()
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Kullanıcı Profili"
    description="Kullanıcı profil bilgileri ve ayarları"
    :close="false"
    :ui="{
      content:
        'sm:max-w-xl p-0 overflow-hidden rounded-2xl bg-card shadow-2xl bg-default max-h-[90dvh] overflow-y-auto'
    }"
  >
    <template #content>
      <ProfileView
        :is-modal="true"
        @close="closeProfile"
      />
    </template>
  </UModal>
</template>
