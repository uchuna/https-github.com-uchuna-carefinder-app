<template>
  <div>
    <button @click="toggleFormVisibility" class="px-3 py-1 bg-blue-500 text-white rounded-md mb-4">
      {{ isNewHospital ? 'Create Hospital Entry' : 'Edit Hospital Entry' }}
    </button>

    <div v-if="isFormVisible">
      <h2 class="text-violet-500 bg-gray-300 text-center text-xl font-semibold mb-4 py-3">
        {{ isNewHospital ? 'Create' : 'Edit' }} Hospital Entry
      </h2>
    
      <form @submit.prevent="handleSubmit" class="mb-10">
        <div v-if="isNewHospital">
          <!-- Display ID field for new hospital entry -->
          <div>
            <label>ID:</label>
            <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.id" required />
          </div>
        </div>
        <div>
          <label>Name:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.name" required />
        </div>
        <div>
          <label>Address:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.address" required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.phoneNumber" required />
        </div>
        <div>
          <label>Email:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="email" v-model="hospital.email" />
        </div>
        <div>
          <label>State:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.state" required />
        </div>
        <div>
          <label>Provider:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.provider" required />
        </div>
        <div>
          <label>Markdown Content:</label>
          <markdown-editor v-model="hospital.markdownContent" class="mt-3 mb-3 ml-5 p-7 border border-gray-300 rounded-md w-full"/>
        </div>
        <button type="submit" class="px-3 py-1 bg-green-500 text-white rounded-md ml-2">{{ isNewHospital ? 'Create' : 'Save' }}</button>
        <button v-if="!isNewHospital" @click="cancelEdit">Cancel</button>
        <!-- <button @click="handleFileUpload">Upload File</button> -->
      </form>
    </div>
  </div>

  <MarkdownEditor />
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { ref } from 'vue';

export default {
  components: {
    MarkdownEditor,
  },
  props: {
    hospitalData: Object,
  },
  setup(props) {
    const isNewHospital = ref(true);
    const isFormVisible = ref(false);
    const hospital = ref({
      id: '',
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
      state: '',
      provider: '',
      markdownContent: '',
    });

    // Define any reactive variables or methods here
    const handleFileUpload = () => {
      // Implementation for file upload handling
      console.log('File uploaded');
    };

    const handleSubmit = async () => {
      try {
        // Your logic for saving hospital entry goes here
        alert('Hospital entry saved successfully!');
        
      } catch (error) {
        console.error('Error saving hospital entry:', error);
        alert('Error saving hospital entry. Please try again.');
      }
    };

    const toggleFormVisibility = () => {
      isFormVisible.value = !isFormVisible.value;
    };

    const cancelEdit = () => {
      isNewHospital.value = true;
      resetHospital();
    };

    const resetHospital = () => {
      hospital.value = {
        id: '',
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        state: '',
        provider: '',
        markdownContent: '',
      };
    };

    const initializeHospital = () => {
      if (props.hospitalData) {
        isNewHospital.value = false;
        hospital.value = { ...props.hospitalData };
      }
    };

    initializeHospital();

    return { handleFileUpload, isNewHospital, hospital, isFormVisible, handleSubmit, cancelEdit, toggleFormVisibility };
  },
};
</script>





<!-- <template>
  <div>
    <button @click="toggleFormVisibility" v-if="canCreateHospital" class="px-3 py-1 bg-blue-500 text-white rounded-md mb-4">
      {{ isNewHospital ? 'Create Hospital Entry' : 'Edit Hospital Entry' }}
    </button>

    <div v-if="isFormVisible">
      <h2 class="text-violet-500 bg-gray-300 text-center text-xl font-semibold mb-4 py-3">
        {{ isNewHospital ? 'Create' : 'Edit' }} Hospital Entry
      </h2>
    
      <form @submit.prevent="handleSubmit" class="mb-10">
        <div v-if="isNewHospital"> -->
          <!-- Display ID field for new hospital entry -->
          <!-- <div>
            <label>ID:</label>
            <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.id" required />
          </div>
        </div>
        <div>
          <label>Name:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.name" required />
        </div>
        <div>
          <label>Address:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.address" required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.phoneNumber" required />
        </div>
        <div>
          <label>Email:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="email" v-model="hospital.email" />
        </div>
        <div>
          <label>State:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.state" required />
        </div>
        <div>
          <label>Provider:</label>
          <input class="mt-3 mb-3 ml-5 border border-gray-300 rounded-md w-md" type="text" v-model="hospital.provider" required />
        </div>
        <div>
          <label>Markdown Content:</label>
          <markdown-editor v-model="hospital.markdownContent" class="mt-3 mb-3 ml-5 p-7 border border-gray-300 rounded-md w-full"/>
        </div>
        <button type="submit" class="px-3 py-1 bg-green-500 text-white rounded-md ml-2">{{ isNewHospital ? 'Create' : 'Save' }}</button>
        <button v-if="!isNewHospital" @click="cancelEdit">Cancel</button> -->
        <!-- <button @click="handleFileUpload">Upload File</button> -->
      <!-- </form>
    </div>
  </div>

  <MarkdownEditor />
