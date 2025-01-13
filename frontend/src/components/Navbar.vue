<!--
    Composant qui affiche la barre de navigation
-->
<template>
  <nav>
    <router-link to="/" class="police_flix logo">F</router-link>
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
      navigationLinks: navigationLinks.map(link => {
        // Associe les icônes aux liens correspondants
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
      // Filtre uniquement les liens où showInNavbar est true
      return this.navigationLinks.filter(link => link.showInNavbar);
    }
  }
};
</script>

<style scoped>

nav {
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navlinks {
  padding: 1em;
}

.logo {
  font-size: 50px;
  color: #243971;
  padding: 0;
  margin-inline: 20px;
  list-style: none;
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

a.router-link-exact-active img {
  opacity: 0.5;
}

.navlinks img {
  width: 32px;
}

.navlinks img[alt="Accueil"] {
  width: 42px;
}
</style>
