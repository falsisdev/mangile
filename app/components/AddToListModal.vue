<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    titleId?: string
    malId?: number
    titleName?: string
    titleType?: string
  }>(),
  {
    open: false,
    titleId: undefined,
    malId: undefined,
    titleName: '',
    titleType: 'manga'
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  added: []
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const { user } = useAuthUser()
const { fetchUserLists, createList, addListItem } = useLists()
const toast = useToast()

const userLists = ref<ListData[]>([])
const loadingLists = ref(false)
const submitting = ref(false)
const selectedListId = ref<string>('')
const isCreatingNew = ref(false)

const note = ref('')
const customIndex = ref<number | undefined>(undefined)

const newTitle = ref('')
const newDescription = ref('')
const newIsPrivate = ref(false)

async function loadLists() {
  if (!user.value?.logtoId) return
  loadingLists.value = true
  try {
    const data = await fetchUserLists(user.value.logtoId, user.value.logtoId)
    userLists.value = data || []
    if (userLists.value.length > 0 && !selectedListId.value) {
      selectedListId.value = userLists.value[0]._id
    }
  } catch {
    userLists.value = []
  } finally {
    loadingLists.value = false
  }
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      note.value = ''
      customIndex.value = undefined
      isCreatingNew.value = false
      newTitle.value = ''
      newDescription.value = ''
      newIsPrivate.value = false
      loadLists()
    }
  }
)

async function handleAdd() {
  if (!user.value?.logtoId) return

  submitting.value = true
  try {
    let targetListId = selectedListId.value

    if (isCreatingNew.value) {
      if (!newTitle.value.trim()) {
        toast.add({
          title: 'Hata',
          description: 'Lütfen liste başlığı girin.',
          color: 'error'
        })
        submitting.value = false
        return
      }

      const created = await createList({
        title: newTitle.value.trim(),
        description: newDescription.value.trim(),
        isPrivate: newIsPrivate.value,
        logtoId: user.value.logtoId
      })
      targetListId = created._id
    }

    if (!targetListId) {
      toast.add({
        title: 'Hata',
        description: 'Lütfen bir liste seçin veya yeni oluşturun.',
        color: 'error'
      })
      submitting.value = false
      return
    }

    await addListItem(targetListId, {
      referenceId: props.titleId || undefined,
      externalId: props.malId || undefined,
      externalType: props.titleType || 'manga',
      index: customIndex.value || undefined,
      note: note.value.trim() || undefined,
      logtoId: user.value.logtoId
    })

    toast.add({
      title: 'Başarılı',
      description: `"${props.titleName || 'Seri'}" listeye eklendi!`,
      color: 'success'
    })

    emit('added')
    isOpen.value = false
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'İşlem sırasında bir hata oluştu.'
    toast.add({
      title: 'Hata',
      description: msg,
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Listeye Ekle"
    description="Seriyi kişisel listelerinize ekleyin"
    :ui="{
      content: 'sm:max-w-md p-5 rounded-2xl bg-card shadow-2xl'
    }"
  >
    <template #content>
      <div v-if="!user" class="py-6 text-center space-y-3">
        <UIcon name="i-lucide-lock" class="size-10 text-muted mx-auto" />
        <h3 class="text-base font-bold text-foreground">Giriş Yapmalısınız</h3>
        <p class="text-xs text-muted max-w-xs mx-auto">
          Listelere içerik ekleyebilmek ve kişisel koleksiyon oluşturabilmek için lütfen giriş yapın.
        </p>
        <UButton
          to="/sign-in"
          color="primary"
          variant="solid"
          size="sm"
          class="rounded-xl font-bold mt-2"
        >
          Giriş Yap
        </UButton>
      </div>

      <div v-else class="space-y-4">
        <div class="flex items-center gap-3 p-3 rounded-xl bg-muted/20 ring-1 ring-default/20">
          <UIcon name="i-lucide-bookmark" class="size-5 text-primary shrink-0" />
          <div class="min-w-0">
            <h4 class="text-sm font-bold truncate text-foreground">
              {{ titleName || 'Seçili Seri' }}
            </h4>
            <span class="text-[11px] text-muted">
              {{ titleType === 'lightNovel' ? 'Hafif Roman' : 'Manga' }}
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-foreground">Hedef Liste</label>
            <UButton
              variant="ghost"
              color="primary"
              size="xs"
              :icon="isCreatingNew ? 'i-lucide-list' : 'i-lucide-plus'"
              @click="isCreatingNew = !isCreatingNew"
            >
              {{ isCreatingNew ? 'Mevcut Listeler' : 'Yeni Liste' }}
            </UButton>
          </div>

          <div v-if="!isCreatingNew" class="space-y-2">
            <div v-if="loadingLists" class="py-4 text-center">
              <UIcon name="i-lucide-loader-2" class="size-5 animate-spin mx-auto text-primary" />
            </div>
            <div v-else-if="userLists.length === 0" class="text-center py-4 space-y-2">
              <p class="text-xs text-muted">Henüz hiç listeniz bulunmuyor.</p>
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                @click="isCreatingNew = true"
              >
                İlk Listeni Oluştur
              </UButton>
            </div>
            <div v-else class="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                v-for="l in userLists"
                :key="l._id"
                type="button"
                class="flex items-center justify-between p-2.5 rounded-xl border text-left transition-all text-xs"
                :class="selectedListId === l._id ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-default/20 hover:bg-muted/20 text-foreground'"
                @click="selectedListId = l._id"
              >
                <span class="truncate">{{ l.title }}</span>
                <span class="text-[10px] text-muted shrink-0 ml-2">
                  {{ l.items?.length || l.itemsCount || 0 }} öge
                </span>
              </button>
            </div>
          </div>

          <div v-else class="space-y-3 p-3 rounded-xl bg-muted/15 border border-default/20">
            <div class="space-y-1">
              <label class="text-[11px] font-medium text-muted">Liste Başlığı</label>
              <UInput
                v-model="newTitle"
                placeholder="Örn. Favorilerim, Okunacaklar..."
                size="sm"
                class="w-full"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-medium text-muted">Açıklama (İsteğe bağlı)</label>
              <UInput
                v-model="newDescription"
                placeholder="Liste hakkında kısa bilgi"
                size="sm"
                class="w-full"
              />
            </div>
            <div class="flex items-center gap-2 pt-1">
              <UCheckbox
                v-model="newIsPrivate"
                name="isPrivate"
                label="Gizli Liste (Yalnızca siz görebilirsiniz)"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div class="space-y-1 sm:col-span-1">
              <label class="text-[11px] font-medium text-muted">Sıra Numarası</label>
              <UInput
                v-model.number="customIndex"
                type="number"
                placeholder="Oto"
                size="sm"
                class="w-full"
              />
            </div>
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-muted">Kişisel Not (İsteğe bağlı)</label>
              <UInput
                v-model="note"
                placeholder="Örn: 20. bölümdeyim, çizimleri harika"
                size="sm"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-default/20">
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            @click="isOpen = false"
          >
            İptal
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            :loading="submitting"
            :disabled="!isCreatingNew && userLists.length === 0"
            @click="handleAdd"
          >
            Listeye Ekle
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
