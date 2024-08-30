<template>
  <div class="grid grid-cols-10">
    <div class="mx-20 my-5 col-span-8 col-start-2 col-end-10">
      <Navbar />
      <slot />
      <div class="divider" />
      <Footer />
    </div>
  </div>
</template>
