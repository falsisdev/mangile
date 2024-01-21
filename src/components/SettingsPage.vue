<script setup>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

function theme() {
  if (document.getElementById("theme").value) {
    cookies.set(
      "theme",
      document.getElementById("theme").value ==
        "Drakula (Karanlık) [Önerilen] [Varsayılan]"
        ? "dracula"
        : document.getElementById("theme").value == "Cadılar Bayramı (Karanlık)"
        ? "halloween"
        : document.getElementById("theme").value == "Orman (Karanlık)"
        ? "forest"
        : document.getElementById("theme").value == "Siyah (Karanlık)"
        ? "black"
        : document.getElementById("theme").value == "Lüks (Karanlık)"
        ? "luxury"
        : document.getElementById("theme").value == "Gece (Karanlık) [Önerilen]"
        ? "night"
        : document.getElementById("theme").value == "İşletme (Karanlık)"
        ? "business"
        : document.getElementById("theme").value == "Kahve (Karanlık)"
        ? "coffee"
        : document.getElementById("theme").value == "Bahçe (Aydınlık)"
        ? "garden"
        : document.getElementById("theme").value == "Güz (Aydınlık)"
        ? "autumn"
        : document.getElementById("theme").value == "Kış (Aydınlık)"
        ? "winter"
        : "dracula"
    );
    window.location.reload();
  } else {
    window.location.reload();
  }
}
</script>
<template>
  <article class="prose max-w-none">
    <h2>Ayarlar</h2>
  </article>
  Mangile site ayarlarına hoşgeldiniz. Aşağıdan dilediğiniz tema ayarlarını
  yapabilirsiniz.
  <p class="py-4">
    Aşağıdan İstediğiniz Temayı seçiniz.
    <br />
    <select id="theme" class="select w-full max-w-xs">
      <option>Tema Seç</option>
      <option id="halloween">Cadılar Bayramı (Karanlık)</option>
      <option id="forest">Orman (Karanlık)</option>
      <option id="black">Siyah (Karanlık)</option>
      <option id="luxury">Lüks (Karanlık)</option>
      <option id="dracula">Drakula (Karanlık) [Önerilen] [Varsayılan]</option>
      <option id="night">Gece (Karanlık) [Önerilen]</option>
      <option id="business">İşletme (Karanlık)</option>
      <option id="coffee">Kahve (Karanlık)</option>
      <option id="garden">Bahçe (Aydınlık)</option>
      <option id="autumn">Güz (Aydınlık)</option>
      <option id="winter">Kış (Aydınlık)</option>
    </select>
  </p>
  <h2>Tema Önizlemeleri:</h2>
  <div class="flex flex-row flex-wrap">
    <div
      data-theme="halloween"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Cadılar Bayramı</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      data-theme="forest"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Orman</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      data-theme="black"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Siyah</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      data-theme="luxury"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Lüks</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      data-theme="dracula"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Drakula</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      data-theme="night"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Gece</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      data-theme="business"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">İşletme</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      data-theme="coffee"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Kahve</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
      <div></div>
    </div>

    <div
      data-theme="garden"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Bahçe</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
    </div>

    <div
      data-theme="autumn"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Güz</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
    </div>

    <div
      data-theme="winter"
      class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2 m-2"
    >
      <div class="font-bold">Kış</div>
      <div class="flex flex-wrap gap-1">
        <div
          class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div
          class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
        >
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
    </div>
    <div class="modal-action m-2">
      <label for="my-modal-6" class="btn" @click="theme()"
        >Değişiklikleri Kaydet</label
      >
    </div>
  </div>
</template>
