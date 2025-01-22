<template>
    <div id="app">
      <Navbar />
      <router-view></router-view>
      <Footer />
    </div>
  </template>
  
  <script>
  import Navbar from './components/Navbar.vue';
  
  export default {
    name: 'App',
    components: {
      Navbar,
    }
  };
  </script>
  
<style>
  @import "@/css/App.css";
  @import "@/css/police.css"

</style>
  