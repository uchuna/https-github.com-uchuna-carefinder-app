<template>
  <div>
    <h2 class="text-violet-500 bg-gray-300 text-center text-xl font-semibold mb-4 py-3">Hospital List</h2>

    <ul>
      <li v-for="hospital in displayedHospitals" :key="hospital.id">
        <!-- Hospital details -->
        <div class="flex justify-between">
          <div>
            <p class="font-semibold">{{ hospital.name }}</p>
            <p>{{ hospital.address }}</p>
            <p>{{ hospital.phoneNumber }}</p>
            <p>{{ hospital.email }}</p>
          </div>
          <button @click="editHospitalOrPrompt(hospital)" class="bg-green-500 text-white px-3 py-3 rounded-md hover:bg-green-600 transition-all duration-200">Edit</button>
        </div>
        <hr class="my-2 border-gray-300">
        <!-- Display the edit form if the current hospital is being edited -->
        <div v-if="editedHospital && editedHospital.id === hospital.id">
          <form @submit.prevent="updateHospital(hospital)" class="m-10">
            <input type="text" v-model="hospital.name" placeholder="Hospital Name">
            <input type="text" v-model="hospital.address" placeholder="Hospital Address">
            <input type="text" v-model="hospital.phoneNumber" placeholder="Hospital Phone Number">
            <input type="text" v-model="hospital.email" placeholder="Hospital Email">
            <button type="submit" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md">Update</button>
            <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
          </form>
        </div>
      </li>
    </ul>

    <!-- Pagination controls -->
    <div class="flex justify-center mt-4">
      <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-3 border border-rounded border-orange-300 text-orange-700 rounded-md mr-40">Previous</button>
      <span v-for="pageNumber in totalPages" :key="pageNumber">
        <button @click="currentPage = pageNumber" :style="{ backgroundColor: currentPage === pageNumber ? '#FFA500' : 'transparent', borderRadius: '50%', width: '30px', height: '30px', color: currentPage === pageNumber ? 'white' : 'black' }" class="hover:bg-blue-400 hover:text-white">{{ pageNumber }}</button>
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-3 border border-rounded border-orange-300 text-orange-700 rounded-md ml-40">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { type Hospital } from '@/utils/hospitals';
import router from '@/router';
import { checkAuthentication } from '@/utils/authUtils';

export default defineComponent({
  props: {
    hospitals: {
      type: Array as () => Hospital[],
      required: true
    },
    allStates: {
      type: Array as () => string[],
      required: true
    },
    allProviders: {
      type: Array as () => string[],
      required: true
    }
  },
  data() {
    return {
      editedHospital: null as Hospital | null, // Track the currently edited hospital
      currentPage: 1,
      pageSize: 5, // Number of hospitals per page
      selectedState: '', // Track the selected state
      selectedProvider: '', // Track the selected provider
    };
  },
  computed: {
    displayedHospitals(): Hospital[] {
      // Filter hospitals by state and provider
      let filteredHospitals = this.hospitals;
      if (this.selectedState) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.state === this.selectedState);
      }
      if (this.selectedProvider) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.provider === this.selectedProvider);
      }
      // Calculate pagination
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return filteredHospitals.slice(startIndex, endIndex);
    },
    totalPages(): number {
      // Calculate total pages based on filtered hospitals
      let filteredHospitals = this.hospitals;
      if (this.selectedState) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.state === this.selectedState);
      }
      if (this.selectedProvider) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.provider === this.selectedProvider);
      }
      return Math.ceil(filteredHospitals.length / this.pageSize);
    }
  },
  created() {
    // Display hospitals from all states by default
    this.selectedState = '';
  },
  methods: {
    editHospitalOrPrompt(hospital: Hospital) {
      // Check if the user is authenticated
      const isAuthenticated = checkAuthentication(); // Implement this function according to your authentication logic
      if (isAuthenticated) {
        this.editHospital(hospital);
      } else {
        // Redirect the user to the login page
        router.push('/login');
      }
    },
    editHospital(hospital: Hospital) {
      this.editedHospital = { ...hospital }; // Set the currently edited hospital
    },
    updateHospital(updatedHospital: Hospital) {
      // Emit an event to the parent component to handle the update operation
      this.$emit('update-hospital', updatedHospital);
      // Reset edit mode after updating
      this.editedHospital = null;
    },
    cancelEdit() {
      // Cancel the editing process
      this.editedHospital = null;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    filterByState() {
      // Reset current page to 1 when a state is selected
      this.currentPage = 1;
    },
    
    selectState(event: Event) {
      if (event.target instanceof HTMLSelectElement) {
        const selectedState = event.target.value;
        this.selectedState = selectedState;
        // Reset current page to 1 when a state is selected
        this.currentPage = 1;
      }
    },
    selectProvider(event: Event) {
      if (event.target instanceof HTMLSelectElement) {
        const selectedProvider = event.target.value;
        this.selectedProvider = selectedProvider;
        // Reset current page to 1 when a provider is selected
        this.currentPage = 1;
      }
    }
  }
});
</script>








