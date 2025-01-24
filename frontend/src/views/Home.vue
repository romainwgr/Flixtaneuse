<template>
  <div class="home-page">
    <!-- Carousel d'images -->
    <div class="image-slider">
      <div class="slider-container">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="slider-image"
          :class="{
            active: index === currentImageIndex,
            'transition-right': slideDirection === 'right' && index !== currentImageIndex,
            'transition-left': slideDirection === 'left' && index !== currentImageIndex,
          }"
          :style="{ backgroundImage: `url(${image})` }"
        ></div>
      </div>
      <button @click="previousImage" class="nav-button previous-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M16.207 4.293a1 1 0 0 1 0 1.414L9.914 12l6.293 6.293a1 1 0 0 1-1.414 1.414L8.5 13.414a2 2 0 0 1 0-2.828l6.293-6.293a1 1 0 0 1 1.414 0" clip-rule="evenodd"/></svg>
      </button>
      <button @click="nextImage" class="nav-button next-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.793 19.707a1 1 0 0 1 0-1.414L14.086 12L7.793 5.707a1 1 0 0 1 1.414-1.414l6.293 6.293a2 2 0 0 1 0 2.828l-6.293 6.293a1 1 0 0 1-1.414 0" clip-rule="evenodd"/></svg>      
      </button>
    </div>
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
    Footer,
    ActorFilm,
    DirectorFilm,
  },
  data() {
    return {
      images: [ // Liens des images du carousel
        "https://alarencontreduseptiemeart.com/wp-content/uploads/2014/12/Citizen-Kane-3.jpg",
        "https://i.redd.it/the-shawshank-redemption-1994-v0-89w86dd84lpd1.jpg?width=1280&format=pjpg&auto=webp&s=8b1123e48aa750065503b7d5e91df3be66c92fb0",
        "https://media.vanityfair.fr/photos/60d34fef828a7f42e233bd09/16:9/w_1280,c_limit/vf_casablanca_slider_9411.jpeg",
        "https://www.ecranlarge.com/content/uploads/2020/04/le-parrain-photo-marlon-brando-1173783.jpg",
        "https://thepoly.org/assets/uploads/events/pulp_fiction.jpg",
        "https://www.slate.fr/uploads/store/story_105531/large_landscape_105531.jpg",
        "https://preview.redd.it/blade-runner-1982-is-incredible-v0-oxrysr9nll7d1.jpg?width=1280&format=pjpg&auto=webp&s=776c81943332f03b8cb757fedd8ad9b925bd019a",
        "https://focus.telerama.fr/2024/09/25/21/0/1486/990/1600/1067/60/0/64ae7e0_1727271695334-capture-da-ei-cran-2024-09-25-ai-15-41-29.png",
        "https://static.films-horreur.com/2015/06/kaaDA8tNOvTOuUxyQ5SVRDHNGfe.jpg",
        "https://www.radiofrance.fr/s3/cruiser-production/2020/01/d5233f35-83c7-4fd6-9ced-c9d16a0bfede/1200x680_smith.jpg",
        "https://lvdneng.rosselcdn.net/sites/default/files/dpistyles_v2/ena_16_9_extra_big/2019/07/16/node_613915/40404351/public/2019/07/16/B9720279716Z.1_20190716103716_000%2BGMKE2U29I.1-0.jpg?itok=aThyEBmQ1563270185",
        "https://i.ytimg.com/vi/IvAoQAt1WBM/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-DoACuAiKAgwIABABGDEgZChyMA8=&rs=AOn4CLDacyJC5bIWxjgrT90Yxea-aGsj5w",
        "https://ekladata.com/1azW2R_uuiv_QguyKBB0WFdfIo8.png",
        "https://media.senscritique.com/media/000019422667/0/the_big_lebowski.jpg",
        "https://www.racinecafe.fr/wp-content/uploads/2024/11/MSDFOGU_EC011.jpg",
        "https://www.critikat.com/wp-content/uploads/fly-images/202548/382523.jpg-r_1920_1080-f_jpg-q_x-xxyxx-1450x800-c.jpg",
        "https://media.senscritique.com/media/000008256223/0/mad_max_fury_road.jpg",
        "https://assets.mubicdn.net/images/film/204/image-w1280.jpg?1607625735",
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3ugX6nKTpjpuZZSj4fS4wgjhyNqB0aihQaSFAUyhzM3hIDRfkSAYHVBu5pgQbbSW-DAMZpGRXbHrG6YB3-NlI8G5YZdVFdvlURxPrVvcAxzTz6ZB9XXu_KOLPayFMjlXkzomj4ThfTuU/s1600/vlcsnap-2013-02-13-22h04m27s69.jpg",
        "https://laac-auvergnerhonealpes.org/wp-content/uploads/2017/03/OverlookHotelShining.png",
      ],
      currentImageIndex: 0,
      autoSlide: null,
      films: [],
      errorMessage: "",
      slideDirection: "right", // Détermine la direction de la transition
    };
  },
  methods: {
    startAutoSlide() {
      if (this.autoSlide) {
        clearInterval(this.autoSlide);
      }
      this.autoSlide = setInterval(this.nextImage, 7500); // Défile toutes les 7,5 secondes
    },
    nextImage() {
      this.slideDirection = "right"; // Définit la direction vers la droite
      this.updateIndexes(1); // Passe à l'image suivante
      this.startAutoSlide(); // Redémarre le compteur après un clic

    },
    previousImage() {
      this.slideDirection = "left"; // Définit la direction vers la gauche
      this.updateIndexes(-1); // Revient à l'image précédente
      this.startAutoSlide(); // Redémarre le compteur après un clic
    },
    updateIndexes(step) {
      const imagesLength = this.images.length;
      this.currentImageIndex =
        (this.currentImageIndex + step + imagesLength) % imagesLength;
    },
    async fetchFilms() {
      try {
        const response = await fetch("http://localhost:3000/api/films");
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        const data = await response.json();
        this.films = data; // Stocke les films récupérés
      } catch (error) {
        this.errorMessage =
          "Erreur lors de la récupération des films : " + error.message;
        console.error(error);
      }
    },
  },
  async created() {
    this.startAutoSlide(); // Lance l'auto-slide au démarrage
    await this.fetchFilms(); // Récupère les films
  },
  beforeDestroy() {
    if (this.autoSlide) {
      clearInterval(this.autoSlide); // Nettoie l'intervalle avant la destruction du composant
    }
  },
};
</script>

<style>
@import "@/css/logo.css";
@import "@/css/views/Home.css";
</style>
