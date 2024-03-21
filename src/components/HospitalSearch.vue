<template>
  <div class="p-4">
    <p class="text-gray-600 ml- mt-20 py-8">Find hospitals close to you</p>
    <div class="flex justify-center mb-10 gap-5">

      <!-- All states dropdown -->
      <div class="relative">
        <input type="text" v-model="stateSearchQuery" placeholder="States..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="toggleStateDropdown">

        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleStateDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>

        <div v-show="showStateDropdown" class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="state in allStates" @click="selectState(state)" :key="state"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ state }}
            </li>
          </ul>
        </div>
      </div>

      <!-- All providers dropdown -->
      <div class="relative">
        <input type="text" v-model="providerSearchQuery" placeholder="Providers..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="toggleProviderDropdown">
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleProviderDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <div v-show="showProviderDropdown"
          class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="provider in allProviders" @click="selectProvider(provider)" :key="provider"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ provider }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Search Hospitals input -->
      <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-md">

      <!-- Search button -->
      <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div>

    <!-- HospitalForm -->
    <HospitalForm />

    <!-- Markdown Component -->
    <markdown-editor v-model="markdownContent" @file-uploaded="handleFileUpload" />

    <!-- Pass the hospitals data down to HospitalListDisplay component -->
    <HospitalListDisplay :hospitals="hospitals" :allStates="allStates" :allProviders="allProviders" @edit-hospital="handleEditHospital" @update-hospital="updateHospital" />

    <!-- HospitalExport component -->
    <HospitalExport />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import HospitalExport from '@/components/HospitalExport.vue';
import HospitalForm from '@/components/HospitalForm.vue';
import hospitals from '@/utils/hospitals';
import { type Hospital } from '@/utils/hospitals';
import { checkAuthentication } from '@/utils/authUtils';

export default defineComponent({
  components: {
    HospitalExport,
    HospitalListDisplay,
    HospitalForm,
  },
  data() {
    return {
      searchQuery: '',
      stateSearchQuery: '',
      providerSearchQuery: '',
      hospitals: [] as Hospital[],
      timer: 0,
      markdownContent: '',
      showStateDropdown: false,
      showProviderDropdown: false,
      allStates: [
        'All state', 'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
        'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
        'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
      ], // Populate with all states
      allProviders: [
        'Clinic', 'Dental Clinic', 'Dermatological Center', 'Ent', 'Gym', 'Hospital', 'Optical Center', 'Orthopedic Center', 'Physiotherapy Clinic',
        'Psychiatry Center', 'Psychotherapy Center', 'Spa', 'Tertiary Care Center',
      ], // Populate with all providers
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
  let filteredHospitals = this.hospitals;

  if (Array.isArray(this.stateSearchQuery) && this.stateSearchQuery.length > 0 && !this.stateSearchQuery.includes('All state')) {
    const selectedStates: string[] = this.stateSearchQuery.map((state: string) => state.toLowerCase());
    filteredHospitals = filteredHospitals.filter(hospital =>
      selectedStates.includes(hospital.state.toLowerCase())
    );
  }

  if (this.providerSearchQuery) {
    filteredHospitals = filteredHospitals.filter(hospital =>
      hospital.provider.toLowerCase().includes(this.providerSearchQuery.toLowerCase())
    );
  }

  if (this.searchQuery) {
    const query = this.searchQuery.toLowerCase().trim();
    filteredHospitals = filteredHospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(query) ||
      hospital.address.toLowerCase().includes(query) ||
      hospital.phoneNumber.includes(query) ||
      (hospital.email && hospital.email.toLowerCase().includes(query))
    );
  }

      return filteredHospitals;
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          let filteredHospitals = hospitals;

          // Filter by search query
          if (this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase().trim();
            filteredHospitals = filteredHospitals.filter(hospital =>
              hospital.name.toLowerCase().includes(query)
            );
          }

          // Filter by selected state
          if (this.stateSearchQuery.trim() !== '' && this.stateSearchQuery !== 'All state') {
            const selectedState = this.stateSearchQuery;
            filteredHospitals = filteredHospitals.filter(hospital =>
              hospital.state.toLowerCase() === selectedState.toLowerCase()
            );
          }

          // Filter by selected provider
          if (this.providerSearchQuery.trim() !== '') {
            const selectedProvider = this.providerSearchQuery;
            filteredHospitals = filteredHospitals.filter(hospital =>
              hospital.provider.toLowerCase() === selectedProvider.toLowerCase()
            );
          }

          // Update hospitals data after filtering
          this.hospitals = filteredHospitals;
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    async fetchHospitals() {
      // Simulated API call
      return [];
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    handleLoginPrompt() {
      alert('Please login or sign up to edit hospitals.'); // You can customize this to show a modal or redirect to the login/signup page
    },
    handleEditClick() {
      if (this.checkAuthentication()) {
        console.log('User is authenticated. Handling edit click...');
      } else {
        this.handleLoginPrompt();
      }
    },
    toggleStateDropdown() {
      this.showStateDropdown = !this.showStateDropdown;
    },
    toggleProviderDropdown() {
      this.showProviderDropdown = !this.showProviderDropdown;
    },
    selectState(state: string) {
      this.stateSearchQuery = state;
      // Close the dropdown immediately after selecting a state
      this.showStateDropdown = false;
    },
    selectProvider(provider: string) {
      this.providerSearchQuery = provider;
      this.showProviderDropdown = false;
    },
    checkAuthentication() {
      return checkAuthentication(); // Call the checkAuthentication function to verify the user's authentication status
    },
    handleFileUpload(file: File) {
      // Handle file upload logic here
      console.log('File uploaded:', file);
    }
  },
});
</script>

<style scoped></style>








<!-- <template>
  <div class="p-4">
    <h3 class="text-gray-600 ml- mt-20 py-8">Find hospitals close to you</h3>
    <div class="flex justify-center mb-10 gap-5"> -->

      <!-- All states dropdown -->
      <!-- <div class="relative">
        <input type="text" v-model="stateSearchQuery" placeholder="States..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="toggleStateDropdown">

        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleStateDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>

        <div v-show="showStateDropdown" class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="state in allStates" @click="selectState(state)" :key="state"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ state }}
            </li>
          </ul>
        </div>
      </div> -->

      <!-- All providers dropdown -->
      <!-- <div class="relative">
        <input type="text" v-model="providerSearchQuery" placeholder="Providers..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="toggleProviderDropdown">
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleProviderDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <div v-show="showProviderDropdown"
          class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="provider in allProviders" @click="selectProvider(provider)" :key="provider"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ provider }}
            </li>
          </ul>
        </div>
      </div> -->

      <!-- Search Hospitals input -->
      <!-- <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-md"> -->

      <!-- Search button -->
      <!-- <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div> -->

    <!-- Edit form -->
    <!-- <div v-if="editMode">
      <h2 class="py-10">Edit Hospital</h2>
      <form @submit.prevent="updateHospital" class="flex justify-center p-10">
        <input type="text" v-model="editedHospital.name" placeholder="Hospital Name">
        <input type="text" v-model="editedHospital.address" placeholder="Hospital Address">
        <input type="text" v-model="editedHospital.phoneNumber" placeholder="Hospital Phone Number">
        <input type="text" v-model="editedHospital.email" placeholder="Hospital Email">
        <button @click="handleEditClick" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md"
          v-if="checkAuthentication()">Update</button>
        <button @click="handleLoginPrompt" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md" v-else>Login
          to Edit</button>
        <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
      </form>
    </div> -->

    <!-- HospitalForm -->
    <!-- <HospitalForm /> -->

    <!-- Markdown Component -->
    <!-- <markdown-editor v-model="markdownContent" @file-uploaded="handleFileUpload" /> -->

    <!-- Pass the hospitals data down to HospitalListDisplay component -->
    <!-- <HospitalListDisplay :h="dataFromApi" :hospitals="filteredHospitals" :allStates="allStates"
      :allProviders="allProviders" @edit-hospital="handleEditHospital" @update-hospital="updateHospital" /> -->

    <!-- HospitalExport component -->
    <!-- <HospitalExport />
  </div>
