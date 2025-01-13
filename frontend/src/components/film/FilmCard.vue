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
.film-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  border: none;
  width: 200px; 
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
} 

.film-card:hover {
  transform: scale(1.05); /* Zoom subtil au survol */
}

.film-card__image-container {
  width: 150px; /* Largeur fixe pour toutes les images */
  height: 225px; /* Hauteur fixe pour toutes les images */
  overflow: hidden; /* Cache les parties débordantes de l'image */
  border-radius: 8px; /* Coins arrondis */
  margin-bottom: 10px; /* Espace entre l'image et le titre */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000; /* Couleur de fond au cas où l'image ne charge pas */
}

.film-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* L'image couvre toute la zone sans déformer */
}

.film-card__title {
  font-size: 16px; /* Taille du texte */
  color: white;
  margin: 10px 0 0; /* Espacement supérieur */
  white-space: nowrap; /* Empêche le texte de prendre plusieurs lignes */
  overflow: hidden; /* Cache le texte débordant */
  text-overflow: ellipsis; /* Ajoute des points de suspension pour les titres trop longs */
  width: 80%; 
}


.error {
  color: red;
  text-align: center;
  font-size: 14px;
}

</style>
