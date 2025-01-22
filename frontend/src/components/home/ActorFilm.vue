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
  
      <!-- Affichage des réalisateurs et de leurs films -->
      <div v-else>
        <div v-for="actor in actors" :key="actor.actor" class="actor-section">
          <h2>Films de l'acteur {{ actor.name }}</h2>
  
          <!-- Affichez ici la liste des films pour chaque réalisateur -->
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

export default {
    
  name: "actorFilm",
  components: {
    FilmCard,

  },
  data() {
    return {
      films : [],
      actors: [], // Tableau pour stocker les réalisateurs et leurs films
      loading: true, // Indicateur de chargement
      error: null,   // Gestion des erreurs
    };
  },
  async created() {
    try {
      // Requête pour récupérer les réalisateurs et leurs films
      const response = await fetch("http://localhost:3000/api/actors/famous"); // Remplacez par l'URL de votre backend

      // Vérification de la réponse
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      // Stocker les données des réalisateurs
      this.actors = await response.json();
    } catch (err) {
      console.error("Erreur lors de la récupération des acteurs :", err);
      this.error = "Une erreur est survenue lors de la récupération des acteurs.";
    } finally {
      this.loading = false; // Fin du chargement
    }
  },
};
</script>
<style scoped>

</style>