</template> -->

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import HospitalExport from '@/components/HospitalExport.vue';
import HospitalForm from '@/components/HospitalForm.vue';
import hospitals from '@/utils/hospitals';
import { type Hospital } from '@/utils/hospitals';
import { checkAuthentication } from '@/utils/authUtils';

export default defineComponent({
  components: {
    HospitalExport,
    HospitalListDisplay,
    HospitalForm,
  },
  data() {
    return {
      searchQuery: '',
      stateSearchQuery: '',
      providerSearchQuery: '',
      hospitals: [...hospitals] as Hospital[],
      timer: 0,
      markdownContent: '',
      showStateDropdown: false,
      showProviderDropdown: false,
      allStates: [
        'All state', 'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
        'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
        'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
      ], // Populate with all states
      allProviders: [
        'Clinic', 'Dental Clinic', 'Dermatological Center', 'Ent', 'Gym', 'Hospital', 'Optical Center', 'Orthopedic Center', 'Physiotherapy Clinic',
        'Psychiatry Center', 'Psychotherapy Center', 'Spa', 'Tertiary Care Center',
      ], // Populate with all providers
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      let filteredHospitals = this.dataFromApi; // Use the fetched hospital data

      if (this.stateSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.state.toLowerCase().includes(this.stateSearchQuery.toLowerCase())
        );
      }

      if (this.providerSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.provider.toLowerCase().includes(this.providerSearchQuery.toLowerCase())
        );
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.phoneNumber.includes(query) ||
          (hospital.email && hospital.email.toLowerCase().includes(query))
        );
      }

      return filteredHospitals;
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          // Simulated asynchronous data fetching
          // this.hospitals = hospitals;
          this.hospitals = [];

          this.hospitals = await this.fetchHospitals();
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    async fetchHospitals() {
     
      return [];
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    handleLoginPrompt() {
      alert('Please login or sign up to edit hospitals.'); // You can customize this to show a modal or redirect to the login/signup page
    },
    handleEditClick() {
      if (this.checkAuthentication()) {
        console.log('User is authenticated. Handling edit click...');
      } else {
        this.handleLoginPrompt();
      }
    },
    toggleStateDropdown() {
      this.showStateDropdown = !this.showStateDropdown;
    },
    toggleProviderDropdown() {
      this.showProviderDropdown = !this.showProviderDropdown;
    },
    selectState(state: string) {
      this.stateSearchQuery = state;
      // Close the dropdown immediately after selecting a state
      this.showStateDropdown = false;
    },
    selectProvider(provider: string) {
      this.providerSearchQuery = provider;
      this.showProviderDropdown = false;
    },
    checkAuthentication() {
      return checkAuthentication(); // Call the checkAuthentication function to verify the user's authentication status
    }
  },
  props: {
    allStates: {
      type: Array as () => string[],
      required: true,
    },
    allProviders: {
      type: Array as () => string[],
      required: true,
    },
  },
});
</script>

<style scoped></style> -->






