<template>
  <div class="home-page">
    <div class="title">
      <h1 class="logo-title">FLIXTANEUSE</h1>
    </div>
    <h2>Liste des films</h2>
    <div class="film-container">
      <FilmCard
        v-for="film in films"
        :key="film._id"
        :film="film"
      />
    </div>
    <ActorFilm/>
    <DirectorFilm />


    <!-- Message d'erreur si la requête échoue -->
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
  <Footer/>

</template>

<script>
import FilmCard from "@/components/film/FilmCard.vue";
import DirectorFilm from "@/components/home/DirectorFilm.vue"
import ActorFilm from "@/components/home/ActorFilm.vue"
import Footer from "@/components/Footer.vue";


export default {
  components: {
    FilmCard,
    DirectorFilm,
    ActorFilm,
    Footer

  },
  data() {
    return {
      films: [], // Tableau pour stocker les films récupérés
      errorMessage: "", // Message d'erreur en cas de problème
    };
  },
  async created() {
    try {
      // Appel à l'API pour récupérer les films
      const response = await fetch("http://localhost:3000/api/films"); // Remplace par l'URL réelle de ton API
      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`); // Gestion des erreurs HTTP
      }
      const data = await response.json(); // Conversion des données au format JSON
      this.films = data; // Stockage des données dans `films`
    } catch (error) {
      // Gestion des erreurs lors de la requête
      this.errorMessage = "Erreur lors de la récupération des films : " + error.message;
      console.error(error);
    }
  },
};
</script>
<style >
  @import "@/css/logo.css";
  @import "@/css/views/Home.css";
</style>
