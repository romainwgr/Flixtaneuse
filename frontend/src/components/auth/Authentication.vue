<template>
  <div class="bg"> 
    <div class="page">
      <h1 class="title">FLIXTANEUSE</h1>
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
@import url('https://fonts.googleapis.com/css2?family=Lalezar&display=swap');

.lalezar-regular {
  font-family: "Lalezar", serif;
  font-weight: 400;
  font-style: normal;
}
.bg {
  height: 100vh;
  display: flex; 
  flex-direction: column; 
  background-image: url(../../assets/auth_background.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden; 
  position: relative;
}
.bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(19, 16, 30, 0.93); 
  z-index: 1; 
}
.page {
  z-index: 2;
  margin-top: 3em;
}
h1.title{
  text-align: center;
  font-family: Lalezar;
  font-weight: 400;
  font-size: 40px;
  margin-bottom: 0.1em;
  color: #243971;
}
.authentication {
  width: 28em;
  margin: auto;
  margin-block: 100px;
  text-align: center;
  margin-top: 0;
}

.auth-content {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: rgb(0, 0, 0, 0.3);
}

.switch-tab {
  font-size: 14px;
  color: #666;
}

.switch-tab a {
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}

.switch-tab a:hover {
  text-decoration: underline;
}
</style>