<!-- <template>
  <div class="p-4">
    <h3 class="text-gray-600 ml- mt-20 py-8">Find hospitals close to you</h3>
    <div class="flex justify-center mb-10 gap-5"> -->

      <!-- All states dropdown -->
      <!-- <div class="relative">
        <input type="text" v-model="stateSearchQuery" placeholder="States..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="toggleStateDropdown">

        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleStateDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>

        <div v-show="showStateDropdown" class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="state in allStates" @click="selectState(state)" :key="state"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ state }}
            </li>
          </ul>
        </div>
      </div> -->

      <!-- All providers dropdown -->
      <!-- <div class="relative">
        <input type="text" v-model="providerSearchQuery" placeholder="Providers..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="toggleProviderDropdown">
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleProviderDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <div v-show="showProviderDropdown"
          class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="provider in allProviders" @click="selectProvider(provider)" :key="provider"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ provider }}
            </li>
          </ul>
        </div>
      </div> -->

      <!-- Search Hospitals input -->
      <!-- <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-md"> -->

      <!-- Search button -->
      <!-- <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div> -->

    <!-- Edit form -->
    <!-- <div v-if="editMode">
      <h2 class="py-10">Edit Hospital</h2>
      <form @submit.prevent="updateHospital" class="flex justify-center p-10">
        <input type="text" v-model="editedHospital.name" placeholder="Hospital Name">
        <input type="text" v-model="editedHospital.address" placeholder="Hospital Address">
        <input type="text" v-model="editedHospital.phoneNumber" placeholder="Hospital Phone Number">
        <input type="text" v-model="editedHospital.email" placeholder="Hospital Email">
        <button @click="handleEditClick" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md"
          v-if="checkAuthentication()">Update</button>
        <button @click="handleLoginPrompt" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md" v-else>Login
          to Edit</button>
        <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
      </form>
    </div> -->

    <!-- HospitalForm -->
    <!-- <HospitalForm /> -->

    <!-- Markdown Component -->
    <!-- <markdown-editor v-model="markdownContent" @file-uploaded="handleFileUpload" /> -->

    <!-- Pass the hospitals data down to HospitalListDisplay component -->
    <!-- <HospitalListDisplay :h="dataFromApi" :hospitals="filteredHospitals" :allStates="allStates"
      :allProviders="allProviders" @edit-hospital="handleEditHospital" @update-hospital="updateHospital" /> -->

    <!-- HospitalExport component -->
    <!-- <HospitalExport />
  </div>
</template> -->

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import HospitalExport from '@/components/HospitalExport.vue';
import HospitalForm from '@/components/HospitalForm.vue';
import hospitals from '@/utils/hospitals';
import { type Hospital } from '@/utils/hospitals';
import { checkAuthentication } from '@/utils/authUtils';

export default defineComponent({
  components: {
    HospitalExport,
    HospitalListDisplay,
    HospitalForm,
  },
  data() {
    return {
      searchQuery: '',
      stateSearchQuery: '',
      providerSearchQuery: '',
      hospitals: [...hospitals] as Hospital[],
      timer: 0,
      markdownContent: '',
      showStateDropdown: false,
      showProviderDropdown: false,
      allStates: [
        'All state', 'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
        'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
        'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
      ], // Populate with all states
      allProviders: [
        'Clinic', 'Dental Clinic', 'Dermatological Center', 'Ent', 'Gym', 'Hospital', 'Optical Center', 'Orthopedic Center', 'Physiotherapy Clinic',
        'Psychiatry Center', 'Psychotherapy Center', 'Spa', 'Tertiary Care Center',
      ], // Populate with all providers
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      let filteredHospitals = this.dataFromApi; // Use the fetched hospital data

      if (this.stateSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.state.toLowerCase().includes(this.stateSearchQuery.toLowerCase())
        );
      }

      if (this.providerSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.provider.toLowerCase().includes(this.providerSearchQuery.toLowerCase())
        );
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.phoneNumber.includes(query) ||
          (hospital.email && hospital.email.toLowerCase().includes(query))
        );
      }

      return filteredHospitals;
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          // Simulated asynchronous data fetching
          // this.hospitals = hospitals;
          this.hospitals = [];

          this.hospitals = await this.fetchHospitals();
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    async fetchHospitals() {
      // Simulate fetching hospitals based on searchQuery, stateSearchQuery, providerSearchQuery
      // API call to fetch hospitals
      // I'm returning a sample array of hospitals
      return [];
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    handleLoginPrompt() {
      alert('Please login or sign up to edit hospitals.'); // You can customize this to show a modal or redirect to the login/signup page
    },
    handleEditClick() {
      if (this.checkAuthentication()) {
        console.log('User is authenticated. Handling edit click...');
      } else {
        this.handleLoginPrompt();
      }
    },
    toggleStateDropdown() {
      this.showStateDropdown = !this.showStateDropdown;
    },
    toggleProviderDropdown() {
      this.showProviderDropdown = !this.showProviderDropdown;
    },
    selectState(state: string) {
      this.stateSearchQuery = state;
      this.showStateDropdown = false;
    },
    selectProvider(provider: string) {
      this.providerSearchQuery = provider;
      this.showProviderDropdown = false;
    },
    checkAuthentication() {
      return checkAuthentication(); // Call the checkAuthentication function to verify the user's authentication status
    }
  },
  props: {
    allStates: {
      type: Array as () => string[],
      required: true,
    },
    allProviders: {
      type: Array as () => string[],
      required: true,
    },
  },
});
</script>

<style scoped></style> -->








<!-- <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import HospitalExport from '@/components/HospitalExport.vue';
import HospitalForm from '@/components/HospitalForm.vue';
import axios from 'axios';
import { Hospital } from '@/utils/hospitals'; // Import the Hospital interface
// import { checkAuthentication } from '@/utils/authUtils';

