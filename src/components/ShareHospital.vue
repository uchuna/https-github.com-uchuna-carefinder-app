<template>
    <div>
      <!-- Email Share Form -->
      <form @submit.prevent="sendEmail">
        <input type="email" v-model="recipientEmail" 
        placeholder="Recipient's Email" required
        >
        <textarea 
        v-model="message" 
        placeholder="Your Message" 
        required>
        </textarea>
        <button type="submit">Send Email</button>
      </form>
  
      <!-- Shareable Link -->
      <button @click="generateShareableLink">Generate Shareable Link</button>
      <p v-if="shareableLink">Shareable Link: {{ shareableLink }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { v4 as uuidv4 } from 'uuid'; // Import uuid library
  
  export default defineComponent({
    data() {
      return {
        recipientEmail: '',
        message: '',
        shareableLink: ''
      };
    },
    methods: {
      sendEmail() {
        if (!this.recipientEmail || !this.message) {
          alert('Please provide both recipient email and message.');
          return;
        }
  
        // Send email using fetch API
        fetch('http://localhost:3000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipientEmail: this.recipientEmail,
            message: this.message
          })
        })
        .then(response => {
          if (response.ok) {
            alert('Email sent successfully!');
            // Clear form inputs
            this.recipientEmail = '';
            this.message = '';
          } else {
            alert('Failed to send email. Please try again later.');
          }
        })
        .catch(error => {
          console.error('Error sending email:', error);
          alert('Failed to send email. Please try again later.');
        });
      },
      generateShareableLink() {
        // Generate a unique shareable link using uuid
        this.shareableLink = 'https://example.com/share/' + uuidv4();
      }
    }
  });
  </script>
  
  <style scoped>
 
  </style>