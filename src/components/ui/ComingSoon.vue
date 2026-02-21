<template>
  <div class="relative min-h-screen overflow-hidden bg-[#0b0f19] text-white flex items-center justify-center">

    <!-- BACKGROUND GRADIENT -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-black to-purple-900/40"></div>

    <!-- FLOATING PARTICLES -->
    <div class="absolute inset-0 pointer-events-none">
      <span
        v-for="i in 30"
        :key="i"
        class="particle"
        :style="particleStyle(i)"
      ></span>
    </div>

    <!-- CONTENT -->
    <div class="relative z-10 text-center px-6 max-w-3xl">

      <!-- Logo -->
      <h1 class="text-5xl md:text-7xl font-extrabold tracking-wide mb-6 animate-title">
        MovieBox
      </h1>

      <!-- Subtitle -->
      <h2 class="text-2xl md:text-3xl font-semibold text-accent mb-4 animate-fade">
        Something Awesome is Coming 🎬
      </h2>

      <p class="text-gray-400 mb-10 animate-fade delay-200">
        We’re crafting a better cinematic experience for you.
      </p>

      <!-- COUNTDOWN -->
      <div class="flex justify-center gap-6 md:gap-10 text-center">

        <div class="time-box">
          <span class="time">{{ timeLeft.days }}</span>
          <span class="label">Days</span>
        </div>

        <div class="time-box">
          <span class="time">{{ timeLeft.hours }}</span>
          <span class="label">Hours</span>
        </div>

        <div class="time-box">
          <span class="time">{{ timeLeft.minutes }}</span>
          <span class="label">Minutes</span>
        </div>

        <div class="time-box">
          <span class="time">{{ timeLeft.seconds }}</span>
          <span class="label">Seconds</span>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const launchDate = new Date();
launchDate.setDate(launchDate.getDate() + 12); // change launch day

const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

let timer: any;

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = launchDate.getTime() - now;

  if (distance <= 0) return;

  timeLeft.value = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / 1000 / 60) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
};

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => clearInterval(timer));

/* particles */
const particleStyle = (i: number) => ({
  left: Math.random() * 100 + "%",
  animationDelay: Math.random() * 20 + "s",
  animationDuration: 15 + Math.random() * 20 + "s",
  opacity: 0.2 + Math.random() * 0.5,
  width: 2 + Math.random() * 4 + "px",
  height: 2 + Math.random() * 4 + "px",
});
</script>

<style scoped>
/* floating particles */
.particle {
  position: absolute;
  bottom: -10px;
  background: white;
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  from { transform: translateY(0); }
  to { transform: translateY(-110vh); }
}

/* title glow animation */
.animate-title {
  animation: titleReveal 1.2s ease-out forwards;
}

@keyframes titleReveal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    text-shadow: 0 0 0px rgba(255,255,255,0);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    text-shadow: 0 0 25px rgba(139,92,246,.6);
  }
}

.animate-fade {
  opacity: 0;
  animation: fadeUp 1s ease forwards;
}

.delay-200 { animation-delay: .2s }

@keyframes fadeUp {
  from { opacity:0; transform:translateY(20px); }
  to { opacity:1; transform:translateY(0); }
}

/* countdown boxes */
.time-box {
  display:flex;
  flex-direction:column;
  align-items:center;
}

.time {
  font-size:2.5rem;
  font-weight:800;
  background: linear-gradient(135deg,#a78bfa,#22d3ee);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.label {
  font-size:.8rem;
  color:#9ca3af;
  letter-spacing:.1em;
}
</style>