export default defineComponent({
  components: {
    HospitalExport,
    HospitalListDisplay,
    HospitalForm,
  },
  data() {
    return {
      searchQuery: '',
      stateSearchQuery: '',
      providerSearchQuery: '',
      hospitals: [] as Hospital[],
      timer: 0,
      markdownContent: '',
      showStateDropdown: false,
      showProviderDropdown: false,
      allStates: [
        'All state', 'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
        'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
        'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
      ], // Populate with all states
      allProviders: [
        'Clinic', 'Dental Clinic','Dermatological Center', 'Ent','Gym','Hospital', 'Optical Center', 'Orthopedic Center', 'Physiotherapy Clinic', 
        'Psychiatry Center','Psychotherapy Center', 'Spa', 'Tertiary Care Center',
      ], // Populate with all providers
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      let filteredHospitals = this.dataFromApi; // Use the fetched hospital data

      if (this.stateSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.state.toLowerCase().includes(this.stateSearchQuery.toLowerCase())
        );
      }

      if (this.providerSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.provider.toLowerCase().includes(this.providerSearchQuery.toLowerCase())
        );
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.phoneNumber.includes(query) ||
          (hospital.email && hospital.email.toLowerCase().includes(query))
        );
      }

      return filteredHospitals;
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          // Fetch hospitals asynchronously
          this.dataFromApi = await this.fetchHospitals();
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    async fetchHospitals(): Promise<Hospital[]> {
      try {
        const response = await axios.get('https://data.humdata.org/dataset/3b4a119a-309c-4d3f-900f-18a1f6ca2dfa/resource/5a3bdd13-3ada-4bf4-ac38-643390bc0562/download/nigeriahealthfacilities.json');
        console.log(response);
        return response.data;
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        return [];
      }
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    handleLoginPrompt() {
      alert('Please login or sign up to edit hospitals.'); 
    },
    handleEditClick() {
      if (this.checkAuthentication()) {
        console.log('User is authenticated. Handling edit click...');
      } else {
        this.handleLoginPrompt();
      }
    },
    toggleStateDropdown() {
      this.showStateDropdown = !this.showStateDropdown;
    },
    toggleProviderDropdown() {
      this.showProviderDropdown = !this.showProviderDropdown;
    },
    selectState(state: string) {
      this.stateSearchQuery = state;
      this.showStateDropdown = false;
    },
    selectProvider(provider: string) {
      this.providerSearchQuery = provider;
      this.showProviderDropdown = false;
    },
    checkAuthentication() {
      return checkAuthentication(); // Call the checkAuthentication function to verify the user's authentication status
  }
  },
  // props: {
  //   allStates: {
  //     type: Array as () => string[],
  //     required: true,
  //   },
  //   allProviders: {
  //     type: Array as () => string[],
  //     required: true,
  //   },
  // },
});
</script>

<style scoped>
</style> -->









<!-- <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import HospitalExport from '@/components/HospitalExport.vue';
import HospitalForm from '@/components/HospitalForm.vue';
import axios from 'axios';
// import hospitals from '@/utils/hospitals';
// import { type Hospital } from '@/utils/hospitals';
// import { checkAuthentication } from '@/utils/authUtils';

export default defineComponent({
  components: {
    HospitalExport,
    HospitalListDisplay,
    HospitalForm,
  },
  data() {
    return {
      searchQuery: '',
      stateSearchQuery: '',
      providerSearchQuery: '',
      hospitals: [] as Hospital[],
      timer: 0,
      markdownContent: '',
      showStateDropdown: false,
      showProviderDropdown: false,
      allStates: [
        'All state', 'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
        'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
        'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
      ], // Populate with all states
      allProviders: [
        'Clinic', 'Dental Clinic','Dermatological Center', 'Ent','Gym','Hospital', 'Optical Center', 'Orthopedic Center', 'Physiotherapy Clinic', 
        'Psychiatry Center','Psychotherapy Center', 'Spa', 'Tertiary Care Center',
      ], // Populate with all providers
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      let filteredHospitals = this.hospitals;

      if (this.stateSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.state.toLowerCase().includes(this.stateSearchQuery.toLowerCase())
        );
      }

      if (this.providerSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.provider.toLowerCase().includes(this.providerSearchQuery.toLowerCase())
        );
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.phoneNumber.includes(query) ||
          (hospital.email && hospital.email.toLowerCase().includes(query))
        );
      }

      return filteredHospitals;
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          // Simulated asynchronous data fetching
          this.hospitals = await this.fetchHospitals();
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    async fetchHospitals() {
      try {
        const response = await axios.get('https://data.humdata.org/dataset/3b4a119a-309c-4d3f-900f-18a1f6ca2dfa/resource/5a3bdd13-3ada-4bf4-ac38-643390bc0562/download/nigeriahealthfacilities.json');
        console.log(response);
        return response.data;
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        return [];
      }
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    handleLoginPrompt() {
      alert('Please login or sign up to edit hospitals.'); 
    },
    handleEditClick() {
      if (this.checkAuthentication()) {
        console.log('User is authenticated. Handling edit click...');
      } else {
        this.handleLoginPrompt();
      }
    },
    toggleStateDropdown() {
      this.showStateDropdown = !this.showStateDropdown;
    },
    toggleProviderDropdown() {
      this.showProviderDropdown = !this.showProviderDropdown;
    },
    selectState(state: string) {
      this.stateSearchQuery = state;
      this.showStateDropdown = false;
    },
    selectProvider(provider: string) {
      this.providerSearchQuery = provider;
      this.showProviderDropdown = false;
    },
    checkAuthentication() {
      return checkAuthentication(); // Call the checkAuthentication function to verify the user's authentication status
    }
  },
  // props: {
  //   allStates: {
  //     type: Array as () => string[],
  //     required: true,
  //   },
  //   allProviders: {
  //     type: Array as () => string[],
  //     required: true,
  //   },
  // },
});
</script>

<style scoped>
</style> -->















<!-- <template>
  <div class="p-4">
    <p class="text-gray-600 ml- mt-20 py-8">Find hospitals close to you</p>
    <div class="flex justify-center mb-10 gap-5"> -->
<!-- HospitalForm -->
<!-- <HospitalForm /> -->

<!-- All states dropdown -->
<!-- <div class="relative">
        <input type="text" v-model="stateSearchQuery" placeholder="States..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="toggleStateDropdown">

        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleStateDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>

        <div v-show="showStateDropdown" class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="state in allStates" @click="selectState(state)" :key="state"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ state }}
            </li>
          </ul>
        </div>
      </div> -->

<!-- All providers dropdown -->
<!-- <div class="relative">
        <input type="text" v-model="providerSearchQuery" placeholder="Providers..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="toggleProviderDropdown">
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleProviderDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <div v-show="showProviderDropdown"
          class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="provider in allProviders" @click="selectProvider(provider)" :key="provider"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ provider }}
            </li>
          </ul>
        </div>
      </div> -->

<!-- Search Hospitals input -->
<!-- <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-md"> -->

<!-- Search button -->
<!-- <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div> -->

