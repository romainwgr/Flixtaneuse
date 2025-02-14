<template>
  <div class="search-view">
    <h2>Rechercher un film</h2>
    <div class="search-container">
      <input
        type="text"
        class="search-bar"
        v-model="searchQuery"
        @input="updateSearchQuery($event.target.value)"
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
      <p v-if="searchDuration">Temps du traitement de la recherche : {{ searchDuration }} ms</p>

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
      <p v-if="!isLoading && films.length === 0 && searchQuery.length >= 3">
        Aucun film trouvé pour "{{ searchQuery }}"
      </p>
    </div>
  </div>
  <Footer />
</template>

<script>
import FilmCard from "@/components/film/FilmCard.vue";
import Footer from "@/components/Footer.vue";
import { useSearchStore } from "@/store/searchfilmStore.js";
import { computed, watch } from "vue";

export default {
  components: {
    FilmCard,
    Footer,
  },
  setup() {
    const searchStore = useSearchStore();

    const searchQuery = computed(() => searchStore.searchQuery);
    const films = computed(() => searchStore.films);
    const isLoading = computed(() => searchStore.isLoading);
    const searchDuration = computed(() => searchStore.searchDuration);
    const showLoadMore = computed(() => searchStore.hasMoreResults && !searchStore.isLoading);


    const updateSearchQuery = (value) => {
      searchStore.setSearchQuery(value);
      searchStore.handleSearch(value);
    };


    const loadMore = () => {
      searchStore.loadMore();
    };

    return {
      searchQuery,
      films,
      isLoading,
      searchDuration,
      showLoadMore,
      updateSearchQuery,
      loadMore,
    };
  },
};
</script>

<style scoped>
  @import "@/css/views/Search.css";
</style>