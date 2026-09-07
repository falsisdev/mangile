<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isModal?: boolean;
  }>(),
  {
    isModal: false,
  },
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const router = useRouter();
const { user, isRegistered, fetchSanityUser, setSanityUser } = useAuthUser();

const isEditing = ref(false);
const isSaving = ref(false);
const saveError = ref("");
const saveSuccess = ref("");
const copiedId = ref(false);

const editForm = reactive({
  name: "",
  avatar: "",
  banner: "",
  bio: "",
});

function initForm() {
  if (!user.value) return;
  editForm.name = user.value.name || "";
  editForm.avatar = user.value.avatar || "";
  editForm.banner = user.value.banner || "";
  editForm.bio = user.value.bio || "";
  saveError.value = "";
  saveSuccess.value = "";
}

watch(
  () => user.value,
  () => {
    initForm();
  },
  { immediate: true },
);

function startEditing() {
  initForm();
  isEditing.value = true;
}

function cancelEditing() {
  initForm();
  isEditing.value = false;
}

function generateRandomAvatar() {
  const seed = Math.random().toString(36).substring(2, 10);
  editForm.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
}

async function copyLogtoId() {
  if (!user.value?.logtoId) return;
  try {
    await navigator.clipboard.writeText(user.value.logtoId);
    copiedId.value = true;
    setTimeout(() => {
      copiedId.value = false;
    }, 2000);
  } catch {
    copiedId.value = false;
  }
}

async function handleSave() {
  if (!user.value) return;
  saveError.value = "";
  saveSuccess.value = "";

  if (!editForm.name.trim()) {
    saveError.value = "Görünen ad boş bırakılamaz.";
    return;
  }

  if (editForm.bio && editForm.bio.length > 200) {
    saveError.value = "Biyografi en fazla 200 karakter olabilir.";
    return;
  }

  isSaving.value = true;
  try {
    const res = await $fetch<{ success: boolean; user: SanityUserData }>(
      "/api/user/update",
      {
        method: "POST",
        body: {
          logtoId: user.value.logtoId,
          name: editForm.name.trim(),
          avatar: editForm.avatar.trim() || undefined,
          banner: editForm.banner.trim() || undefined,
          bio: editForm.bio.trim() || undefined,
        },
      },
    );

    if (res.user) {
      setSanityUser(res.user);
      await fetchSanityUser(true);
      saveSuccess.value = "Profil başarıyla güncellendi.";
      setTimeout(() => {
        isEditing.value = false;
        saveSuccess.value = "";
      }, 1000);
    }
  } catch (err: unknown) {
    const errorObj = err as {
      data?: { statusMessage?: string };
      message?: string;
    };
    saveError.value =
      errorObj?.data?.statusMessage ||
      errorObj?.message ||
      "Profil güncellenirken bir hata oluştu.";
  } finally {
    isSaving.value = false;
  }
}

const roleConfig = computed(() => {
  const roles = user.value?.roles || [];
  if (roles.includes("001")) {
    return {
      color: "error" as const,
      icon: "i-lucide-shield-alert",
      label: "Yönetici",
    };
  }
  if (roles.includes("002")) {
    return {
      color: "warning" as const,
      icon: "i-lucide-shield-check",
      label: "Moderatör",
    };
  }
  if (roles.includes("003")) {
    return {
      color: "primary" as const,
      icon: "i-lucide-languages",
      label: "Çevirmen",
    };
  }
  return {
    color: "neutral" as const,
    icon: "i-lucide-user",
    label: user.value?.roleLabel || "Üye",
  };
});

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}
</script>

