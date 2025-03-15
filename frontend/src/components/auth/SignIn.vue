<!--  
  Composant qui gère la connexion mail/mdp
-->
<template>
  <div class="sign">
    <div class="title">
      <h3>S'identifier</h3>
      <hr>
    </div>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
        />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          required
        />
      </div>
      <button type="submit">Se connecter</button>
      <hr>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch("https://flixtaneuse-api.space/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });

        const data = await response.json();

        if (response.ok) {
          this.successMessage = "Connexion réussie !";
          this.errorMessage = "";
          localStorage.setItem("token", data.token); // Stocker le token JWT
          this.$emit("authenticated", data.user); // Émettre un événement avec les infos utilisateur
        } else {
          this.errorMessage = data.message || "Erreur lors de la connexion.";
          this.successMessage = "";
        }
      } catch (error) {
        console.error("Erreur :", error);
        this.errorMessage = "Impossible de se connecter au serveur.";
        this.successMessage = "";
      }
    },
  },
};
</script>

<style scoped>
  @import "@/css/police.css";
  @import "@/css/composents/auth/Sign.css";
</style>
  