<!-- Edit form -->
<!-- <div v-if="editMode">
      <h2 class="py-10">Edit Hospital</h2>
      <form @submit.prevent="updateHospital" class="flex justify-center p-10">
        <input type="text" v-model="editedHospital.name" placeholder="Hospital Name">
        <input type="text" v-model="editedHospital.address" placeholder="Hospital Address">
        <input type="text" v-model="editedHospital.phoneNumber" placeholder="Hospital Phone Number">
        <input type="text" v-model="editedHospital.email" placeholder="Hospital Email">
        <button @click="handleEditClick" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md"
          v-if="checkAuthentication()">Update</button>
        <button @click="handleLoginPrompt" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md" v-else>Login
          to Edit</button>
        <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
      </form>
    </div> -->

<!-- <div> -->

<!-- Markdown Component -->
<!-- <markdown-editor v-model="markdownContent" @file-uploaded="handleFileUpload" /> -->

<!-- Pass the hospitals data down to HospitalListDisplay component -->
<!-- <HospitalListDisplay :hospitals="filteredHospitals" :allStates="allStates"
      :allProviders="allProviders" @edit-hospital="handleEditHospital"
      @update-hospital="updateHospital" /> -->

<!-- HospitalExport component -->
<!-- <HospitalExport /> -->
<!-- </div> -->
<!-- </div>
</template> -->

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import HospitalExport from '@/components/HospitalExport.vue';
// import MarkdownEditor from '@/components/MarkdownEditor.vue';
import HospitalForm from '@/components/HospitalForm.vue'
import hospitals from '@/utils/hospitals';
import { type Hospital } from '@/utils/hospitals';
import { checkAuthentication } from '@/utils/authUtils';

export default defineComponent({
  components: {
    HospitalExport,
    HospitalListDisplay,
    // MarkdownEditor,
    HospitalForm,
  },
  data() {
    return {
      searchQuery: '',
      stateSearchQuery: '',
      providerSearchQuery: '',
      hospitals: [...hospitals] as Hospital[],
      timer: 0,
      markdownContent: '',
      // editMode: false,
      // editedHospital: {} as Hospital,
      showStateDropdown: false,
      showProviderDropdown: false,
      allStates: [
        'All state', 'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
        'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
        'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
      ], // Populate with all states
      allProviders: [
        'Clinic', 'Dental Clinic','Dermatological Center', 'Ent','Gym','Hospital', 'Optical Center', 'Orthopedic Center', 'Physiotherapy Clinic', 
        'Psychiatry Center','Psychotherapy Center', 'Spa', 'Tertiary Care Center',
      ], // Populate with all providers
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      let filteredHospitals = this.hospitals;

      if (this.stateSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.state.toLowerCase().includes(this.stateSearchQuery.toLowerCase())
        );
      }

      if (this.providerSearchQuery) {
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.provider.toLowerCase().includes(this.providerSearchQuery.toLowerCase())
        );
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        filteredHospitals = filteredHospitals.filter(hospital =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.phoneNumber.includes(query) ||
          (hospital.email && hospital.email.toLowerCase().includes(query))
        );
      }

      return filteredHospitals;
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          // Simulated asynchronous data fetching
          this.hospitals = await this.fetchHospitals();
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    async fetchHospitals() {
      // Simulate fetching hospitals based on searchQuery, stateSearchQuery, providerSearchQuery
      // API call to fetch hospitals
      // I'm returning a sample array of hospitals
      return [];
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    // cancelEdit() {
    //   this.editMode = false;
    //   this.editedHospital = {} as Hospital;
    },
    handleLoginPrompt() {
      alert('Please login or sign up to edit hospitals.'); 
    },
    handleEditClick() {
      if (this.checkAuthentication()) {
        console.log('User is authenticated. Handling edit click...');
      } else {
        this.handleLoginPrompt();
      }
    },
    toggleStateDropdown() {
      this.showStateDropdown = !this.showStateDropdown;
    },
    toggleProviderDropdown() {
      this.showProviderDropdown = !this.showProviderDropdown;
    },
    selectState(state: string) {
      this.stateSearchQuery = state;
      this.showStateDropdown = false;
    },
    selectProvider(provider: string) {
      this.providerSearchQuery = provider;
      this.showProviderDropdown = false;
    },
    checkAuthentication() {
      return checkAuthentication(); // Call the checkAuthentication function to verify the user's authentication status
    }
  },
  props: {
    allStates: {
      type: Array as () => string[],
      required: true,
    },
    allProviders: {
      type: Array as () => string[],
      required: true,
    },
  },
});
</script>

<style scoped>
</style> -->





<!-- <template>
  <div class="p-4">
    <p class="text-gray-600 ml- mt-20 py-8">Find hospitals close to you</p>
    <div class="flex justify-center mb-10 gap-5"> -->
<!-- All states dropdown -->
<!-- <div class="relative">
        <input type="text" v-model="stateSearchQuery" placeholder="States..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="showStateDropdown = !showStateDropdown">

        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleStateDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>

        <div v-show="showStateDropdown" class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="state in allStates" @click="selectState(state)" :key="state"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ state }}
            </li>
          </ul>
        </div>
      </div> -->

<!-- All providers dropdown -->
<!-- <div class="relative">
        <input type="text" v-model="providerSearchQuery" placeholder="Providers..."
          class="p-2 border border-gray-300 rounded-md mb-4 w-md" @click="showProviderDropdown = !showProviderDropdown">
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleProviderDropdown">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <div v-show="showProviderDropdown"
          class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-md">
          <ul class="py-2">
            <li v-for="provider in allProviders" @click="selectProvider(provider)" :key="provider"
              class="cursor-pointer hover:bg-gray-100 px-3 py-1">
              {{ provider }}
            </li>
          </ul>
        </div>
      </div> -->

<!-- Search Hospitals input -->
<!-- <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-md"> -->

<!-- Search button -->
<!-- <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div> -->

