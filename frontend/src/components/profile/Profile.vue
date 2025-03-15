<template>
  <div class="user-profile">
    <div class="profile-picture">
      <img :src="user.profil_image || defaultImage" alt="Photo de profil" />
    </div>
    <div class="profile-info">
      <h1>{{ user.name }}</h1>
      <h2>Pseudo : {{ user.public_name }}</h2>
      <h2>E-mail : {{ user.email }}</h2>
    </div>

    <!-- Bouton pour passer en mode édition -->
    <button class="modify-profile-button" @click="toggleEditMode">{{ isEditing ? 'Annuler' : 'Modifier le profil' }}</button>

    <!-- Formulaire de modification -->
    <div v-if="isEditing" class="edit-form">
      <form @submit.prevent="updateUser">
        <label for="name" class="white-label">Nom :</label>
        <input type="text" v-model="editedUser.name" id="name" />

        <label for="public_name" class="white-label">Pseudo :</label>
        <input type="text" v-model="editedUser.public_name" id="public_name" />

        <label for="email" class="white-label">E-mail :</label>
        <input type="email" v-model="editedUser.email" id="email" />

        <!-- Champ pour le nouveau mot de passe -->
        <label for="newPassword" class="white-label">Nouveau mot de passe :</label>
        <input type="password" v-model="editedUser.newPassword" id="newPassword" />

        <button type="submit">Sauvegarder</button>
      </form>
    </div>

    <!-- Section des films favoris -->
    <div class="movie-profile-section">
      <h2>Films favoris :</h2>
      <div v-if="likedFilms.length > 0" class="wrapper">
        <FilmCard
          v-for="film in likedFilms"
          :key="film._id"
          :film="film"
        />
      </div>
      <p v-else>Aucun film favoris !</p>
    </div>

    <!-- Section des films à regarder plus tard -->
    <div class="movie-profile-section">
      <h2>À regarder plus tard :</h2>
      <div v-if="watchLaterFilms.length > 0" class="wrapper">
        <FilmCard
          v-for="film in watchLaterFilms"
          :key="film._id"
          :film="film"
        />
      </div>
      <p v-else>Vous avez tout visionné !</p>
    </div>

    <!-- Section des films notés -->
    <div class="movie-profile-section">
      <h2>Films notés :</h2>
      <div v-if="ratedFilms.length > 0" class="wrapper">
        <FilmCard
          v-for="film in ratedFilms"
          :key="film._id"
          :film="film"
        />
      </div>
      <p v-else>Vous n'avez noté aucun film !</p>
    </div>

    <!-- Bouton de déconnexion -->
    <div class="logout">
      <button class="logout-button"
        :style="{ backgroundColor: 'red', color: 'white'}"
        @click="handleLogOut"
      >
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<script>
import defaultImage from "../../assets/profil_img.jpg";
import FilmCard from "../film/FilmCard.vue";

export default {
  name: "UserProfile",
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({
        name: "Nom indisponible",
        public_name: "Pseudonyme indisponible",
        email: "Email indisponible",
        profil_image: "",
      }),
    },
  },
  data() {
    return {
      defaultImage,
      likedFilms: [],
      watchLaterFilms: [],
      ratedFilms: [],
      isEditing: false,
      editedUser: {
        ...this.user,
        newPassword: "", // Nouveau mot de passe
      },
    };
  },
  methods: {
    handleLogOut() {
      this.$emit("logout");
    },
    toggleEditMode() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        // Réinitialiser les champs du formulaire
        this.editedUser = {
          ...this.user,
          newPassword: "", // Réinitialiser le champ du nouveau mot de passe
        };
      }
    },
    async updateUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token non trouvé. Veuillez vous reconnecter.");
        return;
      }

      // Vérifier si des modifications ont été apportées
      const hasChanges =
        this.editedUser.name !== this.user.name ||
        this.editedUser.public_name !== this.user.public_name ||
        this.editedUser.email !== this.user.email ||
        this.editedUser.newPassword !== "";

      if (!hasChanges) {
        alert("Aucune modification détectée.");
        return;
      }

      // Préparer les données à envoyer
      const updatedData = {
        name: this.editedUser.name,
        public_name: this.editedUser.public_name,
        email: this.editedUser.email,
      };

      // Ajouter le nouveau mot de passe si fourni
      if (this.editedUser.newPassword) {
        updatedData.password = this.editedUser.newPassword;
      }

      try {
        const response = await fetch("https://flixtaneuse-api.space/api/users/profile/modif-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Réponse de l'API :", result); // Debugging
          const updatedUser = result.user;
          console.log("Données de l'utilisateur extraites :", updatedUser); // Debugging
          this.$emit("update-user", updatedUser);
          this.isEditing = false;
          alert("Profil mis à jour avec succès !");
        } else {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error.message);
        alert("Une erreur s'est produite lors de la mise à jour du profil.");
      }
    },
  },
  watch: {
    // Mettre à jour editedUser lorsque user change
    user: {
      immediate: true,
      handler(newUser) {
        this.editedUser = {
          ...newUser,
          newPassword: "", // Réinitialiser le champ du nouveau mot de passe
        };
      },
    },
  },
  async created() {
    try {
      const token = localStorage.getItem("token");

      // Récupération des films aimés
      const likedResponse = await fetch("https://flixtaneuse-api.space/api/users/profile/liked-films", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!likedResponse.ok) {
        throw new Error(`Erreur HTTP (Liked Films) : ${likedResponse.status}`);
      }

      this.likedFilms = await likedResponse.json();

      // Récupération des films à regarder plus tard
      const watchLaterResponse = await fetch("https://flixtaneuse-api.space/api/users/profile/watch-later", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!watchLaterResponse.ok) {
        throw new Error(`Erreur HTTP (Watch Later Films) : ${watchLaterResponse.status}`);
      }

      this.watchLaterFilms = await watchLaterResponse.json();

      // Récupération des films notés
      const ratedResponse = await fetch("https://flixtaneuse-api.space/api/users/profile/rated-films", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!ratedResponse.ok) {
        throw new Error(`Erreur HTTP (Rated Films) : ${ratedResponse.status}`);
      }

      this.ratedFilms = await ratedResponse.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error.message);
    }
  },
  components: {
    FilmCard,
  },
};
</script>

<style scoped>
  @import "@/css/police.css";
  @import "@/css/composents/profile/Profile.css";
</style>