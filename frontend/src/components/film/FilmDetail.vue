<template>
      
  <div>
    <button @click="$router.back()" class="back-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M16.207 4.293a1 1 0 0 1 0 1.414L9.914 12l6.293 6.293a1 1 0 0 1-1.414 1.414L8.5 13.414a2 2 0 0 1 0-2.828l6.293-6.293a1 1 0 0 1 1.414 0" clip-rule="evenodd"/></svg>
      
    </button>
  <div v-if="film" class="film-detail">
    

    <!-- Section Image -->
    <div class="film-detail__image-container">
      <img 
        :src="film.poster_url"
        :alt="film.original_title" 
        class="film-detail__image" 
      />
    </div>

    <!-- Section Infos -->
    <div class="film-detail__info">
      <div class="title-and-like">
        <h2 class="film-detail__title">{{ film.original_title }}</h2>
        <button class="liked-button" v-if="isAuthenticated" @click="toggleLike">
          {{ isLiked ? "🧡" : "🩶" }}
        </button>
        <button class="watch-button" v-if="isAuthenticated" @click="toggleWatchLater">
          {{ isInWatchLater ? "✔️" : "➕" }}
        </button>
      </div>

      <!-- Notation en étoiles -->
      <div v-if="isAuthenticated" class="film-detail__rating">
        <strong>Notez ce film :</strong>
        <div class="star-rating">
          <span 
            v-for="star in 5" 
            :key="star" 
            @click="rateFilm(star)"
            :class="{ 'active': star <= userRating }"
          >
            ★
          </span>
        </div>
        <p v-if="userRating">Vous avez noté ce film : {{ userRating }} étoiles</p>
        <button @click="deleteRating" v-if="userRating > 0">Supprimer ma notation</button>
      </div>

      <!-- Année de sortie -->
      <p class="film-detail__year"><strong>Année de sortie :</strong> {{ film.release_date?.split('-')[0] }}</p>

      <!-- Genres -->
      <p class="film-detail__genre">
        <strong>Genres : </strong>
        <span v-for="(genre, index) in film.genres" :key="genre.id">
          {{ genre.name }}<span v-if="index < film.genres.length - 1">, </span>
        </span>
      </p>

      <!-- Durée -->
      <p class="film-detail__runtime"><strong>Durée :</strong> {{ film.runtime }} min</p>

      <!-- Réalisateurs -->
      <div class="film-detail__director" v-if="film && film.directors && film.directors.length > 0">
        <strong>Réalisateurs :</strong>
        <p>
          {{ film.directors.map(directorEntry => directorEntry.director.name).join(', ') }}
        </p>
      </div>
      <div v-else class="film-detail__director">
        <strong>Réalisateurs :</strong> Non disponibles
      </div>

      <!-- Acteurs -->
      <div class="film-detail__actors" v-if="film && film.actors && film.actors.length > 0">
        <strong>Acteurs :</strong>
        <p>
          {{ film.actors.map(actorEntry => actorEntry.actor.name).join(', ') }}
        </p>
      </div>
      <div v-else class="film-detail__actors">
        <strong>Acteurs :</strong> Non disponibles
      </div>

      <!-- Synopsis -->
      <p class="film-detail__overview"><strong>Synopsis :</strong> <br>{{ film.translated_summary }}</p>
    </div>
  </div>
  

  <!-- Message de chargement -->
  <p v-else class="loading">Chargement des détails du film...</p>
