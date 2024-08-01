<script setup>
//////////////////////////////////////////////////////////
import { useRoute, RouterLink } from "vue-router";
import { reactive } from "vue";
import { useCookies } from "vue3-cookies";
import { socket } from "@/socket";
import { useTitle } from "@vueuse/core";
//////////////////////////////////////////////////////////
import { createUser as create, checkUser } from "../firebase";
//////////////////////////////////////////////////////////
const { cookies } = useCookies();
const route = useRoute();
useTitle(route.params.type == "signup" ? "Kayıt Ol" : "Giriş Yap", {
  titleTemplate: "%s | Mangile",
});
const form = reactive({ email: "", password: "" });
//////////////////////////////////////////////////////////
const onSubmit = async () => {
  if (route.params.type == "signup") {
    if ((await checkUser({ ...form })) == false) {
      form.email = "";
      form.password = "";
      window.location.href = "/auth/signup?message=no";
    } else {
      let pfps = [
        "https://i.pinimg.com/originals/88/bd/4b/88bd4b9c59ae46726bc9971fe6fb20f5.jpg",
        "https://i.pinimg.com/originals/e8/bf/c4/e8bfc416a29125b0141d38e812cb0a66.jpg",
        "https://i.pinimg.com/originals/0b/fc/3c/0bfc3c5b20c439c4972383592e1c26bc.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnq00CqROQzpWhvxfYhwQ4w_BN6PxO-liR0szMRjG4JlKV0Zb-RCmnVZbeMDhWZtTmNjU&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5G0-Ev_Zz-LZh6pGV-tJ5SQSnJoWRFYuGnsNJL00vxR02UmAVDhPlk79Ym9ReS5e9rV8&usqp=CAU",
        "https://i.pinimg.com/736x/e8/53/ed/e853ed2c34466cda8a3fd501fddb7ddd.jpg",
        "https://i.pinimg.com/736x/62/e6/bb/62e6bb7b0d6b9cd9fe167c40a8b899c8.jpg",
        "https://i.pinimg.com/originals/2e/35/01/2e35019335011f5338727dbc024244bf.jpg",
        "https://i.pinimg.com/736x/d1/34/07/d1340745c4aaa9ee1c6952e793765bb7.jpg",
        "https://i.pinimg.com/474x/81/70/21/81702128c4248529f9dc6e7506432004.jpg",
      ];
      await create({
        username: form.email,
        uploads: 0,
        roles: ["user"],
        pfp: pfps[Math.floor(Math.random() * pfps.length)],
        password: btoa(form.password),
        lists: 0,
        email: form.email,
      });
      form.email = "";
      form.password = "";
      window.location.href = "/auth/login?message=ok";
    }
  } else if ((route.params.type = "login")) {
    if ((await checkUser({ ...form })) == true) {
      form.email = "";
      form.password = "";
      window.location.href = "/auth/login?message=no";
    } else {
      cookies.set("email", form.email);
      cookies.set("isLogged", true);
      form.email = "";
      form.password = "";
      socket.connect();
      console.log("Profil Sunucuya Bağlandı.");
      window.location.href = "/?connected=1";
    }
  }
  return { form, onSubmit };
};
//////////////////////////////////////////////////////////
</script>
<template>
  <div
    class="toast z-10"
    v-if="
      route.query.message == 'ok'
        ? true
        : route.query.message == 'no'
        ? true
        : false
    "
  >
    <div class="alert alert-success" v-if="route.query.message == 'ok'">
      <span class="flex flex-row"
        ><Icon icon="material-symbols:done" class="h-5 w-5 mt-1 mr-1" /> Kayıt
        olma başarılı. Lütfen giriş yapın.</span
      >
    </div>
    <div class="alert alert-error" v-if="route.query.message == 'no'">
      <span class="flex flex-row" v-if="route.params.type == 'signup'">
        Kayıt olma başarısız.<br />
        Kayıt olmak istediğiniz e-posta adresi zaten sistemde bulunuyor.
        <br />Lütfen başka bir e-posta adresini kullanmayı deneyin.</span
      >
      <span class="flex flex-row" v-if="route.params.type == 'login'">
        Giriş başarısız.<br />
        Giriş yapmak istediğiniz e-posta adresi veya şifre girmek istediğiniz
        hesapla eşleşmiyor.
        <br />Lütfen giriş yapmadan önce bilgilerinizi kontrol edin veya kayıt
        olmayı deneyin.</span
      >
    </div>
  </div>
  <div class="hero my-10">
    <div class="hero-content flex-col">
      <div class="text-center">
        <div class="card w-96 bg-base-100 border border-base-300">
          <h2 class="text-4xl font-bold mt-10">
            {{
              route.params.type == "login"
                ? "Giriş Yap!"
                : route.params.type == "signup"
                ? "Kayıt Ol!"
                : "Eh... Form!? Giriş yapmıyorsun... Kayıt da olmuyorsun... Hey hey, sen buraya ne yapmaya geldin???"
            }}
          </h2>
          <div class="card-body">
            <form @submit.prevent="onSubmit" class="form-control">
              <label class="label">
                <span class="label-text">E-Posta</span>
              </label>
              <input
                type="email"
                v-model="form.email"
                placeholder="E-Posta adresinizi Giriniz..."
                class="input"
                required
              />
              <label class="label">
                <span class="label-text">Şifre</span>
              </label>
              <input
                type="password"
                v-model="form.password"
                placeholder="Şifrenizi Giriniz..."
                class="input"
                required
              />
              <span class="flex-col">
                <label class="label">
                  <RouterLink
                    to="/contact"
                    class="label-text-alt link link-error no-underline link-hover hover:link-error"
                    >{{
                      route.params.type == "login"
                        ? "Giriş yapmakta"
                        : route.params.type == "signup"
                        ? "Kayıt olmakta"
                        : "Bilmiyorum, ben neyde"
                    }}
                    sorun yaşıyorum{{
                      route.params.type == "login"
                        ? "!"
                        : route.params.type == "signup"
                        ? "!"
                        : "?"
                    }}</RouterLink
                  >
                </label>
              </span>
              <div class="form-control">
                <button
                  type="submit"
                  :class="`btn btn-${
                    route.params.type == 'login'
                      ? 'info'
                      : route.params.type == 'signup'
                      ? 'primary'
                      : 'error'
                  }`"
                >
                  {{
                    route.params.type == "login"
                      ? "Giriş Yap"
                      : route.params.type == "signup"
                      ? "Kayıt Ol"
                      : "ÇOK GİZLİ BUTON (BİR İŞE YARAMIYOR)"
                  }}
                </button>
                <RouterLink
                  :to="
                    route.params.type == 'login'
                      ? '/auth/signup'
                      : route.params.type == 'signup'
                      ? '/auth/login'
                      : '/'
                  "
                  class="btn btn-accent mt-1"
                  >Bunun yerine
                  {{
                    route.params.type == "login"
                      ? "Kayıt Ol"
                      : route.params.type == "signup"
                      ? "Giriş Yap"
                      : "Ana sayfaya dön"
                  }}!</RouterLink
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
