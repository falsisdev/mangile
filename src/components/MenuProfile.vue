<script setup>
import { getIDByEmail, getUser } from "../firebase";
import SettingsView from "../views/SettingsView.vue";
import { useCookies } from "vue3-cookies";
import { socket } from "@/socket";

const { cookies } = useCookies();

let isLogged = cookies.get("isLogged");

function logout() {
  cookies.remove("isLogged");
  cookies.remove("email");
  cookies.remove("theme");
  socket.disconnect();
  window.location.reload();
}

let user;
let id;
if (isLogged) {
  user = await getUser(cookies.get("email"));
  id = await getIDByEmail(cookies.get("email"));
}
</script>
<template>
  <div class="dropdown dropdown-end" v-if="isLogged">
    <label tabindex="0" class="btn btn-ghost btn-circle avatar btn-md mx-2">
      <div class="w-10 rounded-full">
        <img :src="user.pfp" title="Profil Fotoğrafı" />
      </div>
    </label>
    <ul
      tabindex="0"
      class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-50"
    >
      <li>
        <b>{{ user.username }}</b>
      </li>
      <li>
        <RouterLink :to="`/user/${id}/view`">
          <Icon icon="material-symbols:person" /> Profil</RouterLink
        >
      </li>
      <li>
        <a onclick="my_modal_3.showModal()">
          <Icon icon="material-symbols:settings" /> Ayarlar
        </a>
      </li>
      <li>
        <button @click="logout()">
          <Icon icon="material-symbols:logout" /> Çıkış Yap
        </button>
      </li>
    </ul>
    <dialog id="my_modal_3" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <SettingsView />
      </div>
    </dialog>
  </div>
  <RouterLink v-else to="/auth/login">
    <button class="btn btn-ghost btn-sm mt-3">
      <Icon icon="material-symbols:login" /> Giriş Yap
    </button></RouterLink
  >
</template>
