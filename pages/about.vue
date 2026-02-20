<template>
  <div class="about-page max-w-7xl mx-auto px-6 py-12 space-y-16">
    <!-- Hero Section -->
    <section class="text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
      <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
        We are passionate about building amazing web experiences and making
        technology accessible to everyone.
      </p>
    </section>

    <!-- Mission & Vision -->
    <section class="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
        <p class="text-gray-300">
          To create scalable, user-friendly web applications that empower
          businesses and delight users.
        </p>
      </div>
      <div>
        <h2 class="text-2xl font-semibold mb-4">Our Vision</h2>
        <p class="text-gray-300">
          To be the leading front-end development company, combining
          creativity, innovation, and cutting-edge technology.
        </p>
      </div>
    </section>

    <!-- Team Section -->
    <section>
      <h2 class="text-2xl font-semibold mb-8 text-center">Meet the Team</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <div
          v-for="member in team"
          :key="member.id"
          class="bg-zinc-900 rounded-xl overflow-hidden shadow hover:scale-105 transition"
        >
          <img
            :src="member.photo"
            :alt="member.name"
            class="w-full p-10 h-64 object-cover"
          />
          <div class="p-4 text-center">
            <h3 class="font-bold text-lg">{{ member.name }}</h3>
            <p class="text-gray-400 text-sm">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="grid md:grid-cols-3 gap-10 text-center">
      <div v-for="value in values" :key="value.title" class="space-y-4">
        <div class="text-4xl text-accent">{{ value.icon }}</div>
        <h3 class="font-semibold text-xl">{{ value.title }}</h3>
        <p class="text-gray-300">{{ value.description }}</p>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="text-center">
      <h2 class="text-2xl font-semibold mb-4">Join Us</h2>
      <p class="text-gray-300 mb-6">
        Interested in working with us or collaborating? Get in touch!
      </p>
      <NuxtLink
        to="/contact"
        class="px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:brightness-110 transition"
      >
        Contact Us
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
const team = [
  {
    id: 1,
    name: "Aliyeh Ansarian",
    role: "Front-end Developer",
    photo: "/girl.png",
  },
 {
    id: 2,
    name: "Aliyeh Ansarian",
    role: "Front-end Developer",
    photo: "/girl.png",
  },
   {
    id: 3,
    name: "Aliyeh Ansarian",
    role: "Front-end Developer",
    photo: "/girl.png",
  },
   {
    id: 4,
    name: "Aliyeh Ansarian",
    role: "Front-end Developer",
    photo: "/girl.png",
  },
  // Add more team members
];

const values = [
  {
    icon: "💡",
    title: "Innovation",
    description: "We create solutions that push the boundaries of technology.",
  },
  {
    icon: "🤝",
    title: "Collaboration",
    description: "Teamwork is at the core of everything we do.",
  },
  {
    icon: "⚡",
    title: "Performance",
    description: "Delivering fast, reliable, and scalable web apps.",
  },
];
</script>

<style scoped>
.about-page img {
  transition: transform 0.3s;
}
.about-page img:hover {
  transform: scale(1.05);
}
</style>