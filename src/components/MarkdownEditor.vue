<template>
    <div>
      <markdown-editor v-model="markdownContent" />
    </div>
  </template>
  
  <script>
  import MarkdownEditor from 'vue-markdown-editor';
  
  export default {
    components: {
      MarkdownEditor,
    },
    props: {
      initialValue: String,
    },
    data() {
      return {
        markdownContent: this.initialValue || '',
      };
    },
    watch: {
      markdownContent(newVal) {
        this.$emit('input', newVal);
      },
    },
  };
  </script>