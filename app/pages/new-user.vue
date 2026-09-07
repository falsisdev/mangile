<script setup lang="ts">
const router = useRouter()
const { logtoUser, user, isRegistered, isChecking, fetchSanityUser, setSanityUser } = useAuthUser()

useHead({
  title: 'Kullanıcı Kaydı - Mangile',
  meta: [
    { name: 'description', content: 'Mangile topluluğuna katılmak için profilinizi oluşturun.' }
  ]
})

const initialCheckDone = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  username: '',
  avatar: '',
  banner: '',
  bio: ''
})

const usernameStatus = reactive({
  checking: false,
  available: null as boolean | null,
  message: ''
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function validateUsernameLocal(val: string): string | null {
  if (!val) return 'Kullanıcı adı gereklidir.'
  if (val.length < 3 || val.length > 20) return 'Kullanıcı adı 3-20 karakter arasında olmalıdır.'
  if (!/^[a-zA-Z0-9_]+$/.test(val)) return 'Sadece harf, rakam ve alt çizgi (_) içerebilir.'
  return null
}

async function checkUsernameAvailability(usernameToTest: string) {
  const localError = validateUsernameLocal(usernameToTest)
  if (localError) {
    usernameStatus.available = false
    usernameStatus.message = localError
    usernameStatus.checking = false
    return
  }

  usernameStatus.checking = true
  try {
    const res = await $fetch<{ valid: boolean, available: boolean, message: string }>('/api/user/check-username', {
      query: { username: usernameToTest }
    })
    usernameStatus.available = res.available
    usernameStatus.message = res.message
  } catch {
    usernameStatus.available = null
    usernameStatus.message = ''
  } finally {
    usernameStatus.checking = false
  }
}

function onUsernameInput(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = target.value.trim()
  form.username = raw

  if (debounceTimer) clearTimeout(debounceTimer)
  if (!raw) {
    usernameStatus.available = null
    usernameStatus.message = ''
    return
  }

  debounceTimer = setTimeout(() => {
    checkUsernameAvailability(raw)
  }, 400)
}

function generateRandomAvatar() {
  const seed = Math.random().toString(36).substring(2, 10)
  form.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`
}

onMounted(async () => {
  if (logtoUser) {
    const existing = await fetchSanityUser(true)
    if (existing) {
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      // Pre-fill form from Logto user
      form.name = logtoUser.name || logtoUser.username || ''
      const safeUsername = (logtoUser.username || logtoUser.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 20)
      form.username = safeUsername
      form.avatar = logtoUser.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${logtoUser.sub || 'mangile'}`

      if (safeUsername && safeUsername.length >= 3) {
        checkUsernameAvailability(safeUsername)
      }
    }
  }
  initialCheckDone.value = true
})

