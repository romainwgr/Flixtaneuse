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
        profil_image: "",
      }),
    },
  },
  methods: {
    handleLogOut() {
      this.$emit("logout");
    },

    // Fonction pour ajouter ou retirer un film de la liste "Regarder plus tard"
    async toggleWatchLater(filmId) {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const isInWatchLater = this.watchLaterFilms.some((film) => film._id === filmId);

        if (isInWatchLater) {
          // Retirer le film de la liste "Regarder plus tard"
          await fetch(`http://localhost:3000/api/watchlater/${filmId}/removeFromWatchLater`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.watchLaterFilms = this.watchLaterFilms.filter((film) => film._id !== filmId);
        } else {
          // Ajouter le film à la liste "Regarder plus tard"
          const response = await fetch(`http://localhost:3000/api/watchlater/${filmId}/addToWatchLater`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const addedFilm = await response.json();
            this.watchLaterFilms.push(addedFilm);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la gestion de 'Regarder Plus Tard':", error);
      }
    },
  },
  data() {
    return {
      defaultImage, // Image par défaut
      likedFilms: [], // Films aimés
      watchLaterFilms: [], // Films à regarder plus tard
      ratedFilms: [], // Films notés
    };
  },
  components: {
    FilmCard,
  },
  async created() {
    try {
      const token = localStorage.getItem("token");

      // Récupération des films aimés
      const likedResponse = await fetch("http://localhost:3000/api/users/profile/liked-films", {
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
      const watchLaterResponse = await fetch("http://localhost:3000/api/users/profile/watch-later", {
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
      const ratedResponse = await fetch("http://localhost:3000/api/users/profile/rated-films", {
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
};
</script>

<style scoped>
  @import "@/css/police.css";
  @import "@/css/composents/profile/Profile.css";
</style>