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
  
      <!-- Affichage des réalisateurs et de leurs films -->
      <div v-else>
        <div v-for="director in directors" :key="director.director" class="director-section">
          <h2>Films du réalisateur {{ director.name }}</h2>
  
          <!-- Affichez ici la liste des films pour chaque réalisateur -->
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

export default {
    
  name: "DirectorFilm",
  components: {
    FilmCard,

  },
  data() {
    return {
      films : [],
      directors: [], // Tableau pour stocker les réalisateurs et leurs films
      loading: true, // Indicateur de chargement
      error: null,   // Gestion des erreurs
    };
  },
  async created() {
    try {
      // Requête pour récupérer les réalisateurs et leurs films
      const response = await fetch("http://localhost:3000/api/directors/famous"); // Remplacez par l'URL de votre backend

      // Vérification de la réponse
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      // Stocker les données des réalisateurs
      this.directors = await response.json();
    } catch (err) {
      console.error("Erreur lors de la récupération des réalisateurs :", err);
      this.error = "Une erreur est survenue lors de la récupération des réalisateurs.";
    } finally {
      this.loading = false; // Fin du chargement
    }
  },
};
</script>
<style scoped>

</style>
