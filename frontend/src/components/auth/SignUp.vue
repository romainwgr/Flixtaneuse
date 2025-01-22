<template>
  <div class="sign">
    <div class="title">
      <h3>S'inscrire</h3>
      <hr>
    </div>
    <form @submit.prevent="handleSignUp">
      <div>
        <label for="name">Nom</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
        />
      </div>
      <div>
        <label for="public_name">Pseudonyme</label>
        <input
          type="text"
          id="public_name"
          v-model="formData.public_name"
          required
        />
      </div>
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
      <button type="submit">S'inscrire</button>
      <hr>
    </form>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "",
        public_name: "",
        email: "",
        password: "",
      },
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleSignUp() {
      try {
        const response = await fetch("http://localhost:3000/api/users/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });

        const data = await response.json();

        if (response.ok) {
          this.successMessage = "Inscription réussie !";
          this.errorMessage = "";
          this.resetForm();
          this.$emit("registered", data.user); // Émettre un événement avec les infos utilisateur
        } else {
          this.errorMessage = data.message || "Erreur lors de l'inscription.";
          this.successMessage = "";
        }
      } catch (error) {
        console.error("Erreur :", error);
        this.errorMessage = "Une erreur est survenue. Veuillez réessayer.";
        this.successMessage = "";
      }
    },
    resetForm() {
      this.formData = {
        name: "",
        public_name: "",
        email: "",
        password: "",
      };
    },
  },
};
</script>

<style scoped>
  @import "@/css/police.css";
  @import "@/css/composents/auth/Sign.css";
</style>