<!-- Edit form -->
<!-- <div v-if="editMode">
      <h2 class="py-10">Edit Hospital</h2>
      <form @submit.prevent="updateHospital" class="flex justify-center p-10">
        <input type="text" v-model="editedHospital.name" placeholder="Hospital Name">
        <input type="text" v-model="editedHospital.address" placeholder="Hospital Address">
        <input type="text" v-model="editedHospital.phoneNumber" placeholder="Hospital Phone Number">
        <input type="text" v-model="editedHospital.email" placeholder="Hospital Email">
        <button @click="handleEditClick" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md"
          v-if="checkAuthentication()">Update</button>
        <button @click="handleLoginPrompt" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md" v-else>Login
          to Edit</button>
        <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
      </form>
    </div> -->

<!-- Pass hospitals data down to HospitalListDisplay component -->
<!-- <HospitalListDisplay :hospitals="filteredHospitals" :allStates="allStates"
      :allProviders="allProviders" @edit-hospital="handleEditHospital"
      @update-hospital="updateHospital" /> -->

<!-- HospitalExport component -->
<!-- <HospitalExport />
  </div>
</template> -->

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import HospitalExport from '@/components/HospitalExport.vue';
import hospitals from '@/utils/hospitals';
import { type Hospital } from '@/utils/hospitals';
import { checkAuthentication } from '@/utils/authUtils';


export default defineComponent({
  components: {
    HospitalExport,
    HospitalListDisplay,
    
  },
  data() {
    return {
      searchQuery: '',
      stateSearchQuery: '',
      providerSearchQuery: '',
      hospitals: [...hospitals] as Hospital[],
      timer: 0,
      editMode: false,
      editedHospital: {} as Hospital,
      showStateDropdown: false,
      showProviderDropdown: false,
      // allStates: [
      //   'All state', 'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
      //   'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
      //   'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
      // ], // Populate with all states
      // allProviders: [
      //   'Clinic', 'Dental Clinic','Dermatological Center', 'Ent','Gym','Hospital', 'Optical Center', 'Orthopedic Center', 'Physiotherapy Clinic', 
      //   'Psychiatry Center','Psychotherapy Center', 'Spa', 'Tertiary Care Center',
      // ] // Populate with all providers
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        return this.hospitals;
      } else {
        return this.hospitals.filter(hospital => (
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.phoneNumber.includes(query) ||
          (hospital.email && hospital.email.toLowerCase().includes(query))
        ));
      }
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          // Simulated asynchronous data fetching
          // this.hospitals = hospitals;
          this.hospitals = [];

          this.hospitals = await this.fetchHospitals();
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    async fetchHospitals() {
      // Simulate fetching hospitals based on searchQuery, stateSearchQuery, providerSearchQuery
      // API call to fetch hospitals
      // I'm returning a sample array of hospitals
      return [];
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    handleLoginPrompt() {
      alert('Please login or sign up to edit hospitals.'); // You can customize this to show a modal or redirect to the login/signup page
    },
    handleEditClick() {
      if (this.checkAuthentication()) {
        console.log('User is authenticated. Handling edit click...');
      } else {
        this.handleLoginPrompt();
      }
    },
    toggleStateDropdown() {
      this.showStateDropdown = !this.showStateDropdown;
    },
    toggleProviderDropdown() {
      this.showProviderDropdown = !this.showProviderDropdown;
    },
    selectState(state: string) {
      this.stateSearchQuery = state;
      this.showStateDropdown = false;
    },
    selectProvider(provider: string) {
      this.providerSearchQuery = provider;
      this.showProviderDropdown = false;
    },
    checkAuthentication() {
      return checkAuthentication(); // Call the checkAuthentication function to verify the user's authentication status
    }
  },
  props: {
    allStates: {
      type: Array as () => string[],
      required: true,
    },
    allProviders: {
      type: Array as () => string[],
      required: true,
    },
  },
});
</script>

<style scoped>
/* Add your scoped styles here */
</style> -->




<!-- <template>
  <div class="p-4">
    <p class="text-gray-600 ml- mt-20 py-8">Find hospitals close to you</p>
    <div class="flex justify-center mb-10 gap-5">
      <input type="text" v-model="searchQuery" placeholder="All state..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-md">
      <input type="text" v-model="searchQuery" placeholder="All providers..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-md">
      <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-md">
      <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div> -->

<!-- Edit form -->
<!-- <div v-if="editMode">
      <h2 class="py-10">Edit Hospital</h2>
      <form @submit.prevent="updateHospital" class="flex justify-center p-10">
        <input type="text" v-model="editedHospital.name" placeholder="Hospital Name">
        <input type="text" v-model="editedHospital.address" placeholder="Hospital Address">
        <input type="text" v-model="editedHospital.phoneNumber" placeholder="Hospital Phone Number">
        <input type="text" v-model="editedHospital.email" placeholder="Hospital Email">
        <button @click="handleEditClick" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md" v-if="checkAuthentication()">Update</button>
        <button @click="handleLoginPrompt" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md" v-else>Login to Edit</button>
        <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
      </form>
    </div> -->
<!-- Pass hospitals data down to HospitalListDisplay component -->
<!-- <HospitalListDisplay :hospitals="filteredHospitals" @edit-hospital="handleEditHospital"
      @update-hospital="updateHospital" />
    <HospitalExport />
  </div>
</template> -->

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import HospitalExport from '@/components/HospitalExport.vue';
import hospitals from '@/utils/hospitals';
import { type Hospital } from '@/utils/hospitals';
import { checkAuthentication } from '@/utils/authUtils'; // Import the checkAuthentication function

export default defineComponent({
  components: {
    HospitalListDisplay,
    HospitalExport,
  },
  data() {
    return {
      searchQuery: '',
      hospitals: [...hospitals] as Hospital[],
      timer: 0,
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        return this.hospitals;
      } else {
        return this.hospitals.filter(hospital => (
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.phoneNumber.includes(query) ||
          (hospital.email && hospital.email.toLowerCase().includes(query))
        ));
      }
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          // Simulated asynchronous data fetching
          this.hospitals = hospitals;
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    handleLoginPrompt() {
      alert('Please login or sign up to edit hospitals.'); // You can customize this to show a modal or redirect to the login/signup page
    },
    handleEditClick() {
      // This method can be used to handle edit click events after login
    },
    checkAuthentication() {
      return checkAuthentication(); // Call the checkAuthentication function to verify the user's authentication status
    }
  }
});
</script> -->




<!-- <template>
  <div class="p-4">
    <p class="text-gray-600 ml- mt-20 py-8">Find hospitals close to you</p>
    <div class="flex justify-center mb-10 gap-5">
      <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
        class="p-2 border border-gray-300 rounded-md mb-4 w-full">
      <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div> -->

<!-- Edit form -->
<!-- <div v-if="editMode">
      <h2 class="py-10">Edit Hospital</h2>
      <form @submit.prevent="updateHospital" class="flex justify-center p-10">
        <input type="text" v-model="editedHospital.name" placeholder="Hospital Name">
        <input type="text" v-model="editedHospital.address" placeholder="Hospital Address">
        <input type="text" v-model="editedHospital.phoneNumber" placeholder="Hospital Phone Number">
        <input type="text" v-model="editedHospital.email" placeholder="Hospital Email">
        <button type="submit" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md ">Update</button>
        <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
      </form>
    </div> -->
<!-- Pass hospitals data down to HospitalListDisplay component -->
<!-- <HospitalListDisplay :hospitals="filteredHospitals" @edit-hospital="handleEditHospital"
      @update-hospital="updateHospital" />
    <HospitalExport />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
import { db } from '@/utils/firebase'; // Import Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import HospitalExport from '@/components/HospitalExport.vue';
import hospitals from '@/utils/hospitals'

interface Hospital {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email?: string;
}

export default defineComponent({
  components: {
    HospitalListDisplay,
    HospitalExport,
  },
  data() {
    return {
      searchQuery: '',
      hospitals: [...hospitals] as Hospital[],
      timer: 0,
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        return this.hospitals;
      } else {
        return this.hospitals.filter(hospital => (
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.phoneNumber.includes(query) ||
          (hospital.email && hospital.email.toLowerCase().includes(query))
        ));
      }
    }
  },
  methods: {
    async search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        try {
          const hospitalsCollection = collection(db, 'hospitals');
          const querySnapshot = await getDocs(hospitalsCollection);
          const hospitals: Hospital[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            if (data) {
              const hospital: Hospital = {
                id: doc.id,
                name: data.name || '',
                address: data.address || '',
                phoneNumber: data.phoneNumber || '',
                email: data.email || ''
              };
              hospitals.push(hospital);
            }
          });
          this.hospitals = hospitals;
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      }, 300);
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      const index = this.hospitals.findIndex(hospital => hospital.id === this.editedHospital.id);
      if (index !== -1) {
        this.hospitals[index] = { ...this.editedHospital };
      } else {
        console.error('Hospital not found in the hospitals array.');
      }
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    }
  }
});
</script> -->