<!-- <script lang="ts">
import { defineComponent } from 'vue';
import { type Hospital } from '@/utils/hospitals';
import router from '@/router';
import { checkAuthentication } from '@/utils/authUtils';

export default defineComponent({
  props: {
    hospitals: {
      type: Array as () => Hospital[],
      required: true
    },
    allStates: {
      type: Array as () => string[],
      required: true
    },
    allProviders: {
      type: Array as () => string[],
      required: true
    }
  },
  data() {
    return {
      editedHospital: null as Hospital | null, // Track the currently edited hospital
      currentPage: 1,
      pageSize: 5, // Number of hospitals per page
      selectedState: '', // Track the selected state
      selectedProvider: '', // Track the selected provider
    };
  },
  computed: {
    displayedHospitals(): Hospital[] {
      // Filter hospitals by state and provider
      let filteredHospitals = this.hospitals;
      if (this.selectedState) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.state === this.selectedState);
      }
      if (this.selectedProvider) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.provider === this.selectedProvider);
      }
      // Calculate pagination
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return filteredHospitals.slice(startIndex, endIndex);
    },
    totalPages(): number {
      // Calculate total pages based on filtered hospitals
      let filteredHospitals = this.hospitals;
      if (this.selectedState) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.state === this.selectedState);
      }
      if (this.selectedProvider) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.provider === this.selectedProvider);
      }
      return Math.ceil(filteredHospitals.length / this.pageSize);
    }
  },
  methods: {
    editHospitalOrPrompt(hospital: Hospital) {
      // Check if the user is authenticated
      const isAuthenticated = checkAuthentication(); // Implement this function according to your authentication logic
      if (isAuthenticated) {
        this.editHospital(hospital);
      } else {
        // Redirect the user to the login page
        router.push('/login');
      }
    },
    editHospital(hospital: Hospital) {
      this.editedHospital = { ...hospital }; // Set the currently edited hospital
    },
    updateHospital(updatedHospital: Hospital) {
      // Emit an event to the parent component to handle the update operation
      this.$emit('update-hospital', updatedHospital);
      // Reset edit mode after updating
      this.editedHospital = null;
    },
    cancelEdit() {
      // Cancel the editing process
      this.editedHospital = null;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    filterByState() {
      // Reset current page to 1 when a state is selected
      this.currentPage = 1;
    },
    
    selectState(event: Event) {
      if (event.target instanceof HTMLSelectElement) {
        const selectedState = event.target.value;
        this.selectedState = selectedState;
        // Reset current page to 1 when a state is selected
        this.currentPage = 1;
      }
    },
    selectProvider(event: Event) {
      if (event.target instanceof HTMLSelectElement) {
        const selectedProvider = event.target.value;
        this.selectedProvider = selectedProvider;
        // Reset current page to 1 when a provider is selected
        this.currentPage = 1;
      }
    }
  }
});
</script> -->