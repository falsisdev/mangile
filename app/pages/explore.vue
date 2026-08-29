<script setup lang="ts">
interface ExploreCard {
  id: number
  title: string
  cover: string
  type: string
  year: number
}

const breadcrumbs = useBreadcrumbs()
const config = useRuntimeConfig()

breadcrumbs.value = [{ label: 'Ana Sayfa', to: '/' }, { label: 'Keşfet' }]

const page = ref(1)
const exploreMode = ref<'menu' | 'all' | 'local'>('menu')

const { data: titles } = await useLazyFetch<ExploreCard[]>(
  `${config.public.backend.baseUrl}/api/mangaList`,
  {
    key: 'exploreTitles',
    query: computed(() => ({
      filterType: 'POPULAR',
      limit: 50,
      page: page.value || 1
    })),
    transform: (data: unknown) => {
      const list = Array.isArray(data)
        ? data
        : (data as Record<string, unknown>).data || []
      return (list as Record<string, unknown>[]).map(
        (title: Record<string, unknown>): ExploreCard => ({
          id: Number(title.mal_id),
          title: String(title.anilist_title ?? ''),
          type:
            String(title.mal_type ?? '')
              ?.replaceAll('MANGA', 'Manga')
              .replaceAll('NOVEL', 'Hafif Roman')
              .replaceAll('ONE_SHOT', 'One-Shot') || 'Manga',
          year: Number(title.mal_year ?? 0),
          cover: String(title.anilist_cover_image ?? '')
        })
      )
    }
  }
)
</script>

<template>
  <div class="px-4 md:px-8 max-w-7xl mx-auto pb-10">
    <div class="flex flex-col mb-6 mt-4">
      <h1 class="text-3xl font-black text-foreground">
        Keşfet
      </h1>
      <p class="text-sm text-muted-foreground mt-1">
        Mangile'da bulunan serileri ara, filtrele ve keşfet!
      </p>
    </div>

    <div v-if="exploreMode === 'menu'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div 
        class="bg-muted/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
        @click="void (exploreMode = 'all')"
        style="
        background-image: url('https://cdn.sanity.io/images/1yge7tlr/production/82d9ae08a8b6318090165bad8229d9fb2d072317-700x420.gif');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.7);
        "
        >
        <div class="rounded-full text-primary group-hover:scale-110 transition-transform">
          <UIcon name="i-lucide-globe" class="w-10 h-10" />
        </div>
        <div class="text-center">
          <h3 class="text-xl font-bold text-foreground">Tüm Serileri Keşfet</h3>
          <p class="text-sm text-muted-foreground mt-2">Geniş veritabanındaki (AniList) tüm serileri inceleyin</p>
        </div>
      </div>
      
      <div 
        class="bg-muted/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
        @click="void (exploreMode = 'local')"
        style="
        background-image: url('https://cdn.sanity.io/images/1yge7tlr/production/23d03703d1751a1e51b27a4c4099e80ad1673545-540x250.gif');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.7);
        "
      >
        <div class="rounded-full text-primary group-hover:scale-110 transition-transform">
          <UIcon name="i-lucide-library" class="w-10 h-10" />
        </div>
        <div class="text-center">
          <h3 class="text-xl font-bold text-foreground">Mangile Serilerini Keşfet</h3>
          <p class="text-sm text-muted-foreground mt-2">Mangile sistemine eklenmiş serileri görüntüleyin</p>
        </div>
      </div>
    </div>

    <div v-else-if="exploreMode === 'all'" class="space-y-6">
      <div class="flex items-center gap-2">
        <UButton 
          icon="i-lucide-arrow-left" 
          variant="soft" 
          color="neutral" 
          size="sm"
          class="rounded-xl"
          @click="void (exploreMode = 'menu')"
        >
          Geri Dön
        </UButton>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        <NuxtLink
          v-for="item of titles"
          :key="item.title"
          :to="`/title/${item.id}`"
        >
          <CardExplore
            :id="item.id"
            :title="item.title"
            :cover="item.cover"
            :type="item.type"
            :year="item.year"
            class="w-full"
          />
        </NuxtLink>
      </div>

      <div class="flex justify-center w-full pt-8">
        <UPagination
          v-model:page="page"
          active-color="primary"
          active-variant="soft"
          :total="1000"
        />
      </div>
    </div>
    
    <div v-else-if="exploreMode === 'local'" class="text-center pb-20 relative">
      <div class="flex items-center gap-2">
        <UButton 
          icon="i-lucide-arrow-left" 
          variant="soft" 
          color="neutral" 
          size="sm"
          class="rounded-xl"
          @click="void (exploreMode = 'menu')"
        >
          Geri Dön
        </UButton>
      </div>
      <UIcon name="i-lucide-construction" class="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
      <h3 class="text-2xl font-bold">Çok Yakında!</h3>
      <p class="text-muted-foreground mt-2">Bu bölüm henüz yapım aşamasındadır.</p>
    </div>
  </div>
</template>
