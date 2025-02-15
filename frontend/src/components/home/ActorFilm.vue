<!-- 
    Composant qui affiche les films de certains acteurs connu
    actors = [
        "Leonardo DiCaprio",
        "Robert De Niro",
        "Tom Hanks",
        "Meryl Streep",
        "Denzel Washington",
        "Johnny Depp",
        "Brad Pitt",
        "Will Smith",
        "Angelina Jolie",
        "Cate Blanchett",
        "Christian Bale",
        "Scarlett Johansson",
        "Jack Nicholson",
        "Morgan Freeman",
        "Robert Downey Jr.",
        "Viola Davis",
        "Daniel Day-Lewis",
        "Natalie Portman",
        "Joaquin Phoenix",
        "Harrison Ford"
    ]

-->
<template>
  <div>
    <!-- Gestion du chargement -->
    <div v-if="loading">Chargement des acteurs...</div>

    <!-- Gestion des erreurs -->
    <div v-else-if="error">{{ error }}</div>

    <!-- Affichage des acteurs et de leurs films -->
    <div v-else>
      <div v-for="actor in actors" :key="actor.name" class="actor-section">
        <h2>Films de l'acteur {{ actor.name }}</h2>

        <!-- Affichez ici la liste des films pour chaque acteur -->
        <div class="film-container">
          <FilmCard
              v-for="film in actor.films"
              :key="film._id"
              :film="film"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FilmCard from "@/components/film/FilmCard.vue";
  import { useFilmStore } from '@/store/homefilmStore';
  import { computed, onMounted } from 'vue';

  export default {
    name: "ActorFilm",
    components: {
      FilmCard,
    },
    setup() {
      const filmStore = useFilmStore();

      onMounted(async () => {
        await filmStore.fetchActorsFilms();
      });

      return {
        actors: computed(() => filmStore.actors), 
        loading: computed(() => filmStore.loading), 
        error: computed(() => filmStore.errorMessage), 
      };
    },
  };
</script>

<style scoped>

</style>
