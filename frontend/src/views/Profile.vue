<template>
  <div class="profile-page">
    <div v-if="isLoading">
      <p>Chargement...</p>
    </div>
    <div v-else-if="isAuthenticated">
      <Profile :user="user" @logout="handleLogOut" @update-user="handleUpdateUser" />
    </div>
    <div v-else>
      <Authentication @authenticated="onAuthenticated" />
    </div>
  </div>
</template>

<script>
import Authentication from "@/components/auth/Authentication.vue";
import Profile from "@/components/profile/Profile.vue";

export default {
  name: "ProfilePage",
  components: {
    Authentication,
    Profile,
  },
  data() {
    return {
      isAuthenticated: false,
      user: null,
      isLoading: true,
    };
  },
  methods: {
    handleLogOut() {
      localStorage.removeItem('token');
      this.user = null;
      this.isAuthenticated = false;
    },
    async checkAuthentication() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://13.61.150.201:3000/api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          this.user = userData;
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
        this.isAuthenticated = false;
      } finally {
        this.isLoading = false;
      }
    },
    onAuthenticated(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.isLoading = false;
    },
    handleUpdateUser(updatedUser) {
      console.log("Événement update-user reçu avec les données :", updatedUser); // Debugging
      this.user = updatedUser; // Mettre à jour les données locales
      console.log("Données utilisateur mises à jour :", this.user); // Debugging
    },
  },
  mounted() {
    this.checkAuthentication();
  },
};
</script>

<style scoped>
  @import "@/css/views/Profile.css";
</style>