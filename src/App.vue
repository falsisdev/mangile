<script setup>
import { RouterView, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
//////////////////////////////////////////////////////////
import Navbar from "./components/Home/Navbar.vue";
import Footer from "./components/Home/Footer.vue";
//////////////////////////////////////////////////////////
const router = useRouter();
const { cookies } = useCookies();
//////////////////////////////////////////////////////////
const back = () => router.back();
const forward = () => router.forward();
//////////////////////////////////////////////////////////
</script>
<template>
  <div
    class="grid grid-cols-10"
    :data-theme="cookies.get('theme') == null ? 'dim' : cookies.get('theme')"
  >
    <div class="mx-20 my-5 col-span-8 col-start-2 col-end-10">
      <Navbar />
      <span class="flex flex-row">
        <button @click="back()" class="btn btn-ghost btn-sm">
          <Icon icon="material-symbols:arrow-back" class="h-5 w-5" />
        </button>
        <div class="grow"></div>
        <button @click="forward()" class="btn btn-ghost btn-sm">
          <Icon icon="material-symbols:arrow-forward" class="h-5 w-5" />
        </button>
      </span>
      <router-view v-slot="{ Component }">
        <suspense timeout="0">
          <template #default>
            <component :is="Component"></component>
          </template>
          <template #fallback>
            <div
              class="flex flex-row text-align-center align-items-center justify-center"
            >
              <span class="loading loading-spinner loading-lg"></span>
              <h2 class="text-3xl mb-1">
                <b class="m-3">Yükleniyor...</b>
              </h2>
            </div>
          </template>
        </suspense>
      </router-view>
      <div class="divider" />
      <Footer />
    </div>
  </div>
</template>
