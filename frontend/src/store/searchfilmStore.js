import { defineStore } from 'pinia';

export const useSearchStore = defineStore('searchStore', {
  state: () => ({
    searchQuery: "", // Requête de recherche entrée par l'utilisateur
    films: [], // Résultats de la recherche
    isLoading: false, // Indicateur de chargement
    searchDuration: null, // Temps de recherche
    hasMoreResults: false, // Indicateur pour le bouton "Voir plus"
    currentLimit: 21, // Nombre de résultats à charger par page
    searchTimeout: null, // Timeout pour limiter les appels API
  }),
  actions: {
    setSearchQuery(query) {
        this.searchQuery = query.trim();
    },
    handleSearch(query) {
      this.searchQuery = query.trim();

      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout); // Réinitialise le timeout si une nouvelle saisie est effectuée
      }

      if (!this.searchQuery) {
        // Si la recherche est vide, réinitialise les résultats
        this.films = [];
        this.searchDuration = null;
        return;
      }

      if (this.searchQuery.length < 2) {
        // Si la recherche contient moins de 3 caractères, ne pas lancer l'appel
        this.films = [];
        this.searchDuration = null;
        return;
      }

      // Lancer la recherche avec un délai (300ms)
      this.searchTimeout = setTimeout(() => {
        this.searchFilm();
      }, 300);
    },

    async searchFilm(loadMore = false) {
      this.isLoading = true; // Active l'indicateur de chargement

      if (!loadMore) {
        this.currentLimit = 21; // Réinitialise la limite pour une nouvelle recherche
      } else {
        this.currentLimit += 21; // Augmente la limite pour charger plus de résultats
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:3000/api/recherche/search?title=${encodeURIComponent(
            this.searchQuery
          )}&limit=${this.currentLimit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        this.films = data.films;
        this.searchDuration = data.metrics.totalDuration;
        this.hasMoreResults = data.hasMore;
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        this.films = []; // Vide les résultats en cas d'erreur
      } finally {
        this.isLoading = false; // Désactive l'indicateur de chargement
      }
    },

    loadMore() {
      this.searchFilm(true); // Charge plus de résultats
    },
  },
});
