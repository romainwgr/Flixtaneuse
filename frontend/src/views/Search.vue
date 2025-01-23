<!-- 
  Page de recherche
-->
<template>
  <div class="search-view">
    <h2>Rechercher un film</h2>
    <div class="search-container">
      <input
        type="text"
        class="search-bar"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Entrez le titre du film"
      />
    </div>

    <!-- Message de caractères insuffisants -->
    <p v-if="searchQuery.trim().length > 0 && searchQuery.trim().length < 3">
      Écrire au moins 3 lettres pour lancer une recherche
    </p>

    <!-- Résultats/Chargement/Message vide -->
    <div v-else>
      <!-- Résultats de la recherche -->
      <div v-if="films.length" class="films-grid">
        <FilmCard 
          v-for="film in films" 
          :key="film._id" 
          :film="film" 
        />
        <div v-if="showLoadMore" class="load-more">
            <button 
              @click="loadMore"
              :disabled="isLoading"
              class="load-more-btn"
            >
              Voir plus
            </button>
          </div>
      </div>
      
      <!-- Indicateur de chargement -->
      <p v-if="isLoading">Recherche en cours...</p>

      <!-- Message si aucun résultat trouvé -->
      <p v-if="!isLoading && films.length === 0 && searchQuery.trim().length >= 3">
        Aucun film trouvé pour "{{ searchQuery }}"
      </p>
    </div>
  </div>
  <Footer />
</template>

<script>
import FilmCard from "@/components/film/FilmCard.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    FilmCard,
    Footer

  },
  data() {
    return {
      searchQuery: "", // Requête de recherche entrée par l'utilisateur
      films: [], // Résultats de la recherche
      isLoading: false, // Indicateur de chargement
      searchTimeout: null, // Timeout pour limiter les appels API
      currentLimit: 21, // Nombre de résultats à charger à chaque fois
      hasMoreResults: false



    };
  },
  computed: {
    showLoadMore() {
      return this.hasMoreResults && !this.isLoading;
    }
  },
  methods: {
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout); // Réinitialise le timeout si une nouvelle saisie est effectuée
      }

      const query = this.searchQuery.trim();

        // Réinitialiser les résultats si la recherche est vide
      if (!query) {
        this.films = [];
        return;
      }

      // Ne pas lancer la recherche si moins de 3 caractères
      if (query.length < 3) {
        this.films = [];
        return;
      }
      // Délai avant de lancer la recherche pour éviter trop de requêtes
      this.searchTimeout = setTimeout(() => {
        this.searchFilm();
      }, 500); // 500ms de délai
    },
    async searchFilm(loadMore = false) {
      this.isLoading = true; // Active l'indicateur de chargement
      if (!loadMore) this.currentLimit = 21; // Réinitialiser la limite pour une nouvelle recherche
      if (loadMore) this.currentLimit += 21; // Augmenter la limite pour le prochain chargement

      try {
        // Appel API mis à jour pour correspondre à votre nouvelle base de données
        const response = await fetch(
          // `http://localhost:3000/api/films/search?title=${encodeURIComponent(
            // this.searchQuery
            `http://localhost:3000/api/recherche/search?title=${encodeURIComponent(
             this.searchQuery
          )}&limit=${this.currentLimit}`
        );

        const data = await response.json();
        
        this.films = data.films;
        this.hasMoreResults = data.hasMore;

      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        this.films = []; // Vide les résultats en cas d'erreur
      } finally {
        this.isLoading = false; // Désactive l'indicateur de chargement
      }
    },
    loadMore() {
      this.searchFilm(true);
    },
  },
};
</script>

<style scoped>


  @import "@/css/views/Search.css";
</style>
