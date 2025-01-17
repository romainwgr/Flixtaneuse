<!--
    Composant qui affiche la barre de navigation
-->
<template>
  <nav :class="{ navbar: true, scrolled: isScrolled }">
    <router-link to="/" class="logo"> <img class="logo" src="../assets/logo.png" alt="logo"> </router-link>
    <div class="navlinks">
      <ul>
        <!-- Filtre les liens avec showInNavbar à true -->
        <li v-for="(link, index) in filteredLinks" :key="index">
          <router-link :to="link.path">
            <!-- Affiche l'icône associée -->
            <img :src="link.icon" :alt="link.name" />
          </router-link>
        </li>
      </ul>
    </div>
  
  </nav>
</template>

<script>
import homeIcon from '@/assets/home.svg';
import searchIcon from '@/assets/loupe.svg';
import profileIcon from '@/assets/profile.svg';

import navigationLinks from '@/config/navigation.js';

export default {
  name: 'Navbar',
  data() {
    return {
      isScrolled: false, // Suivi de l'état de défilement
      navigationLinks: navigationLinks.map(link => {
        const iconMap = {
          Accueil: homeIcon,
          'Recherche de films': searchIcon,
          Profil: profileIcon
        };
        return { ...link, icon: iconMap[link.name] || null };
      })
    };
  },
  computed: {
    filteredLinks() {
      return this.navigationLinks.filter(link => link.showInNavbar);
    }
  },
  methods: {
    handleScroll() {
      // Vérifie si l'utilisateur a scrollé
      this.isScrolled = window.scrollY > 50; // Par exemple, 50px de défilement
    }
  },
  mounted() {
    // Ajoute un écouteur d'événement scroll à la fenêtre
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    // Nettoie l'écouteur pour éviter les fuites de mémoire
    window.removeEventListener('scroll', this.handleScroll);
  }
};

</script>

<style scoped>

nav {
  position: fixed;
  top: 0;
  width: 100%;
  height : 4.2em;
  padding: 0.5em 0;
  display: flex;
  justify-content: space-between; 
  align-items: center;           
  background-color: rgba(51, 51, 51, 0);
  z-index: 1000;
  transition: all 0.3s ease;
}

.navlinks {
  display: flex;
  justify-content: center;  
  margin: 0em 1em;
}

.logo {
  margin-inline: 20px;
  list-style: none;
}

img {
  width: 50px;
  height: auto;
}

.navlinks ul {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.5em;
  margin: 0;
  padding: 0;
}

.navlinks li {
  padding: 1em;
  color: white;
  border-radius: 5px;
}

a {
  color: inherit;
  text-decoration: none;
}

a.router-link-exact-active img:not(.logo img){
  opacity: 0.5;
}

.navlinks li[data-v-41458b80] {
  padding: 0 1em ;
}

.navlinks img {
  width: 32px;
}

.navlinks img[alt="Accueil"] {
  width: 42px;
}

.navbar.scrolled {
    background-color: rgb(29, 29, 29);
    height: 2.8em;
}
</style>
