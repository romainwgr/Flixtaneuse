<!--
    Composant qui affiche un film en détail après que l'utilisateur ait cliqué dessus
    On y affiche toutes ses infos .. (image, titre, descriptions, acteurs etc...)
-->
<template>
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

      <!-- Affiche le bouton "Like" seulement si l'utilisateur est connecté -->
      <button v-if="isAuthenticated" @click="toggleLike">
        {{ isLiked ? "🧡" : "🩶" }}
      </button>
    
      <h2 class="film-detail__title">{{ film.original_title }}</h2>
      <p class="film-detail__year"><strong>Année de sortie :</strong> {{ film.release_date?.split('-')[0] }}</p>
      <p class="film-detail__genre">
        <strong>Genres : </strong>
        <span v-for="(genre, index) in film.genres" :key="genre.id">
          {{ genre.name }}<span v-if="index < film.genres.length - 1">, </span>
        </span>
      </p>
      <p class="film-detail__runtime"><strong>Durée :</strong> {{ film.runtime }} min</p>

      <!-- Tableau des réalisateurs -->
      <div class="film-detail__director" v-if="film && film.directors && film.directors.length > 0">
        <strong>Réalisateurs :</strong>
        <table class="detail-table">
          <thead>
            <tr>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="directorEntry in film.directors" :key="directorEntry.director.id">
              <td>{{ directorEntry.director.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="film-detail__director">
        <strong>Réalisateurs :</strong> Non disponibles
      </div>

      <!-- Tableau des acteurs -->
      <div class="film-detail__actors" v-if="film && film.actors && film.actors.length > 0">
        <strong>Acteurs :</strong>
        <table class="detail-table">
          <thead>
            <tr>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="actorEntry in film.actors" :key="actorEntry.actor.id">
              <td>{{ actorEntry.actor.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="film-detail__actors">
        <strong>Acteurs :</strong> Non disponibles
      </div>

      <p class="film-detail__overview"><strong>Synopsis :</strong> {{ film.translated_summary }}</p>
      <p></p>
    </div>
    
  </div>

  <!-- Message de chargement -->
  <p v-else class="loading">Chargement des détails du film...</p>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      film: null, // Contient les détails du film, les acteurs et les réalisateurs
      isLiked: false, // État indiquant si le film est aimé
      isAuthenticated: false, // Vérifie si l'utilisateur est connecté
    };
  },

  methods: {
    async toggleLike() {
      const filmId = this.$route?.params?.id;

      if (!filmId) {
        console.error("Film ID non défini ou invalide.");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Utilisateur non authentifié.");
          return;
        }

        if (this.isLiked) {
          const response = await fetch(`http://localhost:3000/api/likes/${filmId}/unlike`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Erreur lors du unlike : ${response.status}`);
          }

          this.isLiked = false;
        } else {
          const response = await fetch(`http://localhost:3000/api/likes/${filmId}/like`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Erreur lors du like : ${response.status}`);
          }

          this.isLiked = true;
        }
      } catch (error) {
        console.error("Erreur lors du traitement :", error.message);
      }
    }
  },

  async created() {
    const route = useRoute();
    const filmId = route.params.id;

    try {
      const token = localStorage.getItem("token");
      this.isAuthenticated = !!token;

      const response = await fetch(`http://localhost:3000/api/films/${filmId}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();

      if (this.isAuthenticated) {
        const islikedReq = await fetch(`http://localhost:3000/api/likes/${filmId}/isliked`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!islikedReq.ok) {
          throw new Error(`Erreur lors de la vérification du like : ${islikedReq.status}`);
        }

        const islikedData = await islikedReq.json();
        this.isLiked = islikedData.isLiked;
      }

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
      console.error("Erreur lors de la récupération des détails du film :", error);
    }
  },
};
</script>

<style scoped>
.detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  color: white;
}

.detail-table th,
.detail-table td {
  border: 1px solid #ccc;
  padding: 8px 10px;
  text-align: left;
}

.detail-table th {
  background-color: #444;
  color: white;
  font-weight: bold;
}

.detail-table tbody tr:nth-child(even) {
  background-color: #333;
}

.detail-table tbody tr:nth-child(odd) {
  background-color: #222;
}

.film-detail {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 90%;
  margin: auto;
  margin-top: 6em;
  padding: 20px;
}

.film-detail__image-container {
  display: flex;
  justify-content: center;
  width: 15em;
  max-width: 400px; /* Ajuste la largeur maximale de l'image */
}

.film-detail__image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.film-detail__info {
  gap: 10px;
  width: 100%;
  padding: 20px;
  color: white;
}

.film-detail__title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 0;
}

.film-detail__year,
.film-detail__genre,
.film-detail__runtime,
.film-detail__director,
.film-detail__actors,
.film-detail__overview {
  font-size: 16px;
  line-height: 1.6;
  word-wrap: break-word; /* Permet de ne pas couper les mots dans les détails */
  margin-top: 1em;
}

.loading {
  text-align: center;
  margin-top: 50px;
  font-size: 20px;
  color: #666;
}
</style>
