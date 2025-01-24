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

    <!-- Résultats de la recherche -->
    <div v-if="films.length" class="films-grid">
      <FilmCard 
        v-for="film in films" 
        :key="film._id" 
        :film="film" 
      />
      
    </div>

    <!-- Message si aucun résultat trouvé -->
    <p v-else-if="searchQuery.trim() && !isLoading">
      Aucun film trouvé pour "{{ searchQuery }}"
    </p>

    <!-- Indicateur de chargement -->
    <p v-if="isLoading">Recherche en cours...</p>
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
    };
  },
  methods: {
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout); // Réinitialise le timeout si une nouvelle saisie est effectuée
      }

      // Si la barre de recherche est vide
      if (!this.searchQuery.trim()) {
        this.films = [];
        return;
      }

      // Délai avant de lancer la recherche pour éviter trop de requêtes
      this.searchTimeout = setTimeout(() => {
        this.searchFilm();
      }, 500); // 500ms de délai
    },
    async searchFilm() {
      this.isLoading = true; // Active l'indicateur de chargement

      try {
        // Appel API mis à jour pour correspondre à votre nouvelle base de données
        const response = await fetch(
          `http://localhost:3000/api/films/search?title=${encodeURIComponent(
            this.searchQuery
          )}`
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();

        // Ajoute une vérification pour s'assurer que la réponse a une structure attendue
        if (Array.isArray(data)) {
          this.films = data; // Stocke les films retournés
        } else {
          console.warn("Structure inattendue de la réponse API :", data);
          this.films = [];
        }
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        this.films = []; // Vide les résultats en cas d'erreur
      } finally {
        this.isLoading = false; // Désactive l'indicateur de chargement
      }
    },
  },
};
</script>

<style scoped>
  @import "@/css/views/Search.css";
</style>