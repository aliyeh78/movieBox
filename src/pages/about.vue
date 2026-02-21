<template>
  <div class="bg-[#070b14] text-white overflow-hidden">
    <!-- HERO -->
    <section
      class="relative min-h-[85vh] flex items-center  justify-center text-center px-6"
    >
      <div class="absolute inset-0">
        <div
          class="absolute inset-0 bg-gradient-to-b from-indigo-900/30  via-black to-black"
        ></div>
        <div
          class="absolute inset-0 opacity-20 blur-[120px] bg-[radial-gradient(circle_at_center,#7c3aed,transparent_70%)]"
        ></div>
      </div>

      <div class="relative z-10  max-w-4xl space-y-8">
        <h1
          class="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight animate-fadeUp"
        >
          Discover Cinema
          <span class="block text-indigo-400">The Modern Way</span>
        </h1>

        <p
          class="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-fadeUp delay-200"
        >
          MovieBox is a cinematic exploration platform designed with real-world
          frontend architecture principles — performance, scalability and
          immersive user experience.
        </p>

        <div class="flex gap-4 justify-center animate-fadeUp delay-300">
          <div
            class="px-6 py-3 rounded-xl bg-indigo-500/90 hover:bg-indigo-400 transition font-semibold"
          >
            Explore Movies
          </div>
          <div
            class="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
          >
            Learn More
          </div>
        </div>
      </div>
    </section>

    <!-- PROJECT STORY -->
    <section
      class="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center"
    >
      <div class="space-y-6">
        <h2 class="text-4xl font-bold">Why This Project Exists</h2>
        <p class="text-gray-400 leading-relaxed">
          MovieBox is not just a UI demo — it's an architecture exercise. The
          goal was building a streaming-like experience using a maintainable
          structure, reusable components and realistic data flow patterns.
        </p>
        <p class="text-gray-400 leading-relaxed">
          Every section mimics real production challenges: loading states, SSR
          hydration, search debouncing, component isolation and API service
          abstraction.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div class="info-card">
          <span>⚡</span>
          <p>Fast Navigation</p>
        </div>
        <div class="info-card">
          <span>🎯</span>
          <p>Live Search</p>
        </div>
        <div class="info-card">
          <span>🧩</span>
          <p>Reusable UI</p>
        </div>
        <div class="info-card">
          <span>📱</span>
          <p>Responsive</p>
        </div>
      </div>
    </section>

    <!-- STACK -->
    <section class="bg-white/5 border-y border-white/10 py-24">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold mb-14">Technology</h2>
        <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div class="stack">Vue 3</div>
          <div class="stack">Nuxt 4</div>
          <div class="stack">TypeScript</div>
          <div class="stack">TMDB API</div>
        </div>
      </div>
    </section>

    <!-- ARCHITECTURE -->
    <section class="max-w-6xl mx-auto px-6 py-24">
      <h2 class="text-4xl font-bold text-center mb-16">
        Architecture Principles
      </h2>
      <div class="grid md:grid-cols-3 gap-10">
        <div class="feature">
          <h3>Component Isolation</h3>
          <p>
            Each UI block designed as reusable building unit similar to real
            product design systems.
          </p>
        </div>
        <div class="feature">
          <h3>Service Layer</h3>
          <p>
            API logic separated from UI for maintainability and scalability.
          </p>
        </div>
        <div class="feature">
          <h3>UX Driven</h3>
          <p>
            Loading skeletons, transitions and feedback make the app feel alive.
          </p>
        </div>
      </div>
    </section>

    <!-- FOOTER CTA -->
    <section
      class="text-center py-28 bg-gradient-to-b from-transparent to-black/60"
    >
      <h2 class="text-4xl font-bold mb-6">Built For Learning & Portfolio</h2>
      <p class="text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
        This project demonstrates real-world frontend engineering skills
        including SSR behavior, async UI states and scalable folder structure.
      </p>
      <div
        class="inline-block px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 transition font-semibold text-lg"
      >
        View Source Code
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-fadeUp {
  opacity: 0;
  transform: translateY(40px);
  animation: fadeUp 1s ease forwards;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.35s;
}
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 26px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 600;
  text-align: center;
  gap: 10px;
  transition: 0.25s;
}
.info-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.09);
}
.info-card span {
  font-size: 26px;
}

.stack {
  padding: 24px;
  border-radius: 20px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.02)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 700;
  transition: 0.3s;
}
.stack:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.feature {
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: 0.25s;
}
.feature:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.07);
}
.feature h3 {
  font-weight: 700;
  margin-bottom: 10px;
}
.feature p {
  color: #9ca3af;
  line-height: 1.6;
}
</style>
