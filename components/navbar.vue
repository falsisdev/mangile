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

<label for="my-modal-6" class="btn btn-ghost"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'" class="p-2"><font-awesome-icon icon="fa-solid fa-palette" /></span><span class="p-2" v-else-if="route.query.icon == 'material'"><IconsMaterialPalette/></span> Tema Değiştir</label>

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
        <option id="violett">Violett (Karanlık)</option>
        <option id="sky">Gök (Karanlık)</option>
        <option id="otuken">Ötüken (Karanlık)</option>
        <option id="garden">Bahçe (Aydınlık)</option>
        <option id="autumn">Güz (Aydınlık)</option>
        <option id="winter">Kış (Aydınlık)</option>
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

    <div data-theme="violett" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Violett</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div></div>

    <div data-theme="sky" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Gök</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div></div>

    <div data-theme="otuken" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Ötüken</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div></div>

    <div data-theme="garden" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Bahçe</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div></div>

    <div data-theme="autumn" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Güz</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div></div>

    <div data-theme="winter" class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Kış</div> <div class="flex flex-wrap gap-1"><div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-primary-content text-sm font-bold">A</div></div> <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-secondary-content text-sm font-bold">A</div></div> <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-accent-content text-sm font-bold">A</div></div> <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-neutral-content text-sm font-bold">A</div></div></div></div>
      </div>
      <p class="py-4">
      Aşağıdan İstediğiniz Simge Paketini seçiniz.
      <br/>
      <select id="icontheme" class="select w-full max-w-xs">
        <option> Simge Paketi Seç </option>
        <option id="fontawesome">FontAwesome (Varsayılan)</option>
        <option id="material">Material</option>
      </select>
    </p>
    <h2>Simge Önizlemeleri:</h2>
    <div class="flex flex-row flex-wrap">
    <div class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">FontAwesome</div> <div class="flex flex-wrap gap-1"><div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><span><font-awesome-icon icon="fa-solid fa-house"></font-awesome-icon></span></div></div> <div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><span><font-awesome-icon icon="fa-solid fa-compass"></font-awesome-icon></span></div></div> <div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><span><font-awesome-icon icon="fa-solid fa-file-circle-plus" /></span></div></div> <div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><span><font-awesome-icon icon="fa-solid fa-folder-plus" /></span> </div></div> <div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><span><font-awesome-icon icon="fa-solid fa-shuffle"></font-awesome-icon></span></div></div></div><div></div></div>

    <div class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"><div class="font-bold">Material</div> <div class="flex flex-wrap gap-1"><div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><IconsMaterialHome/></div></div> <div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><IconsMaterialExplore/></div></div> <div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><IconsMaterialFile/></div></div> <div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><IconsMaterialFolder/></div></div> <div class="bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6"><div class="text-sm font-bold"><IconsMaterialShuffle/></div></div></div><div></div></div>
      </div>

      <div class="alert alert-warning shadow-lg">
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    <span>Eğer site veya simge temasını seçmeden değişiklikleri kaydederseniz seçilmeyen seçenek sıfırlanacaktır.</span>
  </div>
</div>
    <div class="modal-action">
      <label for="my-modal-6" class="btn btn-ghost" @click="preview()">Önizleme</label>
      <label for="my-modal-6" class="btn" @click="theme()">Değişiklikleri Kaydet</label>
    </div>
  </div>
</div>
<a v-if="islogged == false" href="/auth"><button class="btn btn-ghost"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'" class="p-2"><font-awesome-icon icon="fa-solid fa-right-from-bracket" /></span><span class="p-2" v-else-if="route.query.icon == 'material'"><IconsMaterialLogout/></span> Giriş Yap</button></a>
  <div v-else class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img :src="avatar" />
      </div>
    </label>
    <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
      <li>
        <b>{{ username }}</b>
      </li>
      <li>
        <a>
          <span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-user"></font-awesome-icon></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialUser/></span> Profil
        </a>
      </li>
      <li><a> <span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-gear"/></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialSettings/></span> Ayarlar </a></li>
      <li><button @click="signout()"><span v-if="!route.query.icon || route.query.icon == 'fontawesome'"><font-awesome-icon icon="fa-solid fa-right-from-bracket"></font-awesome-icon></span><span v-else-if="route.query.icon == 'material'"><IconsMaterialLogout/></span> Çıkış Yap</button></li>
    </ul>
  </div>
</div>
</div>
<!--NAVBAR-->
</template>
<script setup>
import { onMounted } from 'vue'
const runtimeConfig = useRuntimeConfig();
const route = useRoute()
const client = useSupabaseClient()
const user = useSupabaseUser()
let islogged = user.value == true
function preview(){
  window.location.href = `/?preview=${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : document.getElementById('theme').value == 'Bahçe (Aydınlık)' ? 'garden' : document.getElementById('theme').value == 'Güz (Aydınlık)' ? 'autumn' : document.getElementById('theme').value == 'Kış (Aydınlık)' ? 'winter' : document.getElementById('theme').value == 'Violett (Karanlık)' ? 'violett' : document.getElementById('theme').value == 'Gök (Karanlık)' ? 'sky' : document.getElementById('theme').value == 'Ötüken (Karanlık)' ? 'otuken' : 'none'}`
}
function theme(){
  window.location.href = `/?theme=${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : document.getElementById('theme').value == 'Bahçe (Aydınlık)' ? 'garden' : document.getElementById('theme').value == 'Güz (Aydınlık)' ? 'autumn' : document.getElementById('theme').value == 'Kış (Aydınlık)' ? 'winter' : document.getElementById('theme').value == 'Violett (Karanlık)' ? 'violett' : document.getElementById('theme').value == 'Gök (Karanlık)' ? 'sky' : document.getElementById('theme').value == 'Ötüken (Karanlık)' ? 'otuken' : 'none'}`
  localStorage.setItem("theme", `${document.getElementById('theme').value == 'Drakula (Karanlık) [Önerilen] [Varsayılan]' ? 'dracula' : document.getElementById('theme').value == 'Cadılar Bayramı (Karanlık)' ? 'halloween' : document.getElementById('theme').value == 'Orman (Karanlık)' ? 'forest' : document.getElementById('theme').value == 'Siyah (Karanlık)' ? 'black' : document.getElementById('theme').value == 'Lüks (Karanlık)' ? 'luxury' : document.getElementById('theme').value == 'Gece (Karanlık) [Önerilen]' ? 'night' : document.getElementById('theme').value == 'İşletme (Karanlık)' ? 'business' : document.getElementById('theme').value == 'Kahve (Karanlık)' ? 'coffee' : document.getElementById('theme').value == 'Bahçe (Aydınlık)' ? 'garden' : document.getElementById('theme').value == 'Güz (Aydınlık)' ? 'autumn' : document.getElementById('theme').value == 'Kış (Aydınlık)' ? 'winter' : document.getElementById('theme').value == 'Violett (Karanlık)' ? 'violett' : document.getElementById('theme').value == 'Gök (Karanlık)' ? 'sky' : document.getElementById('theme').value == 'Ötüken (Karanlık)' ? 'otuken' : 'none'}`)
  if(document.getElementById('icontheme').value == 'Material') {
    if(localStorage.getItem('icontheme') != 'material') {
      localStorage.setItem('icontheme', "material")
    }
  }else if(document.getElementById('icontheme').value == 'FontAwesome (Varsayılan)'){
    if(localStorage.getItem('icontheme') != 'fontawesome') {
      localStorage.setItem('icontheme', "fontawesome")
    }
  }
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
const signout = async () => {
  islogged = false
  await client.auth.signOut()
  window.location.reload()
}
</script>