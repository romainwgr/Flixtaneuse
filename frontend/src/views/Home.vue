<template>
  <div>
    <div class="title">
      <h1 class="logo-title">FlixTaneuse</h1>
    </div>
    <!-- Liste des films -->
    <h2>Liste des films</h2>
    <div class="film-container" v-if="films.length">
      <FilmCard
        v-for="film in films"
        :key="film._id"
        :film="film"
      />
    </div>
    <ActorFilm />
    <DirectorFilm />

    <!-- Gestion des erreurs -->
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <!-- Indicateur de chargement -->
    <p v-else-if="loading">Chargement des films...</p>
  </div>
  <Footer />
</template>

<script>
import FilmCard from "@/components/film/FilmCard.vue";
import DirectorFilm from "@/components/home/DirectorFilm.vue";
import ActorFilm from "@/components/home/ActorFilm.vue";
import Footer from "@/components/Footer.vue";
import { useFilmStore } from "@/store/homefilmStore.js";

export default {
  setup() {
    const filmStore = useFilmStore();

      // Relance les appels API
      if (filmStore.films.length === 0) {
        filmStore.fetchFilms();
      }
      if (filmStore.actors.length === 0) {
        filmStore.fetchActorsFilms();
      }
      if (filmStore.directors.length === 0) {
        filmStore.fetchDirectorsFilms();
      }

    return {
      films: filmStore.films, // Liste des films
      errorMessage: filmStore.errorMessage, // Message d'erreur éventuel
      loading: filmStore.loading, // Indicateur de chargement
    };
  },
  components: {
    FilmCard,
    DirectorFilm,
    ActorFilm,
    Footer,
  },
};
</script>

<style>
@import "@/css/logo.css";
@import "@/css/views/Home.css";
</style>
