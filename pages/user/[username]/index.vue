<template>
        <div class="col-span-2 col-start-2 col-end-5 pr-5">
            <div class="card lg:card-side bg-base-100 border-base-300 border p-5">
            <figure>
                <div class="avatar mt-5">
                <div class="w-24 h-24 rounded-full">
                    <img :src="useravatar"> 
                </div>
                </div>
            </figure>
                <span class="card-body">
                <article class="prose"><h3 class="card-title">
                        
                {{ name }} <span v-if="isMod" class="badge badge-sm badge-primary m-2">MOD</span>
                
            </h3>
            @{{ username }}
        </article>
                </span>
            <div class="card-actions justify-end mt-5">
                <button v-if="isowner == true || isUserAdmin == true" class="btn btn-primary"><span><font-awesome-icon icon="fa-solid fa-pen" /></span></button>
            </div>
        </div>
        <br/>
        <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Listeler
        </div>
        <div class="collapse-content">  
            Listeler burada görünecektir.
        </div>
        </div><br/>
        <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          İstatistikler
        </div>
        <div class="collapse-content">  
            <div class="stats shadow">
                <div class="stat">
                    <div class="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div class="stat-title">Rozetler</div>
                    <div class="stat-value text-primary">11</div>
                    <div class="stat-desc">Profilinizde 11 adet rozetiniz var.</div>
                </div>
                
                <div class="stat">
                    <div class="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div class="stat-title">Listeler</div>
                    <div class="stat-value text-secondary">0</div>
                    <div class="stat-desc">Profilinizde 0 adet listeniz bulunuyor.</div>
                </div>
                
                <div class="stat">
                    <div class="stat-figure text-secondary">
                    <div class="avatar">
                        <div class="w-16 rounded-full">
                        <img :src="useravatar" />
                        </div>
                    </div>
                    </div>
                    <div class="stat-value">%100</div>
                    <div class="stat-title">Tamamlandı</div>
                    <div class="stat-desc text-secondary">Tüm profil düzenleme görevlerini bitirdiniz.</div>
                </div>
                
                </div>
        </div>
        </div>
     </div>
     <div class="col-span-2 col-start-5 col-end-7 pr-5">
        <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Hakkında
        </div>
        <div class="collapse-content whitespace-pre">  
            {{ userinfo.data.value.data.result.aboutme.replaceAll("\\n", "\n") || "Hakkında Girilmemiş." }}
        </div>
        </div><br/>
        <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Rozetler
        </div>
        <div class="collapse-content">  
            <span v-for="item of userinfo.data.value.data.result.badges" :key="item" class="badge m-1">
            {{ item.replace("founder", "Kurucu").replace("seniormanager", "Üst Düzey Yetkili").replace("authorized", "Yetkili").replace("fansubowner", "Fansub Sahibi").replace("fansubemployee", "Fansub Çalışanı").replace("translator", "Çevirmen").replace("editor", "Editör").replace("verified", "Doğrulanmış").replace("olduser", "Eski Kullanıcı").replace("betauser", "Beta Kullanıcısı").replace("user", "Kullanıcı") }}
            </span>
        </div>
        </div><br/>
        <div class="card">
            <figure>
                <img :src="userinfo.data.value.data.result.banner"/>
            </figure>
    </div>
    </div>
</template>
<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig();
const username = route.params.username
const userinfo = await useFetch(`https://cdn.falsis.ga/mangile/user?token=${runtimeConfig.public.token}&username=${username}`)
const name = userinfo.data.value.data.result.name
const useravatar = userinfo.data.value.data.result.avatar
const isMod = userinfo.data.value.data.result.badges.includes("authorized")
const isowner = true
const isUserAdmin = true
definePageMeta({
    layout: "list",
})
</script>