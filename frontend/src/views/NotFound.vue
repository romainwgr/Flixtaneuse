<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Oups ! La page que vous recherchez n'existe pas.</p>
      <router-link to="/">Retour à l'accueil</router-link>
    </div>
    <Footer/>
  </template>
  
  <script>
  import Footer from "@/components/Footer.vue";

  export default {
    
    name: "NotFound",
    
    components:{
      Footer,
    }
  };
  </script>
  
<style scoped>
  @import "@/css/views/NotFound.css";
</style>
