<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-80">
      <!-- <h2 class="text-2xl font-bold mb-4">Sign Up</h2> -->
      <input type="text" v-model="user.firstName" placeholder="First Name" 
             class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none 
             focus:border-blue-500">
      <input type="text" v-model="user.lastName" placeholder="Last Name" 
             class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none 
             focus:border-blue-500">
      <input type="email" v-model="user.email" placeholder="Email" 
             class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none 
             focus:border-blue-500">
      <input type="password" v-model="user.password" placeholder="Password" 
             class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none 
             focus:border-blue-500">
      <input type="password" v-model="user.confirmPassword" placeholder="Confirm Password" 
             class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none 
             focus:border-blue-500">
      <button @click="signup" :disabled="isSubmitting" 
              class="w-full bg-green-500 text-white py-2 px-4 rounded-md 
              hover:bg-green-600 focus:outline-none focus:bg-blue-600 
              transition duration-200">
        {{ isSubmitting ? 'Signing Up...' : 'Sign Up' }}
      </button>
      <p class="text-center mt-4 text-sm text-gray-600">
        Already have an account? 
        <router-link to="/login" class="text-blue-600 hover:underline">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import { createUser } from '@/services';

const router = useRouter();

const user = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const isSubmitting = ref(false);

const userRules = {
  firstName: { required },
  lastName: { required },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  confirmPassword: {
    required,
    minLength: minLength(8),
    sameAs: sameAs(() => user.value.password)
  }
};

const v$ = useVuelidate(userRules, user);

const signup = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    isSubmitting.value = true;

    const response = await createUserWithEmailAndPassword(
      auth,
      user.value.email,
      user.value.password
    );

    if (response.user) {
      localStorage.setItem('isLoggedIn', 'true');

      await createUser({
        userId: response.user.uid,
        firstName: user.value.firstName,
        lastName: user.value.lastName
      });

      router.push('/HospitalSearch');
    }
  } catch (error: any) {
    console.error(error);
    
  } finally {
    isSubmitting.value = false;
  }
};
</script>