<template>
    <!--NAVBAR-->
<div class="navbar bg-base-100">
  <div class="flex-1">
    <NuxtLink to="/" class="btn btn-ghost no-animation hover:bg-[transparent] bg-base-100 normal-case text-[23px]"><img width="75" src="https://cdn.discordapp.com/attachments/775822548519616562/1043105098236166194/mangile_full.png"/> Mangile</NuxtLink>
  </div>
  <div class="flex-none gap-2">
    <div class="form-control">
      <input id="searchbar" type="text" placeholder="Ara..." class="input input-bordered" @keyup="search()"/>
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
function search() {
var input = document.getElementById("searchbar");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    window.location.href = `/search?q=${document.getElementById("searchbar").value}`
  }
}); 
}
</script>