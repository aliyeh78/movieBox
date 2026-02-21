<script setup>
import { ref } from 'vue'

/* ---------------- Overlay Toggle ---------------- */
const isLogin = ref(true)
const toggle = () => (isLogin.value = !isLogin.value)

/* ---------------- LOGIN ---------------- */
const loginForm = ref({
  email: '',
  password: ''
})

const loginErrors = ref({})

/* ---------------- SIGNUP ---------------- */
const signupForm = ref({
  name: '',
  email: '',
  password: ''
})

const signupErrors = ref({})

/* ---------------- Validation ---------------- */
const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const submitLogin = () => {
  loginErrors.value = {}

  if (!loginForm.value.email)
    loginErrors.value.email = 'Email is required'
  else if (!validateEmail(loginForm.value.email))
    loginErrors.value.email = 'Email is invalid'

  if (!loginForm.value.password)
    loginErrors.value.password = 'Password is required'
  else if (loginForm.value.password.length < 6)
    loginErrors.value.password = 'Minimum 6 characters'

  if (Object.keys(loginErrors.value).length === 0) {
    console.log('LOGIN OK', loginForm.value)
    // TODO: call API
  }
}

const submitSignup = () => {
  signupErrors.value = {}

  if (!signupForm.value.name)
    signupErrors.value.name = 'Name is required'

  if (!signupForm.value.email)
    signupErrors.value.email = 'Email is required'
  else if (!validateEmail(signupForm.value.email))
    signupErrors.value.email = 'Email is invalid'

  if (!signupForm.value.password)
    signupErrors.value.password = 'Password is required'
  else if (signupForm.value.password.length < 6)
    signupErrors.value.password = 'Minimum 6 characters'

  if (Object.keys(signupErrors.value).length === 0) {
    console.log('SIGNUP OK', signupForm.value)
    // TODO: call API
  }
}
</script>

<template>
  <div class="pb-10 flex items-center justify-center bg-[#0f172a] pb-10">

    <div class="relative w-[880px] h-[540px] rounded-2xl overflow-hidden flex shadow-[0_20px_80px_rgba(0,0,0,0.6)] bg-[#020617] border border-slate-800">

      <!-- LOGIN FORM -->
      <div class="w-1/2 flex items-center justify-center p-14">
        <form class="w-full max-w-sm space-y-6 text-slate-200">
          <h2 class="text-3xl font-bold text-white">Login</h2>

          <input
            v-model="loginForm.email"
            type="email"
            placeholder="Email"
            :class="[
              'w-full p-3 rounded-lg bg-slate-900/60 border focus:outline-none focus:ring-2 placeholder:text-slate-400',
              loginErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'
            ]"
          />
          <p v-if="loginErrors.email" class="text-red-400 text-sm -mt-4">{{ loginErrors.email }}</p>

          <input
            v-model="loginForm.password"
            type="password"
            placeholder="Password"
            :class="[
              'w-full p-3 rounded-lg bg-slate-900/60 border focus:outline-none focus:ring-2 placeholder:text-slate-400',
              loginErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'
            ]"
          />
          <p v-if="loginErrors.password" class="text-red-400 text-sm -mt-4">{{ loginErrors.password }}</p>

          <button
            type="button"
            @click="submitLogin"
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition shadow-lg shadow-indigo-900/40"
          >
            Login
          </button>
        </form>
      </div>

      <!-- SIGNUP FORM -->
      <div class="w-1/2 flex items-center justify-center p-14">
        <form class="w-full max-w-sm space-y-6 text-slate-200">
          <h2 class="text-3xl font-bold text-white">Create Account</h2>

          <input
            v-model="signupForm.name"
            type="text"
            placeholder="Name"
            :class="[
              'w-full p-3 rounded-lg bg-slate-900/60 border focus:outline-none focus:ring-2 placeholder:text-slate-400',
              signupErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'
            ]"
          />
          <p v-if="signupErrors.name" class="text-red-400 text-sm -mt-4">{{ signupErrors.name }}</p>

          <input
            v-model="signupForm.email"
            type="email"
            placeholder="Email"
            :class="[
              'w-full p-3 rounded-lg bg-slate-900/60 border focus:outline-none focus:ring-2 placeholder:text-slate-400',
              signupErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'
            ]"
          />
          <p v-if="signupErrors.email" class="text-red-400 text-sm -mt-4">{{ signupErrors.email }}</p>

          <input
            v-model="signupForm.password"
            type="password"
            placeholder="Password"
            :class="[
              'w-full p-3 rounded-lg bg-slate-900/60 border focus:outline-none focus:ring-2 placeholder:text-slate-400',
              signupErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'
            ]"
          />
          <p v-if="signupErrors.password" class="text-red-400 text-sm -mt-4">{{ signupErrors.password }}</p>

          <button
            type="button"
            @click="submitSignup"
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition shadow-lg shadow-indigo-900/40"
          >
            Sign Up
          </button>
        </form>
      </div>

      <!-- SLIDING OVERLAY -->
      <div
        class="absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center text-center p-12 transition-all duration-700 ease-in-out z-10
               bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600"
        :class="isLogin ? 'translate-x-full' : 'translate-x-0'"
      >
        <h2 class="text-3xl font-bold mb-4 text-white">
          {{ isLogin ? 'New Here?' : 'Welcome Back!' }}
        </h2>

        <p class="mb-6 max-w-xs text-indigo-100">
          {{
            isLogin
              ? 'Create an account and start tracking movies, ratings and favorites.'
              : 'Login to continue your movie journey and saved watchlist.'
          }}
        </p>

        <button
          @click="toggle"
          class="border border-white/70 text-white px-8 py-2 rounded-full hover:bg-white hover:text-indigo-700 transition font-medium"
        >
          {{ isLogin ? 'Sign Up' : 'Login' }}
        </button>
      </div>

    </div>
  </div>
</template>
