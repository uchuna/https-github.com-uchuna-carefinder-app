import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: false,
    user: null as null | { email: string },
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        // Perform authentication logic here
        this.isLoggedIn = true;
        this.user = { email }; // Assign the user object with email
        return true;
      } catch (error) {
        console.error("Error logging in:", error);
        return false;
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null; 
    },
  },
});

export default useUserStore;