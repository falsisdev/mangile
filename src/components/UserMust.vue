<script setup>
import { useCookies } from "vue3-cookies";
import { RouterLink } from "vue-router";
import { getIDByEmail, getUser } from "../firebase";

const { cookies } = useCookies();

let loggeduser;
let id;
if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
  id = await getIDByEmail(cookies.get("email"));
} else {
  loggeduser = null;
}
</script>
<template>
  <span class="hover:bg-base-100 text-sm/6">
    <Icon icon="material-symbols:local-library" class="h-5 w-5" /><span
      class="flex flex-row"
      >Kütüphane</span
    ><span
      class="tooltip tooltip-accent"
      data-tip="Kullanıcı girişi gerektiriyor!"
      ><Icon
        icon="material-symbols:person-alert"
        class="badge badge-accent" /></span
  ></span>
  <ul>
    <li>
      <RouterLink
        :to="loggeduser ? `/user/${id}/library` : ''"
        class="text-sm/6"
        ><Icon
          icon="material-symbols:library-books-rounded"
          class="h-5 w-5"
        />Kütüphane</RouterLink
      >
    </li>
    <li>
      <a class="text-sm/6"
        ><Icon icon="material-symbols:list-alt" class="h-5 w-5" />Listelerin</a
      >
    </li>
    <li>
      <a class="text-sm/6"
        ><Icon icon="material-symbols:history" class="h-5 w-5" />Okuma
        Geçmişi</a
      >
    </li>
  </ul>
</template>