async function onSubmit() {
  errorMessage.value = ''

  if (!logtoUser?.sub) {
    errorMessage.value = 'Oturum bulunamadı. Lütfen önce Logto ile giriş yapın.'
    return
  }

  const userErr = validateUsernameLocal(form.username)
  if (userErr) {
    errorMessage.value = userErr
    return
  }

  if (usernameStatus.available === false) {
    errorMessage.value = usernameStatus.message || 'Bu kullanıcı adı uygun değil.'
    return
  }

  if (!form.name.trim()) {
    errorMessage.value = 'Lütfen adınızı veya görünen adınızı girin.'
    return
  }

  isSubmitting.value = true
  try {
    const res = await $fetch<{
      success: boolean
      alreadyExisted: boolean
      user: SanityUserData
      message: string
    }>('/api/user/register', {
      method: 'POST',
      body: {
        logtoId: logtoUser.sub,
        username: form.username.trim(),
        name: form.name.trim(),
        avatar: form.avatar.trim() || undefined,
        banner: form.banner.trim() || undefined,
        bio: form.bio.trim() || undefined
      }
    })

    if (res.user) {
      setSanityUser(res.user)
      successMessage.value = 'Profiliniz başarıyla oluşturuldu! Yönlendiriliyorsunuz...'
      setTimeout(() => {
        router.push('/')
      }, 1200)
    }
  } catch (err: unknown) {
    const errorObj = err as { data?: { statusMessage?: string }, message?: string }
    errorMessage.value = errorObj?.data?.statusMessage || errorObj?.message || 'Kayıt sırasında bir hata oluştu.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 md:p-8">
    <div class="w-full max-w-xl">
      <!-- 1. Yükleniyor Durumu -->
      <div
        v-if="!initialCheckDone || isChecking"
        class="flex flex-col items-center justify-center py-16 text-center space-y-4"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="w-10 h-10 animate-spin text-primary"
        />
        <p class="text-sm text-muted">
          Kullanıcı profiliniz kontrol ediliyor...
        </p>
      </div>

      <!-- 2. Giriş Yapılmamış Durumu -->
      <UCard
        v-else-if="!logtoUser"
        class="border border-border/60 shadow-xl backdrop-blur-sm"
      >
        <div class="text-center py-8 px-4 space-y-4">
          <div class="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <UIcon
              name="i-lucide-user-x"
              class="w-8 h-8"
            />
          </div>
          <h2 class="text-xl font-bold text-foreground">
            Oturum Açmanız Gerekiyor
          </h2>
          <p class="text-sm text-muted max-w-md mx-auto">
            Kayıt sayfasına erişebilmek için lütfen Logto üzerinden giriş yapın veya hesap oluşturun.
          </p>
          <div class="pt-2">
            <UButton
              to="/sign-in"
              :external="true"
              label="Logto ile Giriş Yap"
              icon="i-lucide-log-in"
              color="primary"
              size="lg"
            />
          </div>
        </div>
      </UCard>

      <!-- 3. Zaten Kayıtlı Durumu -->
      <UCard
        v-else-if="isRegistered"
        class="border border-border/60 shadow-xl backdrop-blur-sm"
      >
        <div class="text-center py-8 px-4 space-y-4">
          <div class="size-16 rounded-2xl bg-success/10 text-success flex items-center justify-center mx-auto">
            <UIcon
              name="i-lucide-check-circle-2"
              class="w-8 h-8 text-green-500"
            />
          </div>
          <h2 class="text-xl font-bold text-foreground">
            Zaten Kayıtlısınız!
          </h2>
          <p class="text-sm text-muted max-w-md mx-auto">
            Hoş geldiniz, <strong class="text-foreground">{{ user?.name }}</strong>! Profiliniz Sanity üzerinde aktif durumda. Ana sayfaya aktarılıyorsunuz...
          </p>
          <div class="pt-2">
            <UButton
              to="/"
              label="Ana Sayfaya Git"
              icon="i-lucide-house"
              variant="soft"
            />
          </div>
        </div>
      </UCard>

      <!-- 4. Kayıt Formu Durumu -->
      <UCard
        v-else
        class="border border-border/60 shadow-2xl backdrop-blur-md bg-card/80 overflow-hidden"
      >
        <template #header>
          <div class="space-y-1 text-center sm:text-left">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <UIcon
                name="i-lucide-sparkles"
                class="w-3.5 h-3.5"
              />
              <span>Son Bir Adım Kaldı</span>
            </div>
            <h1 class="text-2xl font-black tracking-tight text-foreground">
              Profilinizi Oluşturun
            </h1>
            <p class="text-xs sm:text-sm text-muted">
              Mangile dünyasında manga okumak, listeler oluşturmak ve etkileşime geçmek için bilgilerinizi tamamlayın.
            </p>
          </div>
        </template>

        <form
          class="space-y-5"
          @submit.prevent="onSubmit"
        >
          <!-- Canlı Önizleme Kartı -->
          <div class="relative rounded-xl border border-border/60 p-4 bg-muted/20 flex items-center gap-4">
            <UAvatar
              :src="form.avatar || undefined"
              :alt="form.name || 'Önizleme'"
              size="xl"
              class="ring-2 ring-primary/20 shrink-0"
              icon="i-lucide-user"
            />
            <div class="min-w-0 flex-1 space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="font-bold text-base text-foreground truncate">
                  {{ form.name || 'Adınız Soyadınız' }}
                </span>
                <UBadge
                  color="primary"
                  variant="subtle"
                  size="xs"
                >
                  Üye
                </UBadge>
              </div>
              <p class="text-xs text-muted truncate">
                @{{ form.username || 'kullaniciadi' }}
              </p>
              <p
                v-if="form.bio"
                class="text-[11px] text-muted-foreground line-clamp-1 italic pt-0.5"
              >
                "{{ form.bio }}"
              </p>
            </div>
          </div>

          <!-- Hata & Başarı Bildirimleri -->
          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            icon="i-lucide-alert-circle"
            :title="errorMessage"
          />

          <UAlert
            v-if="successMessage"
            color="success"
            variant="subtle"
            icon="i-lucide-check-circle"
            :title="successMessage"
          />

          <!-- Kullanıcı Adı (username) -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-foreground flex items-center gap-1">
                Kullanıcı Adı <span class="text-red-500">*</span>
              </label>
              <span
                v-if="usernameStatus.checking"
                class="text-[11px] text-muted flex items-center gap-1"
              >
                <UIcon
                  name="i-lucide-loader-2"
                  class="w-3 h-3 animate-spin"
                /> Kontrol ediliyor
              </span>
              <span
                v-else-if="usernameStatus.available === true"
                class="text-[11px] text-emerald-500 font-medium flex items-center gap-0.5"
              >
                <UIcon
                  name="i-lucide-check"
                  class="w-3 h-3"
                /> Uygun
              </span>
              <span
                v-else-if="usernameStatus.available === false"
                class="text-[11px] text-rose-500 font-medium flex items-center gap-0.5"
              >
                <UIcon
                  name="i-lucide-x"
                  class="w-3 h-3"
                /> {{ usernameStatus.message }}
              </span>
            </div>
            <UInput
              :model-value="form.username"
              placeholder="ornek_kullanici"
              icon="i-lucide-at-sign"
              class="w-full"
              maxlength="20"
              required
              @input="onUsernameInput"
            />
            <p class="text-[11px] text-muted">
              3-20 karakter uzunluğunda olmalı; sadece harf, rakam ve alt çizgi içerebilir.
            </p>
          </div>

          <!-- Görünen Ad (name) -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground flex items-center gap-1">
              Görünen Ad <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.name"
              placeholder="Örn: Ahmet Yılmaz veya Mangasever"
              icon="i-lucide-user"
              class="w-full"
              maxlength="50"
              required
            />
            <p class="text-[11px] text-muted">
              Yorumlarda ve profilinizde görüntülenecek isim (1-50 karakter).
            </p>
          </div>

          <!-- Profil Fotoğrafı (avatar) -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-foreground">
                Profil Fotoğrafı URL (Opsiyonel)
              </label>
              <button
                type="button"
                class="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
                @click="generateRandomAvatar"
              >
                <UIcon
                  name="i-lucide-dice-5"
                  class="w-3 h-3"
                /> Rastgele Avatar
              </button>
            </div>
            <UInput
              v-model="form.avatar"
              placeholder="https://.../avatar.jpg"
              icon="i-lucide-image"
              class="w-full"
            />
          </div>

          <!-- Banner Fotoğrafı (banner) -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">
              Banner Fotoğrafı URL (Opsiyonel)
            </label>
            <UInput
              v-model="form.banner"
              placeholder="https://.../banner.jpg"
              icon="i-lucide-panorama"
              class="w-full"
            />
          </div>

          <!-- Biyografi (bio) -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-foreground">
                Hakkınızda / Biyografi (Opsiyonel)
              </label>
              <span
                class="text-[10px]"
                :class="form.bio.length > 200 ? 'text-red-500 font-bold' : 'text-muted'"
              >
                {{ form.bio.length }}/200
              </span>
            </div>
            <UTextarea
              v-model="form.bio"
              placeholder="Kendinizden, sevdiğiniz türlerden veya serilerden bahsedin..."
              :rows="3"
              class="w-full"
              maxlength="200"
            />
          </div>

          <!-- Logto ID Bilgisi (Salt Okunur) -->
          <div class="p-2.5 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-between text-[11px]">
            <span class="text-muted flex items-center gap-1.5">
              <UIcon
                name="i-lucide-shield-check"
                class="w-3.5 h-3.5 text-primary"
              />
              Doğrulanmış Logto ID
            </span>
            <code class="px-1.5 py-0.5 bg-background rounded text-[10px] text-muted-foreground font-mono">
              {{ logtoUser.sub }}
            </code>
          </div>

          <!-- Gönder Butonu -->
          <div class="pt-2">
            <UButton
              type="submit"
              label="Kaydı Tamamla ve Giriş Yap"
              icon="i-lucide-check-circle"
              block
              size="lg"
              color="primary"
              :loading="isSubmitting"
              :disabled="isSubmitting || usernameStatus.available === false"
            />
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>
