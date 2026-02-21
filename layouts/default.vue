<template>
  <div class="min-h-screen bg-base text-text-primary">
    <!-- HEADER -->
    <Header></Header>

    <!-- PAGE CONTENT -->
    <main class="max-w-7xl mx-auto px-6 pt-10">
      <slot />
    </main>

    <!-- FOOTER -->
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";

// Nothing needed here for now
</script>

<style scoped>
footer a {
  transition: color 0.2s ease;
}
</style>
