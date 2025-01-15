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
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  .not-found h1 {
    font-size: 96px;
    color: #ff6b6b;
  }
  
  .not-found p {
    font-size: 18px;
    color: #333;
  }
  
  .not-found a {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  .not-found a:hover {
    background-color: #45a049;
  }
  </style>
  