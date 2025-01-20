<!--
    Composant qui affiche la barre de navigation
-->
<template>
  <nav :class="{ navbar: true, scrolled: isScrolled }">
    <router-link to="/" class="logo"> <img class="logo" src="../assets/logo.png" alt="logo"> </router-link>
    <div class="navlinks">
      <ul>
        <li v-for="(link, index) in filteredLinks" :key="index">
          <router-link :to="link.path">
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
      isScrolled: false, 
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
      this.isScrolled = window.scrollY > 50;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};

</script>

<style scoped>
 @import "@/css/composents/Navbar.css";
</style>
