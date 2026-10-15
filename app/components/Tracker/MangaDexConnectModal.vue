<script setup lang="ts">
import { ref } from 'vue'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{
  (e: 'connected'): void
}>()

const { connectMangaDex } = useTrackers()

const username = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

async function handleConnect() {
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Lütfen kullanıcı adı ve şifrenizi girin.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const res = await connectMangaDex(username.value.trim(), password.value)
    if (res.success) {
      username.value = ''
      password.value = ''
      open.value = false
      emit('connected')
    } else {
      errorMessage.value = res.error || 'MangaDex hesabı doğrulanamadı.'
    }
  } catch (err: unknown) {
    const errorObj = err as { message?: string }
    errorMessage.value = errorObj?.message || 'MangaDex hesabı doğrulanamadı.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content: 'sm:max-w-md bg-neutral-900 border border-neutral-800 max-h-[90dvh] overflow-y-auto'
    }"
  >
    <template #content>
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <TrackerBrandIcon
            provider="mangadex"
            class="w-8 h-8"
          />
          <div>
            <h3 class="text-base font-semibold text-neutral-100">
              MangaDex Hesabını Bağla
            </h3>
            <p class="text-xs text-neutral-400">
              Manga okuma ilerlemenizi MangaDex ile eşitleyin
            </p>
          </div>
        </div>

        <div class="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-3 text-xs text-neutral-300 mb-4 leading-relaxed">
          MangaDex kişisel istemci API kuralları gereği, hesabınızı yetkilendirmek için MangaDex kullanıcı adı ve şifrenizle bir kerelik oturum açmanız gerekmektedir. Bilgileriniz güvenli sunucu üzerinden MangaDex ile doğrulanır ve saklanmaz.
        </div>

        <form
          class="space-y-4"
          @submit.prevent="handleConnect"
        >
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-neutral-300">MangaDex Kullanıcı Adı veya E-posta</label>
            <UInput
              v-model="username"
              placeholder="Kullanıcı adınız"
              icon="i-lucide-user"
              :disabled="isSubmitting"
              autofocus
              class="w-full"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-neutral-300">MangaDex Şifresi</label>
            <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              icon="i-lucide-lock"
              :disabled="isSubmitting"
              class="w-full"
            />
          </div>

          <p
            v-if="errorMessage"
            class="text-xs text-red-400"
          >
            {{ errorMessage }}
          </p>

          <div class="flex items-center justify-end gap-2 pt-2">
            <UButton
              type="button"
              color="neutral"
              variant="subtle"
              :disabled="isSubmitting"
              @click="void (open = false)"
            >
              Vazgeç
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="isSubmitting"
              icon="i-lucide-link"
            >
              Bağla
            </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>