<!-- <template>
  <div class="p-4">
    <p class="text-gray-600 text-center mb-4">Find hospitals close to you</p>
    <div class="flex justify-center mb-10">
      <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
             class="p-2 border border-gray-300 rounded-md mb-4">
      <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div> -->

<!-- Edit form -->
<!-- <div v-if="editMode">
      <h2 class="py-10 mr-4">Edit Hospital</h2>
      <form @submit.prevent="updateHospital" class="flex justify-center p-10">
        <input type="text" v-model="editedHospital.name" placeholder="Hospital Name">
        <input type="text" v-model="editedHospital.address" placeholder="Hospital Address">
        <input type="text" v-model="editedHospital.phoneNumber" placeholder="Hospital Phone Number">
        <button type="submit" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md">Update</button>
        <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
      </form>
    </div>
    <HospitalListDisplay :hospitals="filteredHospitals" @edit-hospital="handleEditHospital"/>
  </div>
</template> -->

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';
// import { Hospital } from '@/path/to/Hospital.ts' // Import your Hospital interface or type

interface Hospital {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
}
export default defineComponent({
  components: {
    HospitalListDisplay
  },
  data() {
    return {
      searchQuery: '',
      hospitals: [
        { id: 1, name: 'Hospital A', address: '123 Amadu Bello way', phoneNumber: '2347065758585' },
        { id: 2, name: 'Hospital B', address: '456 Airport road', phoneNumber: '2347066768686' },
        { id: 3, name: 'Hospital C', address: '789 Maitama', phoneNumber: '2347067778787' },
      ] as Hospital[], // Ensure Hospital type is imported
      timer: 0,
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      if (!this.searchQuery.trim()) {
        return this.hospitals;
      } else {
        const query = this.searchQuery.toLowerCase();
        return this.hospitals.filter(hospital => {
          return (
            hospital.name.toLowerCase().includes(query) ||
            hospital.address.toLowerCase().includes(query) ||
            hospital.phoneNumber.includes(query)
          );
        });
      }
    }
  },
  methods: {
    search() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // Your search logic here
      }, 300);
    },
    handleEditHospital(hospital: Hospital) {
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      console.log('Updating hospital:', this.editedHospital);
      this.editMode = false;
      // You may want to update the hospital in your data array as well
    },
    cancelEdit() {
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    }
  }
});
</script> -->







<!-- <template>
  <div class="p-4">
    <p class="text-gray-600 text-center mb-4">Find hospitals close to you</p>
    <div class="flex justify-center mb-10">
      <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
             class="p-2 border border-gray-300 rounded-md mb-4">
      <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div>

    <HospitalListDisplay :hospitals="filteredHospitals" @edit-hospital="editHospital"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';

interface Hospital {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
}

