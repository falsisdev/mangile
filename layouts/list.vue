<template>
    <NuxtLoadingIndicator 
      color="#5E8FD9"
      :duration="12000"
    />
    <navbar/>
    <div :data-theme="route.query.preview ? route.query.preview == 'none' ? runtimeConfig.public.theme : route.query.preview : route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"   class="grid grid-rows-1 grid-cols-6"><!--grid-->
    <leftmenu/>
    <slot />
    </div>
  </template>
  <script setup>
  const runtimeConfig = useRuntimeConfig();
  const route = useRoute()
  useHead({
    titleTemplate: (titleChunk) => {
      if(route.query.preview) {
        return 'Tema Önizleme | Mangile'
      }else{
        return titleChunk ? `${titleChunk} | Mangile` : 'Mangile';
      }
      }
  })
  </script>