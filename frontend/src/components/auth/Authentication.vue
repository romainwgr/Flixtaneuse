<template>
  <div class="bg"> 
    <div class="page">
      <h1 class="logo-title">FLIXTANEUSE</h1>
      <div class="authentication">
        <div class="auth-content">

          <SignIn 
            v-if="currentTab === 'signIn'" 
            @authenticated="handleAuthenticated" 
          />
          <SignUp 
            v-if="currentTab === 'signUp'" 
            @registered="handleRegistered" 
          />
          <p class="switch-tab">
            <span v-if="currentTab === 'signIn'">
              Pas encore inscrit ? 
              <a @click="currentTab = 'signUp'" href="javascript:void(0)">Inscription</a>
            </span>
            <span v-if="currentTab === 'signUp'">
              Déjà inscrit ? 
              <a @click="currentTab = 'signIn'" href="javascript:void(0)">Se connecter</a>
            </span>
          </p>
        </div>
    </div>
  </div>

    
  </div>
</template>

<script>
import SignIn from "./SignIn.vue";
import SignUp from "./SignUp.vue";

export default {
  name: "Authentication",
  components: {
    SignIn,
    SignUp,
  },
  data() {
    return {
      currentTab: "signIn",
    };
  },
  methods: {
    handleAuthenticated(user) {
      console.log("Utilisateur connecté :", user);
      this.$emit("authenticated", user); // Propager l'événement au parent
    },
    handleRegistered(user) {
      console.log("Utilisateur inscrit :", user);
      this.currentTab = "signIn"; // Basculer vers la connexion après l'inscription
    },
  },
};
</script>

<style scoped>
  @import "@/css/composents/auth/Authentication.css";
  @import "@/css/police.css";
  @import "@/css/logo.css";
</style>
