<!--
    Composant qui affiche un film qu'on trouve dans la page d'accueil
    Il l'affiche en petit avec une image et un titre 
-->
<template>
  <router-link 
    v-if="filmId" 
    :to="{ name: 'FilmDetail', params: { id: filmId } }" 
    class="film-card"
  >
    <div class="film-card__image-container">
      <img 
        :src="film.poster_url" 
        :alt="film.original_title" 
        class="film-card__image" 
      />
    </div>
    <h3 class="film-card__title">{{ film.original_title }}</h3>
  </router-link>
  <div v-else class="error">
    <p>Film ID non défini.</p>
  </div>
</template>

<script>
export default {
  props: {
    film: {
      type: Object,
      required: true,
    },
  },
  computed: {
    filmId() {
      // Vérifie que le film et son ID sont bien définis
      return this.film?._id || null;
    },
  },
};
</script>

<style scoped>
  @import "@/css/police.css";
  @import "@/css/composents/film/FilmCard.css";
</style>
