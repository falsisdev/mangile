<template>
  <!--NAVBAR-->
<div :data-theme="route.query.preview ? route.query.preview == 'none' ? runtimeConfig.public.theme : route.query.preview : route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme"  class="navbar bg-base-100">
<div class="flex-1">
  <NuxtLink :to="route.query.theme ? '/?theme=' + route.query.theme : '/'" class="btn btn-ghost no-animation hover:bg-[transparent] bg-base-100 normal-case text-[23px]"><img width="75" src="https://cdn.discordapp.com/attachments/775822548519616562/1043105098236166194/mangile_full.png"/> Mangile</NuxtLink>
</div>
<div class="flex-none gap-2">

<div class="form-control">
  <div class="input-group">
    <input id="searchbar" type="text" placeholder="Ara..." class="input w-full max-w-xs" @keyup="search()"/>
    <button @click="directsearch()" class="btn btn-square"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
  </div>
</div>

<label for="my-modal-6" class="btn btn-ghost"><span class="p-2"><font-awesome-icon icon="fa-solid fa-palette" /></span> Tema Değiştir</label>

<input type="checkbox" id="my-modal-6" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle cursor-pointer">
  <div class="modal-box w-11/12 max-w-5xl">
    <label for="my-modal-6" class="btn btn-sm btn-square absolute right-4">✕</label>
    <h3 class="font-bold text-lg">Mangile Tema Değiştirme Sistemi</h3>
    <p class="py-4">
      Aşağıdan İstediğiniz Temayı seçiniz.
      <br/>
      <select id="theme" class="select w-full max-w-xs">
        <option> Tema Seç </option>
        <option id="halloween">Cadılar Bayramı (Karanlık)</option>
        <option id="forest">Orman (Karanlık)</option>
        <option id="black">Siyah (Karanlık)</option>
        <option id="luxury">Lüks (Karanlık)</option>
        <option id="dracula">Drakula (Karanlık) [Önerilen] [Varsayılan]</option>
        <option id="night">Gece (Karanlık) [Önerilen]</option>
        <option id="business">İşletme (Karanlık)</option>
        <option id="coffee">Kahve (Karanlık)</option>
      </select>
    </p>
    <h2>Tema Önizlemeleri:</h2>
    <div class="flex flex-row flex-wrap">
    <div data-theme="halloween" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Cadılar Bayramı</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div><div></div></div>

    <div data-theme="forest" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Orman</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div><div></div></div>

    <div data-theme="black" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Siyah</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div><div></div></div>

    <div data-theme="luxury" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Lüks</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div><div></div></div>

    <div data-theme="dracula" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Drakula</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div><div></div></div>

    <div data-theme="night" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Gece</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div><div></div></div>

    <div data-theme="business" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">İşletme</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div><div></div></div>

    <div data-theme="coffee" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Kahve</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div><div></div></div>

      </div>
    <div class="modal-action">
      <label for="my-modal-6" class="btn btn-ghost" @click="preview()">Önizleme</label>
      <label for="my-modal-6" class="btn" @click="theme()">Temayı Seç!</label>
    </div>
  </div>
</div>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img src="https://placeimg.com/80/80/people" />
      </div>
    </label>
    <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
      <li>
        <a>
          <span><font-awesome-icon icon="fa-solid fa-user"></font-awesome-icon></span> Profil
        </a>
      </li>
      <li><a> <span><font-awesome-icon icon="fa-solid fa-gear"></font-awesome-icon></span> Ayarlar </a></li>
      <li><a><span><font-awesome-icon icon="fa-solid fa-right-from-bracket"></font-awesome-icon></span> Çıkış Yap</a></li>
    </ul>
  </div>
</div>
</div>
<!--NAVBAR-->
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();
const route = useRoute()
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | Mangile` : 'Mangile';
    }
  })
function preview(){
  window.location.href = `/?preview=${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : 'none'}`
}
function theme(){
  window.location.href = `/?theme=${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : 'none'}`
  localStorage.setItem("theme", `${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : 'none'}`)
}
function search() {
var input = document.getElementById("searchbar");

input.addEventListener("keypress", function(event) {
if (event.key === "Enter") {
  event.preventDefault();
  window.location.href = route.query.theme ? `/search?q=${document.getElementById("searchbar").value}&theme=${route.query.theme}` : `/search?q=${document.getElementById("searchbar").value}`
}
}); 
}
function directsearch() {
  window.location.href = route.query.theme ? `/search?q=${document.getElementById("searchbar").value}&theme=${route.query.theme}` : `/search?q=${document.getElementById("searchbar").value}`
}
</script>