<!--  
  Composant qui gère la connexion mail/mdp
-->
<template>
  <div class="login-form">
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
        const response = await fetch("http://localhost:3000/api/users/login", {
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
  @import url('https://fonts.googleapis.com/css2?family=Lalezar&display=swap');

  .lalezar-regular {
    font-family: "Lalezar", serif;
    font-weight: 400;
    font-style: normal;
  }

  h3 {
    text-align: start;
    color: white;
    font-family: Lalezar;
    font-weight: 200;
    margin-bottom: 0;
  }
  hr {
    margin-top: 0;
    width: 15%;
  }
  .title>hr {
    margin-left: 0;
    margin-bottom: 1.5em;
  }
  form>div {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
  }
  form>hr {
    margin-top: 2em;
  }
  .login-form label {
    margin-left: 1.5em;
    margin-bottom: 0.2em;
    font-family: system-ui, Roboto;
    font-size: 14px;
    color: white;
    text-align: start;
  }
  .login-form input {
    width: 90%;
    padding: 0.5em;
    margin-bottom: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: auto;
  }
  .login-form button {
    width: 70%;
    height: 3.5em;
    padding: 0.7em;
    margin-top: 2em;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .login-form button:hover {
    background-color: #0056b3;
  }
  .success {
    color: green;
    margin-top: 1em;
  }
  .error {
    color: red;
    margin-top: 1em;
  }
  </style>
  