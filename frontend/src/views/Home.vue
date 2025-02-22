<template>
  <div class="home-page">
    <div class="title">
      <h1 class="logo-title">FLIXTANEUSE</h1>
    </div>

    <div class="image-slider">
      <div class="slider-container">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="slider-image"
          :class="{ 
            active: index === currentImageIndex,
            next: index === (currentImageIndex + 1) % images.length
          }"
          :style="{ backgroundImage: `url(${image})` }"
        ></div>
      </div>
      <button @click="previousImage" class="nav-button previous-button">‹</button>
      <button @click="nextImage" class="nav-button next-button">›</button>
    </div>

    <h2>Liste des films</h2>
    <div class="film-container">
      <FilmCard
        v-for="film in films"
        :key="film._id"
        :film="film"
      />
    </div>
    
    <ActorFilm />
    <DirectorFilm />

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <Footer />
  </div>
</template>




<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import FilmCard from "@/components/film/FilmCard.vue";
import Footer from "@/components/Footer.vue";
import ActorFilm from "@/components/home/ActorFilm.vue";
import DirectorFilm from "@/components/home/DirectorFilm.vue";
import { useFilmStore } from "@/store/homefilmStore";

// Réactivité
const filmStore = useFilmStore();
const currentImageIndex = ref(0);
const autoSlide = ref(null);
const errorMessage = ref("");

// Images statiques
const images = ref([
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
      
]);

// Computed
const films = computed(() => filmStore.films);

// Cycle de vie
onMounted(() => {
  filmStore.fetchFilms().catch(() => {
    errorMessage.value = "Erreur de chargement des films";
  });
  startAutoSlide();
});


onBeforeRouteLeave(() => {
  filmStore.markForRefresh();
});

// Méthodes
const startAutoSlide = () => {
  stopAutoSlide();
  autoSlide.value = setInterval(nextImage, 7500);
};

const stopAutoSlide = () => {
  if (autoSlide.value) {
    clearInterval(autoSlide.value);
    autoSlide.value = null;
  }
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
};

const previousImage = () => {
  currentImageIndex.value = 
    (currentImageIndex.value - 1 + images.value.length) % images.value.length;
};

// Nettoyage
onBeforeUnmount(() => {
  stopAutoSlide();
  filmStore.$reset();
});
</script>


<style >
.image-slider {
  position: relative;
  width: 100%;
  height: 620px;
  overflow: hidden;
  margin: auto;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slider-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 1;
  transform: translateX(100%);
  transition: transform 0.5s ease, opacity 0.5s ease;
  z-index: 0;
}

.slider-image.active {
  opacity: 1;
  transform: translateX(0);
  z-index: 1;
}

.slider-image.next {
  opacity: 1;
  transform: translateX(0);
  z-index: 2;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 24px;
  z-index: 10;
}

.previous-button {
  left: 20px;
}

.next-button {
  right: 20px;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

@keyframes slide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
  @import "@/css/logo.css";
  @import "@/css/views/Home.css";
</style>
