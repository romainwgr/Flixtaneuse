<template>
    <div class="profile-page">
      <!-- Affichage du loader pendant la vérification de l'authentification -->
      <div v-if="isLoading">
        <p>Chargement...</p>
      </div>
      <!-- Affichage conditionnel : utilisateur authentifié ou non -->
      <div v-else-if="isAuthenticated">
        <Profile :user="user"  @logout="handleLogOut"/>
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
        isLoading: true, // Ajout d'un état de chargement
      };
    },
    methods: {
      handleLogOut() {
        // Supprime le token
        localStorage.removeItem('token');

        this.user = null;

        // Redirige vers la page de connexion
        this.isAuthenticated = false;
    },
      async checkAuthentication() {
        try {
          const token = localStorage.getItem('token'); 
  
          // Simuler un délai de 0,2 seconde
          await new Promise(resolve => setTimeout(resolve, 200));

          console.log(this.user); // Vérifie que les données incluent ce dont tu as besoin

  
          const response = await fetch("http://localhost:3000/api/users/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Ajoutez le token dans l'en-tête Authorization
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
          this.isLoading = false; // Désactiver le mode chargement une fois terminé
        }
    },
      onAuthenticated(userData) {
        // Mise à jour de l'état après l'authentification
        this.user = userData;
        this.isAuthenticated = true;
        this.isLoading = false; // Assurez-vous que le chargement est terminé
      },
    },
    mounted() {
      this.checkAuthentication();
    },
  };
    </script>
    
    <style scoped>

    .profile-page {
      min-height: 55vh;
    }

    .profile {
      max-width: 600px;
      margin: 0 auto;
      padding: 1em;
    }
    
    .profile-details {
      background-color: #f9f9f9;
      padding: 1em;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    button {
      display: block;
      margin: 1em auto;
      padding: 0.5em 1em;
      border: none;
      background-color: #333;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #555;
    }
    </style>
    
     

  