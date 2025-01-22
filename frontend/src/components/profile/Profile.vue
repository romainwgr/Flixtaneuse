<!-- 
    Composant qui affiche le profil d'un utilisateur avec 
    Sa photo de profil
    Son nom
-->
<template>
  <div class="user-profile">
    <div class="profile-picture">
      <img :src="user.profil_image || defaultImage" alt="Photo de profil" />
    </div>
    <div class="profile-info">
      <h1>{{ user.name }}</h1>
      <h2>Pseudo : {{ user.public_name }}</h2>
      <h2>E-mail : {{ user.email }}</h2>
    </div>

    <div class="movie-profile-section">
      <h2>Films favoris :</h2>
      <div v-if="films.length > 0" class="wrapper">
        <FilmCard
          v-for="film in films"
          :key="film._id"
          :film="film"
        />
      </div>
      <p v-else>Aucun film favoris !</p>
    </div>

    <div class="movie-profile-section">
      <h2>À regarder plus tard :</h2>
      <p>Vous avez tout visionné !</p>
    </div>
    <div class="logout">
      <button class="logout-button"
        :style="{ backgroundColor: 'red', color: 'white'}"
        @click="handleLogOut"
      >
        Se déconnecter
      </button>
    </div>
  </div>
</template>

  
  <script>
 import defaultImage from "../../assets/profil_img.jpg";
import FilmCard from "../film/FilmCard.vue"; 

export default {
  name: "UserProfile",
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({
        name: "Nom indisponible",
        profil_image: "",
      }),
    },
  },
  methods: {
    handleLogOut() {
      
      this.$emit("logout")
    },
  },
  data() {
    return {
      defaultImage, // Image par défaut
      films: [], // Films aimés
    };
  },
  components: {
    FilmCard,
  },
  async created() {
    try {
      const response = await fetch("http://localhost:3000/api/users/profile/liked-films", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      this.films = data; // Assurez-vous que le backend retourne un tableau de films
      console.log(this.films);
    } catch (error) {
      console.error("Erreur lors de la récupération des films aimés :", error.message);
    }
  },
};

</script>
  
<style scoped>
  @import "@/css/police.css";
  @import "@/css/composents/profile/Profile.css";
</style>
  