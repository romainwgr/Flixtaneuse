<!--
    Composant qui affiche le footer
-->
<template>
  <footer class="footer">
    <div class="partie_haute">
      <div class="start">
        <p class="logo-title">FLIXTANEUSE</p>
        <p>&copy; 2025 FlixTaneuse, tous droits réservés</p>
      </div>
      <div class="end">
        <div>
          <ul>
            <li v-for="(link, index) in filteredLinks" :key="index">
              <router-link :to="link.path">{{ link.name }}</router-link>
            </li>
          </ul>
        </div>
        <div>
          <p>A propos de nous</p>
          <p>Contactez-nous</p>
        </div>
      </div>
    </div>
    <div class="partie_basse">
      <p>Mentions légales</p>
      <p>Politique de confidentialité</p>
    </div>
  </footer>
</template>

<script>
import navigationLinks from '@/config/navigation.js';

export default {
  name: 'Footer',
  data() {
    return {
      navigationLinks
    };
  },
  computed: {
    filteredLinks() {
      return this.navigationLinks.filter(link => link.showInNavbar
      );
    }
  }
};
</script>

<style scoped>
  @import "@/css/composents/Footer.css";
  @import "@/css/logo.css";
  @import "@/css/police.css";
  
</style>
