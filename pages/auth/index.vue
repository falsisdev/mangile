<script setup>
let a = "a"
       /* const runtimeConfig = useRuntimeConfig();
        const route = useRoute();

        const email = ref('')
        const password = ref('')
        const isSignUp = ref(false)
        const client = useSupabaseClient();

        const signUp = async () => {
        const { data, error } = await client.auth.signUp({
            email: email.value,
            password: password.value
        })
        console.log('user', user)
        console.log('error', error)
        }

        const login = async () => {
        const { data, error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
        console.log('user', user)
        console.log('error', error)
        }

        const user = useSupabaseUser()
        onMounted(() => {
            watchEffect(() => {
                if (user.value) {
                navigateTo('/')
                }
            })
        })
        useHead({
            title: "Giriş Yap"
        })
        definePageMeta({
            layout: "default"
        })*/
</script>
<template>
    <span></span>
   <!-- <div class="col-span-2 col-start-2 col-end-8">
        <div class="hero min-h-screen">
            <div class="hero-content flex-col">
                <div class="text-center">
                    <h1 class="text-5xl font-bold">Giriş Yap!</h1>
                </div>
                <br/><br/>
                <div class="card w-96 bg-base-100 border border-base-300">
                    <div class="card-body">
                        <form @submit.prevent="() => (isSignUp ? signUp() : login())" class="form-control">
                                <label class="label">
                                    <span class="label-text">E-Posta</span>
                                </label>
                                <input type="email" v-model="email" placeholder="E-Posta adresinizi Giriniz..." class="input" required/>
                                <label class="label">
                                    <span class="label-text">Şifre</span>
                                </label>
                                <input type="password" v-model="password" placeholder="Şifrenizi Giriniz..." class="input" required/>
                                <label class="label">
                                    <NuxtLink to="/contact" class="label-text-alt link link-error no-underline link-hover hover:link-error">Giriş Yapmakta sorun yaşıyorum!</NuxtLink><br/>
                                </label>
                            <div class="form-control mt-6">
                                <button type="submit" class="btn btn-warning">Giriş Yap</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>-->
</template>