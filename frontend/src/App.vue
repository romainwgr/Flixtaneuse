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
body {
  background-color: #1B1B1B;
  margin: 0;
}

@import url('https://fonts.googleapis.com/css2?family=Lalezar&display=swap');

.police_flix {
  font-family: "Lalezar", serif;
  font-weight: 400;
  font-style: normal;
}
</style>
  