export default defineComponent({
  components: {
    HospitalListDisplay
  },
  data() {
    return {
      searchQuery: '',
      hospitals: [
        { id: 1, name: 'Hospital A', address: '123 Amadu Bello way', phoneNumber: '2347065758585' },
        { id: 2, name: 'Hospital B', address: '456 Airport road', phoneNumber: '2347066768686' },
        { id: 3, name: 'Hospital C', address: '789 Maitama', phoneNumber: '2347067778787' },
      ] as Hospital[],
      timer: 0, // Define the timer property
      editMode: false,
      editedHospital: {} as Hospital,
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      if (!this.searchQuery.trim()) {
        return this.hospitals; // If search query is empty, return all hospitals
      } else {
        const query = this.searchQuery.toLowerCase();
        return this.hospitals.filter(hospital => {
          // Filter hospitals based on name, address, or phone number
          return (hospital.name.toLowerCase().includes(query) ||
                  hospital.address.toLowerCase().includes(query) ||
                  hospital.phoneNumber.includes(query));
        });
      }
    }
  },
  methods: {
    search() {
      // Implement debouncing to delay the execution of the search function
      // Clear previous timer
      clearTimeout(this.timer);

      // Set a new timer to execute the search function after a delay
      this.timer = setTimeout(() => {
        // Your search logic here
        // For example, you can filter hospitals based on the search query
      }, 300); // Adjust the delay time as per your requirement
    },
    clearSearch() {
      // Clear the search query and reset the list of hospitals
      this.searchQuery = '';
    },
    editHospital(hospital: Hospital) {
      // Enable edit mode and set the edited hospital details
      this.editMode = true;
      this.editedHospital = { ...hospital };
    },
    updateHospital() {
      // Update the hospital details
      // Your logic to update the hospital here
      console.log('Updating hospital:', this.editedHospital);
      // After updating, reset edit mode
      this.editMode = false;
      // You may want to update the hospital in your data array as well
    },
    cancelEdit() {
      // Cancel the editing process
      // Reset edit mode and clear edited hospital details
      this.editMode = false;
      this.editedHospital = {} as Hospital;
    }
  }
});
</script> -->







<!-- <template>
  <div class="p-4">
    <p class="text-gray-600 text-center mb-4">Find hospitals close to you</p>
    <div class="flex justify-center mb-10">
      <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
             class="p-2 border border-gray-300 rounded-md mb-4">
      <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div>

<ul>
  <li v-for="hospital in filteredHospitals" :key="hospital.id">
    <span class="mr-20">{{ hospital.name }}</span>
    <span class="mr-20">{{ hospital.address }}</span>
    <span class="mr-20">{{ hospital.phoneNumber }}</span>
    <button @click="editHospital(hospital)" class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all duration-200">Edit</button>
  </li>
</ul> -->

<!-- Edit Form -->
<!-- <div v-if="editMode">
      <h2 class="py-7 mr-4">Edit Hospital</h2>
      <form @submit.prevent="updateHospital" class="flex justify-center">
        <input type="text" v-model="editedHospital.name" placeholder="Hospital Name">
        <input type="text" v-model="editedHospital.address" placeholder="Hospital Address">
        <input type="text" v-model="editedHospital.phoneNumber" placeholder="Hospital Phone Number">
        <button type="submit" class="px-3 bg-blue-400 text-white hover:bg-blue-600 rounded-md">Update</button>
        <button @click="cancelEdit" class="px-3 bg-red-400 text-white hover:bg-red-600 rounded-md">Cancel</button>
      </form>
    </div>
  </div>
  <HospitalListDisplay :hospitals="hospitals" @edit-hospital="editHospital"/>
</template> -->









<!-- <template>
  <div class="p-4">
    <p class="text-gray-600 text-center mb-4">Find hospitals close to you</p>
    <div class="flex justify-center mb-4">
      <input type="text" v-model="searchQuery" placeholder="Search Hospitals..."
             class="p-2 border border-gray-300 rounded-md mb-4">
      <button @click="search" class="bg-blue-500 text-white p-4 rounded-md 
      hover:bg-blue-600 transition-all duration-200 gap-5">Search</button>
    </div>

    <ul>
      <li v-for="hospital in filteredHospitals" :key="hospital.id">
        {{ hospital.name }} - {{ hospital.address }} - {{ hospital.phoneNumber }}
      </li>
    </ul>
  </div>
  <HospitalListDisplay :hospitals="hospitals" @edit-hospital="editHospital"/>
</template>

  <script lang="ts">
import { defineComponent } from 'vue';
import HospitalListDisplay from '@/components/HospitalListDisplay.vue';

interface Hospital {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
}

export default defineComponent({
  components: {
    HospitalListDisplay
  },
  data() {
    return {
      searchQuery: '',
      hospitals: [
        { id: 1, name: 'Hospital A', address: '123 Amadu Bello way', phoneNumber: '2347065758585' },
        { id: 2, name: 'Hospital B', address: '456 Airport road', phoneNumber: '2347066768686' },
        { id: 3, name: 'Hospital C', address: '789 Maitama', phoneNumber: '2347067778787' },
      ] as Hospital[],
      timer: 0 // Define the timer property
    };
  },
  computed: {
    filteredHospitals(): Hospital[] {
      if (!this.searchQuery.trim()) {
        return this.hospitals; // If search query is empty, return all hospitals
      } else {
        const query = this.searchQuery.toLowerCase();
        return this.hospitals.filter(hospital => {
          // Filter hospitals based on name, address, or phone number
          return (hospital.name.toLowerCase().includes(query) ||
                  hospital.address.toLowerCase().includes(query) ||
                  hospital.phoneNumber.includes(query));
        });
      }
    }
  },
  methods: {
    search() {
      // Implement debouncing to delay the execution of the search function
      // Clear previous timer
      clearTimeout(this.timer);

      // Set a new timer to execute the search function after a delay
      this.timer = setTimeout(() => {
        // Your search logic here
        // For example, you can filter hospitals based on the search query
      }, 300); // Adjust the delay time as per your requirement
    },
    clearSearch() {
      // Clear the search query and reset the list of hospitals
      this.searchQuery = '';
    },
    editHospital(hospital: Hospital) {
      // Logic to handle editing of the hospital
      console.log('Editing hospital:', hospital);
      // For example, you could display an edit form for the hospital
    }
  }
});
</script> -->import type HospitalFormVue from './HospitalForm.vue';import type HospitalExportVue from
'./HospitalExport.vue';
import type HospitalExportVue from './HospitalExport.vue';
