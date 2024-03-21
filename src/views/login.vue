<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-80">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <input type="email" v-model="email" placeholder="Email" class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500">
      <input type="password" v-model="password" placeholder="Password" class="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:border-blue-500">
      <button @click="handleLogin" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-200">Login</button>
      <button @click="handleLogout" class="w-full bg-red-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-200">Logout</button>
      <button> Don't have an account? 
        <router-link to="/signup" class="text-blue-600 hover:underline">Signup</router-link>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/utils/authUtils'
import { logout } from '@/utils/authUtils'

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
  await login(email.value, password.value);
  alert('Login successful!');
  // Redirect to the home page after successful login
  router.push('/');
  } catch (error: any) {
    alert(error.message);
  }
};

const handleLogout = async () => {
  try {
  await logout();
  alert('Logout successful!');
  // Redirect to the login page after successful logout
  router.push('/login');
  } catch (error: any) {
    alert(error.message);
  }
};

const handleSignup = () => {
  router.push('/signup');
};
</script>




<!-- <template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-80">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <input type="email" v-model="email" placeholder="Email" 
      class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none 
      focus:border-blue-500"
      >
      <input type="password" v-model="password" placeholder="Password" 
      class="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none 
      focus:border-blue-500"
      >
      <button @click="handleLogin" class="w-full bg-blue-500 text-white py-2 px-4 
      rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 
      transition duration-200"
      >
      Login
      </button>
      <button @click="handleLogout" class="w-full bg-red-500 text-white py-2 px-4 
      rounded-md mt-4 hover:bg-red-600 focus:outline-none focus:bg-red-600 
      transition duration-200"
      >
      Logout
      </button>
      <button> Don't have an account? 
        <router-link to="/signup" class="text-blue-600 hover:underline">Signup</router-link>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '@/utils/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    alert('Login successful!');
    // Redirect to the home page after successful login
    router.push('/');
  } catch (error: any) {
    alert(error.message);
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    alert('Logout successful!');
    // Redirect to the login page after successful logout
    router.push('/login');
  } catch (error: any) {
    alert(error.message);
  }
};

const handleSignup = () => {
  // Implement the logic for handling signup, such as redirecting to the signup page
  router.push('/signup');
};
</script> -->