</template> -->

<!-- <script>
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { ref } from 'vue';

// Hardcoded admin user
const adminUser = {
  username: 'Alex',
  role: 'admin',
  // Other user information
};

// Function to check if the current user is an admin
function isAdmin(currentUser) {
  return currentUser.username === adminUser.username && currentUser.role === 'admin';
}

export default {
  components: {
    MarkdownEditor,
  },
  props: {
    hospitalData: Object,
    userRole: String, 
    currentUser: Object,
  },
  setup(props) {
    const isNewHospital = ref(true);
    const isFormVisible = ref(false);
    const hospital = ref({
      id: '',
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
      state: '',
      provider: '',
      markdownContent: '',
      file: null,
    });

    // Define any reactive variables or methods here
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      hospital.value.file = file;
      // console.log('File uploaded');
    };

    const handleSubmit = async () => {
      try {
        if (isAdmin(props.currentUser)) {
        const formData = new FormData();
        formData.append('id', hospital.value.id);
        formData.append('name', hospital.value.name);
        formData.append('address', hospital.value.address);
        formData.append('phoneNumber', hospital.value.phoneNumber);
        formData.append('email', hospital.value.email);
        formData.append('state', hospital.value.state);
        formData.append('provider', hospital.value.provider);
        formData.append('markdownContent', hospital.value.markdownContent);
        formData.append('file', hospital.value.file); // Append file to form data

        console.log(formData);
      } else {
          throw new Error('Permission denied. Only admin users can create hospitals.');
        }
      } catch (error) {
        console.error('Error saving hospital entry:', error);
        alert('Error saving hospital entry. Please try again.');
      }
    };

    const toggleFormVisibility = () => {
      if (props.userRole === 'admin') { // Check user role before prompting
        const shouldProceed = window.confirm("Are you sure you want to create a new hospital entry?");
        if (shouldProceed) {
          isFormVisible.value = !isFormVisible.value;
        }
      } else {
        alert('You do not have permission to create a new hospital entry.');
      }
    };

    const cancelEdit = () => {
      isNewHospital.value = true;
      resetHospital();
    };

    const resetHospital = () => {
      hospital.value = {
        id: '',
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        state: '',
        provider: '',
        markdownContent: '',
        file: null,
      };
    };

    const initializeHospital = () => {
      if (props.hospitalData) {
        isNewHospital.value = false;
        hospital.value = { ...props.hospitalData };
      }
    };

    initializeHospital();

    return { handleFileUpload, isNewHospital, hospital, isFormVisible, handleSubmit, cancelEdit, toggleFormVisibility };
  },
};
</script> -->






