import { defineStore } from 'pinia';

export const useFilmStore = defineStore('filmStore', {
  persist: {
    key: 'flixtaneuse-store',
    paths: ['films', 'actors', 'directors'],
    storage: sessionStorage, // Plus adapté que localStorage
  },

  state: () => ({
    films: [],
    actors: [],
    directors: [],
    selectedFilm: null,
    errorMessage: '',
    loading: false,
    needsRefresh: false,
    lastFetch: null,
  }),

  getters: {
    shouldRefresh: (state) => {
      // Rafraîchit automatiquement après 1 heure
      if (!state.lastFetch) return true;
      return Date.now() - state.lastFetch > 3600000;
    },
  },

  actions: {
    async fetchFilms(force = false) {
      try {
        if (force || this.shouldRefresh || this.films.length === 0) {
          this.loading = true;
          const response = await fetch('http://13.61.150.201:3000/api/films');
          
          if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
          
          this.films = await response.json();
          this.lastFetch = Date.now();
          this.needsRefresh = false;
        }
      } catch (error) {
        this.handleError(error, 'films');
      } finally {
        this.loading = false;
      }
    },

    async fetchActorsFilms(force = false) {
      await this.fetchResources({
        resource: 'actors',
        url: 'http://13.61.150.201:3000/api/actors/famous',
        force,
      });
    },

    async fetchDirectorsFilms(force = false) {
      await this.fetchResources({
        resource: 'directors',
        url: 'http://13.61.150.201:3000/api/directors/famous',
        force,
      });
    },

    async fetchResources({ resource, url, force }) {
      try {
        if (force || this.shouldRefresh || this[resource].length === 0) {
          this.loading = true;
          const response = await fetch(url);
          
          if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
          
          this[resource] = await response.json();
          this.lastFetch = Date.now();
          this.needsRefresh = false;
        }
      } catch (error) {
        this.handleError(error, resource);
      } finally {
        this.loading = false;
      }
    },

    handleError(error, context) {
      this.errorMessage = `Erreur lors de la récupération des ${context}: ${error.message}`;
      console.error(`[${context.toUpperCase()}_ERROR]`, error);
      setTimeout(() => this.clearError(), 5000);
    },

    clearError() {
      this.errorMessage = '';
    },

    clearSelectedFilm() {
      this.selectedFilm = null;
    },

    markForRefresh() {
      this.needsRefresh = true;
    },

    $reset() {
      // Surcharge pour reset complet
      this.films = [];
      this.actors = [];
      this.directors = [];
      this.selectedFilm = null;
      this.errorMessage = '';
      this.loading = false;
      this.needsRefresh = true;
      this.lastFetch = null;
    },
  },
});