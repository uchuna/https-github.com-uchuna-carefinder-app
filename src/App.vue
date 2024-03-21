<template>
  <div class="container mx-auto p-8">
    <header class="py-3 fixed top-0 left-0 w-full bg-white shadow-lg z-10">
      <h1 class="font-times text-6xl font-bold ml-20">Care-Finder App</h1>
      <p class="font text-2xl text-blue-500 ml-20">Bringing health providers to you</p>
    </header>
    <router-view />
    <!-- <HospitalSearch /> -->
    <!-- <HospitalListDisplay /> -->
  </div>
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { useUserStore } from '@/stores/user';
import HospitalSearch from "./components/HospitalSearch.vue";

// const userStore = useUserStore();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;

    // Store the user's authentication state in localStorage
    localStorage.setItem("isLoggedIn", true.toString());

    console.log("User is signed in:", user);
    // Update the user store with the authenticated user's information
    // userStore.user = { isLoggedIn: true, ...user };
  } else {
    // Clear the authentication state from localStorage
    localStorage.removeItem("isLoggedIn");
    console.log("User is signed out");
    // Update the user store with the authenticated user's information
    // userStore.user = { isLoggedIn: false };
  }
});
</script>

<style scoped>
/* Add Tailwind CSS styles here */
.container {
  align-items: center;
}
.font-times {
  font-family: 'Times New Roman', serif;
}
.font {
  font-family: 'Bradley Hand Itc', serif;
}
</style>