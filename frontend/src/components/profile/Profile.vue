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

  /* User profile */

 /* User profile */
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 6em;
}

.profile-picture img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
}

.profile-info h1 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
  color: white;
}

.profile-info h2 {
  font-size: 18px;
  margin: 5px 0;
  color: white;
}

.logout button {
  margin: 7em 0;
  border: none;
  width: 12.5em;
  height: 3.125em;
  border-radius: 5px;
}

.logout button:hover {
  cursor: pointer;
  background-color: rgb(202, 16, 19);
}

/* Movie profile section */

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
}

.movie-profile-section {
  margin-top: 40px;
  width: 100%;
}

.movie-profile-section h2 {
  font-size: 20px;
  font-weight: bold;
  margin-left: 2em;
  margin-bottom: 50px;
  color: #1c5ca7;
}

.movie-profile-section p {
  text-align: center;
  color: #888;
  font-size: 16px;
  margin-top: 10px;
}

.movie-profile-section .film-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
}

.movie-profile-section .film-card-container .film-card {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

.movie-profile-section .film-card-container .film-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .user-profile {
    padding: 20px;
    max-width: 90%;
  }

  .profile-picture img {
    width: 80px;
    height: 80px;
  }

  .profile-info h1 {
    font-size: 20px;
  }

  .profile-info h2 {
    font-size: 16px;
  }

  .movie-profile-section .film-card-container {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

  </style>
  