</div>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      film: null, // Contient les détails du film
      isLiked: false, // État indiquant si le film est aimé
      isInWatchLater: false, // État pour la liste "Regarder Plus Tard"
      isAuthenticated: false, // Vérifie si l'utilisateur est connecté
      userRating: 0, // Note de l'utilisateur pour ce film
    };
  },

  methods: {
    // Fonction pour gérer le "like"
    async toggleLike() {
      const filmId = this.$route?.params?.id;

      if (!filmId) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        if (this.isLiked) {
          await fetch(`http://localhost:3000/api/likes/${filmId}/unlike`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.isLiked = false;
        } else {
          await fetch(`http://localhost:3000/api/likes/${filmId}/like`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.isLiked = true;
        }
      } catch (error) {
        console.error("Erreur lors du traitement du like:", error);
      }
    },

    // Fonction pour ajouter ou retirer le film de la liste "Regarder Plus Tard"
    async toggleWatchLater() {
      const filmId = this.$route?.params?.id;

      if (!filmId) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        if (this.isInWatchLater) {
          // Route pour retirer un film de la liste "Regarder Plus Tard"
          await fetch(`http://localhost:3000/api/watchlater/${filmId}/removeFromWatchLater`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.isInWatchLater = false;
        } else {
          // Route pour ajouter un film à la liste "Regarder Plus Tard"
          await fetch(`http://localhost:3000/api/watchlater/${filmId}/addToWatchLater`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.isInWatchLater = true;
        }
      } catch (error) {
        console.error("Erreur lors de la gestion de 'Regarder Plus Tard':", error);
      }
    },

    // Fonction pour noter le film
    async rateFilm(rating) {
      const filmId = this.$route?.params?.id;

      if (!filmId || !this.isAuthenticated) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        // Envoyer la note à l'API
        const response = await fetch(`http://localhost:3000/api/ratings/${filmId}/rate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        });

        if (!response.ok) throw new Error("Erreur lors de la notation du film");

        // Mettre à jour la note de l'utilisateur
        this.userRating = rating;
      } catch (error) {
        console.error("Erreur lors de la notation du film:", error);
      }
    },

    // Fonction pour supprimer la notation
    async deleteRating() {
      const filmId = this.$route?.params?.id;

      if (!filmId || !this.isAuthenticated) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        // Envoyer une requête DELETE pour supprimer la notation
        const response = await fetch(`http://localhost:3000/api/ratings/${filmId}/deleteRating`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur lors de la suppression de la notation");

        // Réinitialiser la note de l'utilisateur
        this.userRating = 0;
        alert("Votre notation a été supprimée avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression de la notation :", error);
        alert("Erreur lors de la suppression de la notation.");
      }
    },
  },

  // Méthode exécutée lors de la création du composant
  async created() {
    const route = useRoute();
    const filmId = route.params.id;

    try {
      const token = localStorage.getItem("token");
      this.isAuthenticated = !!token;

      // Récupérer les détails du film depuis l'API
      const response = await fetch(`http://localhost:3000/api/films/${filmId}`);
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

      const data = await response.json();

      // Vérifier si le film est aimé par l'utilisateur
      if (this.isAuthenticated) {
        const islikedReq = await fetch(`http://localhost:3000/api/likes/${filmId}/isliked`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const islikedData = await islikedReq.json();
        this.isLiked = islikedData.isLiked;
      }

      // Vérifier si le film est dans la liste "Regarder Plus Tard"
      if (this.isAuthenticated) {
        const isInWatchLaterReq = await fetch(`http://localhost:3000/api/watchlater/${filmId}/isInWatchLater`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const isInWatchLaterData = await isInWatchLaterReq.json();
        this.isInWatchLater = isInWatchLaterData.isInWatchLater;
      }

      // Récupérer la note de l'utilisateur pour ce film
      if (this.isAuthenticated) {
        const userRatingReq = await fetch(`http://localhost:3000/api/ratings/${filmId}/userRating`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userRatingData = await userRatingReq.json();
        this.userRating = userRatingData.rating || 0;
      }

      // Récupérer les réalisateurs et acteurs du film
      const actorRequests = data.actors.map((actor) =>
        fetch(`http://localhost:3000/api/actors/${actor._id}`)
          .then((res) => res.json())
          .catch(() => null)
      );

      const directorRequests = data.directors.map((director) =>
        fetch(`http://localhost:3000/api/directors/${director._id}`)
          .then((res) => res.json())
          .catch(() => null)
      );

      const [actors, directors] = await Promise.all([
        Promise.all(actorRequests),
        Promise.all(directorRequests),
      ]);

      this.film = {
        ...data,
        actors: actors.filter(Boolean),
        directors: directors.filter(Boolean),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du film:", error);
    }
  },
};
</script>

<style scoped>
  @import "@/css/composents/film/FilmDetail.css";
</style>