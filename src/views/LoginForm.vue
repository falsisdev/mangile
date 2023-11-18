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
  <div class="hero min-h-screen">
    <div class="hero-content flex-col">
      <div class="text-center">
        <h1 class="text-5xl font-bold">
          {{
            route.params.type == "login"
              ? "Giriş Yap!"
              : route.params.type == "signup"
              ? "Kayıt Ol!"
              : "Eh... Form!? Giriş yapmıyorsun... Kayıt da olmuyorsun... Hey hey, sen buraya ne yapmaya geldin???"
          }}
        </h1>
      </div>
      <br /><br />
      <div class="card w-96 bg-base-100 border border-base-300">
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
              ><br />
            </label>
            <div class="form-control mt-6">
              <button type="submit" class="btn btn-warning">
                {{
                  route.params.type == "login"
                    ? "Giriş Yap"
                    : route.params.type == "signup"
                    ? "Kayıt Ol"
                    : "ÇOK GİZLİ BUTON (BİR İŞE YARAMIYOR)"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute, RouterLink } from "vue-router";
import { reactive } from "vue";
import { createUser as create, checkUser } from "../firebase";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const route = useRoute();
const form = reactive({ email: "", password: "" });

const onSubmit = async () => {
  if (route.params.type == "signup") {
    if ((await checkUser({ ...form })) == false) {
      form.email = "";
      form.password = "";
      window.location.href = "/auth/signup?message=no";
    } else {
      await create({ ...form });
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
      window.location.href = "/";
    }
  }
  return { form, onSubmit };
};
</script>
