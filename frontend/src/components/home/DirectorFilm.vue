<!-- 
    Composant qui affiche les films de certains réalisateurs connu
    directors = [
        "Steven Spielberg",
        "Christopher Nolan",
        "Quentin Tarantino",
        "Martin Scorsese",
        "Alfred Hitchcock",
        "Stanley Kubrick",
        "Francis Ford Coppola",
        "James Cameron",
        "Ridley Scott",
        "Peter Jackson",
        "Tim Burton",
        "Greta Gerwig",
        "Wes Anderson",
        "David Fincher",
        "Guillermo del Toro",
        "Sofia Coppola",
        "Coen Brothers",
        "Woody Allen",
        "Denis Villeneuve",
        "Spike Lee"
    ]

-->

<template>
  <div>
    <!-- Gestion du chargement -->
    <div v-if="loading">Chargement des réalisateurs...</div>

    <!-- Gestion des erreurs -->
    <div v-else-if="error">{{ error }}</div>

    <!-- Affichage des acteurs et de leurs films -->
    <div v-else>
      <div v-for="director in directors" :key="director.name" class="director-section">
        <h2>Films du réalisateur {{ director.name }}</h2> 

        <!-- Affichez ici la liste des films pour chaque acteur -->
        <div class="film-container">
          <FilmCard
              v-for="film in director.films"
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

export default {
    name: "DirectorFilm",
    components: {
      FilmCard,
    },
    setup() {
      const filmStore = useFilmStore();

      // Charger les données des acteurs au montage
      filmStore.fetchDirectorsFilms();

      return {
        directors: filmStore.directors, // Liste des acteurs
        loading: filmStore.loading, // Indicateur de chargement
        error: filmStore.errorMessage, // Gestion des erreurs
      };
    },
  };
</script>
<style scoped>

</style>