<!-- <template>
  <div>
    <button @click="toggleFormVisibility" class="px-3 py-1 bg-blue-500 text-white rounded-md mb-4">
      {{ isNewHospital ? 'Create Hospital Entry' : 'Edit Hospital Entry' }}
    </button>

    <div v-if="isFormVisible">
      <h2 class="text-violet-500 bg-gray-300 text-center text-xl font-semibold mb-4 py-3">
        {{ isNewHospital ? 'Create' : 'Edit' }} Hospital Entry
      </h2>
    
    <form @submit.prevent="handleSubmit" class="mb-10">
      <div>
        <label>Name:</label>
        <input class="mt-3 mb-3" type="text" v-model="hospital.name" required />
      </div>
      <div>
        <label>Address:</label>
        <input class="mt-3 mb-3" type="text" v-model="hospital.address" required />
      </div>
      <div>
        <label>Phone Number:</label>
        <input class="mt-3 mb-3" type="text" v-model="hospital.phoneNumber" required />
      </div>
      <div>
        <label>Email:</label>
        <input class="mt-3 mb-3" type="email" v-model="hospital.email" />
      </div>
      <div>
        <label>State:</label>
        <input class="mt-3 mb-3" type="text" v-model="hospital.state" required />
      </div>
      <div>
        <label>Provider:</label>
        <input class="mt-3 mb-3" type="text" v-model="hospital.provider" required />
      </div>
      <div>
        <label>Markdown Content:</label>
        <markdown-editor v-model="hospital.markdownContent" class="mt-3 mb-3"/>
      </div>
      <button type="submit" class="px-3 py-1 bg-green-500 text-white rounded-md ml-2">{{ isNewHospital ? 'Create' : 'Save' }}</button>
      <button v-if="!isNewHospital" @click="cancelEdit">Cancel</button>
    </form>
  </div>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import axios from 'axios';
import { ref } from 'vue';

export default {
  components: {
    MarkdownEditor,
  },
  props: {
    hospitalData: Object,
  },
  setup(props) {
    const isNewHospital = ref(true);
    const isFormVisible = ref(false);
    const hospital = ref({
      id: '',
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
      state: '',
      provider: '',
      markdownContent: '',
    });

    const handleSubmit = async () => {
      try {
        if (isNewHospital.value) {
          await axios.post('/api/hospitals', hospital.value);
        } else {
          await axios.put(`/api/hospitals/${hospital.value.id}`, hospital.value);
        }
        alert('Hospital entry saved successfully!');
        
      } catch (error) {
        console.error('Error saving hospital entry:', error);
        alert('Error saving hospital entry. Please try again.');
      }
    };

    const toggleFormVisibility = () => {
      isFormVisible.value = !isFormVisible.value;
    };

    const cancelEdit = () => {
      isNewHospital.value = true;
      resetHospital();
    };

    const resetHospital = () => {
      hospital.value = {
        id: '',
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        state: '',
        provider: '',
        markdownContent: '',
      };
    };

    const initializeHospital = () => {
      if (props.hospitalData) {
        isNewHospital.value = false;
        hospital.value = { ...props.hospitalData };
      }
    };

    initializeHospital();

    return { isNewHospital, hospital, isFormVisible, handleSubmit, cancelEdit, toggleFormVisibility };
  },
};
</script> -->






<!-- <template>
    <div>
      <h2>{{ isNewHospital ? 'Create' : 'Edit' }} Hospital Entry</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Name:</label>
          <input type="text" v-model="hospital.name" required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" v-model="hospital.address" required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" v-model="hospital.phoneNumber" required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" v-model="hospital.email" />
        </div>
        <div>
          <label>State:</label>
          <input type="text" v-model="hospital.state" required />
        </div>
        <div>
          <label>Provider:</label>
          <input type="text" v-model="hospital.provider" required />
        </div>
        <div>
          <label>Markdown Content:</label>
          <markdown-editor v-model="hospital.markdownContent" />
        </div>
        <button type="submit">{{ isNewHospital ? 'Create' : 'Save' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import MarkdownEditor from '@/components/MarkdownEditor.vue'; // Adjust path as per your project structure
  import axios from 'axios';
  
  export default {
    components: {
      MarkdownEditor,
    },
    props: {
      hospitalData: Object,
    },
    data() {
      return {
        isNewHospital: true,
        hospital: {
          id: '',
          name: '',
          address: '',
          phoneNumber: '',
          email: '',
          state: '',
          provider: '',
          markdownContent: '',
        },
      };
    },
    created() {
      if (this.hospitalData) {
        this.isNewHospital = false;
        this.hospital = { ...this.hospitalData };
      }
    },
    methods: {
      async handleSubmit() {
        try {
          if (this.isNewHospital) {
            await axios.post('/api/hospitals', this.hospital);
          } else {
            await axios.put(`/api/hospitals/${this.hospital.id}`, this.hospital);
          }
          alert('Hospital entry saved successfully!');
          // Optionally, you can redirect the user to another page
        } catch (error) {
          console.error('Error saving hospital entry:', error);
          alert('Error saving hospital entry. Please try again.');
        }
      },
    },
  };
  </script> -->