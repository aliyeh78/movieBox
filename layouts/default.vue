<template>
  <div class="min-h-screen bg-base text-text-primary">
    <!-- HEADER -->
<Header></Header>  

    <!-- PAGE CONTENT -->
    <main class="max-w-7xl mx-auto px-6 pt-10">
      <slot />
    </main>

    <!-- FOOTER -->
    <template>
      <footer class="bg-surface text-text.primary py-10 px-6 md:px-16">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo / Branding -->
          <div>
            <h1 class="text-2xl font-bold text-accent mb-3">MovieApp</h1>
            <p class="text-sm text-text.secondary">
              Discover and track your favorite movies and shows. Powered by TMDB
              API.
            </p>
          </div>

          <!-- Navigation Links -->
          <div>
            <h2 class="text-lg font-semibold mb-3">Explore</h2>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="#" class="hover:text-accent transition">Now Playing</a>
              </li>
              <li>
                <a href="#" class="hover:text-accent transition">Top Rated</a>
              </li>
              <li>
                <a href="#" class="hover:text-accent transition">Upcoming</a>
              </li>
              <li>
                <a href="/about" class="hover:text-accent transition">About</a>
              </li>
            </ul>
          </div>

          <!-- Categories / Genres -->
          <div>
            <h2 class="text-lg font-semibold mb-3">Categories</h2>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="#" class="hover:text-accent transition">Movies</a>
              </li>
              <li>
                <a href="#" class="hover:text-accent transition">TV Shows</a>
              </li>
              <li>
                <a href="#" class="hover:text-accent transition">Streaming</a>
              </li>
              <li>
                <a href="#" class="hover:text-accent transition">In Theaters</a>
              </li>
            </ul>
          </div>

          <!-- Social / Contact -->
          <div>
            <h2 class="text-lg font-semibold mb-3">Follow Us</h2>
            <div class="flex items-center space-x-4">
              <a
                href="#"
                class="text-text.primary hover:text-accent transition"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22.23 5.924c-.793.352-1.64.59-2.53.696a4.415 4.415 0 001.94-2.436 8.823 8.823 0 01-2.797 1.07 4.403 4.403 0 00-7.497 4.012 12.494 12.494 0 01-9.062-4.6 4.39 4.39 0 001.36 5.87 4.372 4.372 0 01-1.994-.55v.055a4.407 4.407 0 003.533 4.32 4.41 4.41 0 01-1.987.075 4.409 4.409 0 004.115 3.062 8.822 8.822 0 01-5.463 1.885c-.356 0-.707-.02-1.054-.062a12.444 12.444 0 006.75 1.978c8.099 0 12.53-6.708 12.53-12.53 0-.19-.004-.382-.013-.572a8.936 8.936 0 002.195-2.27z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-text.primary hover:text-accent transition"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c-5.522 0-10 4.477-10 10 0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54v-2.203c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463h-1.26c-1.243 0-1.63.771-1.63 1.562v1.873h2.773l-.443 2.89h-2.33v6.987c4.781-.749 8.438-4.886 8.438-9.877 0-5.523-4.478-10-10-10z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom Copyright -->
        <div
          class="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-text.secondary"
        >
          © {{ new Date().getFullYear() }} MovieApp. All rights reserved.
        </div>
      </footer>
    </template>

   
  </div>
</template>

 <script setup lang="ts">
import Header from '~/components/layout/Header.vue';


      // Nothing needed here for now
    </script>

    <style scoped>
      footer a {
        transition: color 0.2s ease;
      }
    </style>