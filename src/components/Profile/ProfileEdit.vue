<script setup>
import { useRoute, useRouter } from "vue-router";
import { getUserByID, getUser, updateUser } from "../../firebase";
import { useCookies } from "vue3-cookies";
import { onMounted, reactive } from "vue";
const { cookies } = useCookies();
const route = useRoute();
const router = useRouter();

let id = route.params.id;
let loggeduser;
let st;

const user = await getUserByID(id);
if (cookies.get("email")) {
  loggeduser = await getUser(cookies.get("email"));
} else {
  loggeduser = null;
}
onMounted(() => {
  st;
  if (cookies.get("email") == user.email) {
    console.log("Doğrulandı.");
  } else if (loggeduser["roles"].includes("mod")) {
    console.log("Yetkilendirildi.");
  } else {
    st = 404;
    router.back();
  }
});
////////////////////////////////
const form = reactive({ username: "", password: "" });
const onSubmit = async () => {
  await updateUser(route.params.id, {
    username: form.username ? form.username : user.username,
    password: form.password ? form.password : user.password,
  });
  window.location.href = `/user/${route.params.id}/view`;
};
</script>
<template>
  <div v-if="st == 404">
    <article class="prose max-w-none m-10">
      <h1>Erişim engellendi.</h1>
    </article>
  </div>
  <main v-else>
    <article class="prose max-w-none m-10">
      <h1>Kullanıcı Profilini Düzenle</h1>
    </article>
    <form class="form-control" @submit.prevent="onSubmit">
      <div class="flex flex-row flex-wrap m-10">
        <div class="w-full max-w-xs m-2">
          <label class="label">
            <span class="label-text">Kullanıcı adı</span>
            <span
              class="label-text-alt text-info tooltip tooltip-right"
              data-tip="Eğer daha önce kullanıcı adınızı hiç değiştirmediyseniz bu bölümde otomatik olarak e-posta adresiniz görünecektir. Bu bölümü değiştirip e-posta adresinizi gizleyebilirsiniz."
              ><Icon class="h-4 w-4" icon="material-symbols:info"
            /></span>
          </label>
          <input
            type="text"
            :placeholder="user.username"
            v-model="form.username"
            class="input input-bordered w-full max-w-xs"
          />
        </div>
        <div class="w-full max-w-xs m-2">
          <label class="label">
            <span class="label-text">Profil Fotoğrafı</span>
            <span
              class="label-text-alt text-info tooltip tooltip-right"
              data-tip="Eğer daha önce profil fotoğrafı yüklemediyseniz profil fotoğrafınız rastgele varsayılan profil fotoğraflarından biri olarak seçilir. Aşağıya dosya yükleyerek bunu değiştirebilirsiniz."
              ><Icon class="h-4 w-4" icon="material-symbols:info"
            /></span>
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            disabled
            class="file-input file-input-bordered w-full max-w-xs"
          />
        </div>
        <div class="w-full max-w-xs m-2">
          <label class="label">
            <span class="label-text">Şifre</span>
            <span
              class="label-text-alt text-error tooltip tooltip-right"
              data-tip="Lütfen şifrenizi değiştirirken dikkatli olun. Eğer unutursanız hesabınıza bir daha giriş yapamayabilirsiniz. Güvenlik gereği hesabın gerçek sahibi siz bile olsanız hesabınızı size geri vermeyebiliriz. Lütfen iki kere kontrol edin"
              ><Icon class="h-4 w-4" icon="material-symbols:info"
            /></span>
          </label>
          <input
            type="password"
            placeholder="Lütfen yeni şifrenizi girin..."
            v-model="form.password"
            class="input input-bordered input-error w-full max-w-xs"
          />
        </div>
        <div class="form-control mt-2">
          <label class="label pb-2">
            <span class="label-text">Değişiklikleri Gönder</span>
            <span class="label-text-alt"></span>
          </label>
          <button class="btn btn-wide btn-accent">Değişiklikleri Kaydet</button>
        </div>
      </div>
    </form>
  </main>
</template>