<template>
  <div class="w-full text-foreground select-none">
    <div v-if="!user" class="p-8 sm:p-12 text-center space-y-4">
      <div
        class="size-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground"
      >
        <UIcon name="i-lucide-user-x" class="size-8" />
      </div>
      <div class="space-y-1">
        <h2 class="text-lg font-bold">Oturum Bulunamadı</h2>
        <p class="text-sm text-muted">
          Profil bilgilerinizi görüntülemek için lütfen giriş yapın.
        </p>
      </div>
      <div class="pt-2">
        <UButton
          to="/sign-in"
          :external="true"
          label="Giriş Yap"
          icon="i-lucide-log-in"
          color="primary"
          size="md"
        />
      </div>
    </div>

    <div v-else class="overflow-hidden rounded-2xl bg-card shadow-xl">
      <div
        class="relative h-24 sm:h-44 md:h-48 w-full overflow-hidden bg-muted/40"
      >
        <img
          v-if="!isEditing && user.banner"
          :src="user.banner"
          alt="Banner"
          class="size-full object-cover"
        />
        <img
          v-else-if="isEditing && editForm.banner"
          :src="editForm.banner"
          alt="Banner Önizleme"
          class="size-full object-cover"
        />
        <div
          v-else
          class="size-full bg-gradient-to-tr from-primary/25 via-emerald-500/15 to-sky-500/20 relative"
        >
          <div
            class="absolute -top-12 -left-12 size-48 rounded-full bg-primary/20 blur-3xl"
          />
          <div
            class="absolute -bottom-8 -right-8 size-48 rounded-full bg-teal-500/20 blur-3xl"
          />
          <div class="size-full flex items-center justify-center opacity-15">
            <UIcon name="i-lucide-sparkles" class="size-24 text-foreground" />
          </div>
        </div>

        <div
          class="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent"
        />

        <div class="absolute top-3 left-3 z-10 flex items-center gap-2">
          <UButton
            v-if="!props.isModal"
            icon="i-lucide-arrow-left"
            variant="soft"
            color="neutral"
            size="sm"
            class="rounded-full backdrop-blur-md bg-background/70 hover:bg-background shadow-sm"
            aria-label="Geri Dön"
            @click="handleBack"
          />
        </div>

        <div class="absolute top-3 right-3 z-10 flex items-center gap-2">
          <UButton
            v-if="!isEditing"
            icon="i-lucide-pencil"
            label="Düzenle"
            size="xs"
            variant="soft"
            color="neutral"
            class="rounded-full backdrop-blur-md bg-background/80 shadow-sm"
            @click="startEditing"
          />
          <UButton
            v-if="props.isModal"
            icon="i-lucide-x"
            variant="soft"
            color="neutral"
            size="sm"
            class="rounded-full backdrop-blur-md bg-background/70 hover:bg-background shadow-sm"
            aria-label="Kapat"
            @click="emit('close')"
          />
        </div>
      </div>

      <div class="relative px-4 sm:px-6 pb-6 pt-0 space-y-6">
        <div
          class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-15 sm:-mt-17"
        >
          <div class="flex items-end gap-3.5">
            <div class="relative group">
              <UAvatar
                :src="
                  isEditing
                    ? editForm.avatar || undefined
                    : user.avatar || undefined
                "
                :alt="user.name"
                size="4xl"
                icon="i-lucide-user"
                class="border-5 border-bg ring-card bg-muted size-20 sm:size-24 rounded-3xl"
              />
              <button
                v-if="isEditing"
                type="button"
                class="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-[10px] font-medium opacity-90 hover:opacity-100 transition-opacity"
                @click="generateRandomAvatar"
              >
                <UIcon name="i-lucide-dice-5" class="size-5 mb-0.5" />
                <span>Rastgele</span>
              </button>
            </div>

            <div
              class="space-y-1 pb-1 bg-default -ml-4 rounded-tr-xl px-3 pt-2"
            >
              <div class="flex items-center gap-2 flex-wrap">
                <h1
                  class="text-xl sm:text-2xl font-black tracking-tight text-foreground"
                >
                  {{ isEditing ? editForm.name || "Adınız" : user.name }}
                </h1>
                <UBadge
                  :color="roleConfig.color"
                  variant="solid"
                  size="sm"
                  class="rounded-lg px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs"
                >
                  <UIcon :name="roleConfig.icon" class="size-3" />
                  <span>{{ roleConfig.label }}</span>
                </UBadge>
                <UBadge
                  color="success"
                  variant="solid"
                  size="sm"
                  class="rounded-lg px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs"
                >
                  <UIcon name="i-lucide-check-circle-2" class="size-3" />
                  <span>Doğrulanmış</span>
                </UBadge>
              </div>
              <div class="flex items-center gap-2 text-xs text-muted">
                <span>@{{ user.username || "üye" }}</span>
                <span class="size-1 rounded-full bg-muted-foreground/4" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isEditing"
          class="p-4 sm:p-5 rounded-2xl bg-muted/30 space-y-4"
        >
          <div class="flex items-center justify-between pb-2">
            <span
              class="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5"
            >
              <UIcon name="i-lucide-edit-3" class="size-3.5 text-primary" />
              Profili Düzenle
            </span>
            <button
              type="button"
              class="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
              @click="generateRandomAvatar"
            >
              <UIcon name="i-lucide-dice-5" class="size-3" />
              Yeni Avatar Üret
            </button>
          </div>

          <UAlert
            v-if="saveError"
            color="error"
            variant="subtle"
            icon="i-lucide-alert-circle"
            :title="saveError"
          />

          <UAlert
            v-if="saveSuccess"
            color="success"
            variant="subtle"
            icon="i-lucide-check-circle"
            :title="saveSuccess"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-foreground"
                >Görünen Ad</label
              >
              <UInput
                v-model="editForm.name"
                placeholder="Adınız Soyadınız"
                icon="i-lucide-user"
                class="w-full"
                maxlength="50"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-foreground"
                >Avatar URL</label
              >
              <UInput
                v-model="editForm.avatar"
                placeholder="https://.../avatar.png"
                icon="i-lucide-image"
                class="w-full"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-foreground"
              >Banner Fotoğrafı URL</label
            >
            <UInput
              v-model="editForm.banner"
              placeholder="https://.../banner.jpg"
              icon="i-lucide-panorama"
              class="w-full"
            />
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-foreground"
                >Biyografi</label
              >
              <span
                class="text-[10px]"
                :class="
                  editForm.bio.length > 200
                    ? 'text-red-500 font-bold'
                    : 'text-muted'
                "
              >
                {{ editForm.bio.length }}/200
              </span>
            </div>
            <UTextarea
              v-model="editForm.bio"
              placeholder="Kendinizi tanıtacak bir şeyler yazın..."
              :rows="2"
              class="w-full"
              maxlength="200"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <UButton
              label="Vazgeç"
              variant="ghost"
              color="neutral"
              size="sm"
              class="rounded-xl"
              :disabled="isSaving"
              @click="cancelEditing"
            />
            <UButton
              label="Kaydet"
              icon="i-lucide-check"
              color="primary"
              size="sm"
              class="rounded-xl"
              :loading="isSaving"
              @click="handleSave"
            />
          </div>
        </div>

        <div v-else class="space-y-5">
          <div class="space-y-1.5">
            <h3
              class="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5"
            >
              <UIcon name="i-lucide-sparkles" class="size-3.5 text-primary" />
              Hakkında
            </h3>
            <div
              v-if="user.bio"
              class="p-3.5 rounded-2xl bg-muted/25 text-sm text-foreground/90 leading-relaxed font-normal"
            >
              {{ user.bio }}
            </div>
            <div
              v-else
              class="p-3.5 rounded-2xl bg-muted/15 text-xs text-muted flex items-center justify-between"
            >
              <span>Henüz bir biyografi eklenmemiş.</span>
              <button
                type="button"
                class="text-primary hover:underline font-medium text-xs flex items-center gap-1"
                @click="startEditing"
              >
                <UIcon name="i-lucide-plus" class="size-3" />
                Ekle
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <h3
              class="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5"
            >
              <UIcon name="i-lucide-compass" class="size-3.5 text-primary" />
              Hızlı Erişim & İstatistikler
            </h3>
            <div class="grid grid-cols-3 gap-2.5 sm:gap-3">
              <NuxtLink
                to="/lists"
                class="group p-3 rounded-2xl bg-muted/25 hover:bg-muted/45 transition-all flex flex-col items-center justify-center text-center gap-1"
                @click="props.isModal ? emit('close') : undefined"
              >
                <div
                  class="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <UIcon name="i-lucide-library" class="size-4" />
                </div>
                <span class="text-base font-black text-foreground">
                  {{ user.lists?.length || 0 }}
                </span>
                <span class="text-[10px] text-muted font-medium">Listeler</span>
              </NuxtLink>

              <NuxtLink
                to="/history"
                class="group p-3 rounded-2xl bg-muted/25 hover:bg-muted/45 transition-all flex flex-col items-center justify-center text-center gap-1"
                @click="props.isModal ? emit('close') : undefined"
              >
                <div
                  class="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <UIcon name="i-lucide-history" class="size-4" />
                </div>
                <span class="text-base font-black text-foreground">
                  Geçmiş
                </span>
                <span class="text-[10px] text-muted font-medium"
                  >Okunanlar</span
                >
              </NuxtLink>

              <NuxtLink
                to="/sync"
                class="group p-3 rounded-2xl bg-muted/25 hover:bg-muted/45 transition-all flex flex-col items-center justify-center text-center gap-1"
                @click="props.isModal ? emit('close') : undefined"
              >
                <div
                  class="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <UIcon name="i-lucide-cloud-backup" class="size-4" />
                </div>
                <span class="text-base font-black text-foreground">
                  Bulut
                </span>
                <span class="text-[10px] text-muted font-medium">Senkron</span>
              </NuxtLink>
            </div>
          </div>

          <div class="space-y-2">
            <h3
              class="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5"
            >
              <UIcon
                name="i-lucide-shield-check"
                class="size-3.5 text-primary"
              />
              Hesap & Güvenlik
            </h3>
            <div class="p-3.5 rounded-2xl bg-muted/20 space-y-2.5 mb-10">
              <div class="flex items-center justify-between gap-2 text-xs">
                <span class="text-muted flex items-center gap-1.5">
                  <UIcon
                    name="i-lucide-fingerprint"
                    class="size-3.5 text-primary"
                  />
                  Logto Kimlik No
                </span>
                <div class="flex items-center gap-1">
                  <code
                    class="px-2 py-0.5 rounded-md bg-background text-[10px] text-muted-foreground font-mono max-w-[140px] sm:max-w-[200px] truncate"
                  >
                    {{ user.logtoId }}
                  </code>
                  <UButton
                    :icon="copiedId ? 'i-lucide-check' : 'i-lucide-copy'"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    class="rounded-md"
                    :aria-label="copiedId ? 'Kopyalandı' : 'Kopyala'"
                    @click="copyLogtoId"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between gap-4 text-xs pt-1">
                <span class="text-muted flex items-center gap-1.5">
                  <UIcon
                    name="i-lucide-database"
                    class="size-3.5 text-primary"
                  />
                  Veritabanı Durumu
                </span>
                <UBadge
                  :color="isRegistered ? 'success' : 'warning'"
                  variant="subtle"
                  size="xs"
                  class="rounded-md"
                >
                  {{ isRegistered ? "Aktif Profil" : "Kayıt Bekleniyor" }}
                </UBadge>
              </div>
            </div>
            <div v-if="!isEditing" class="absolute bottom-5 right-7">
              <UButton
                v-if="!isRegistered"
                to="/new-user"
                label="Kaydı Tamamla"
                icon="i-lucide-sparkles"
                size="sm"
                color="warning"
                variant="soft"
              />
              <UButton
                to="/sign-out"
                :external="true"
                label="Çıkış Yap"
                icon="i-lucide-log-out"
                size="sm"
                color="neutral"
                variant="soft"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
