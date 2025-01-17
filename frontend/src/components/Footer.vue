<!--
    Composant qui affiche le footer
-->
<template>
  <footer class="footer">
    <div class="partie_haute">
      <div class="start">
        <p class="police_flix">FLIXTANEUSE</p>
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

html, body {
  margin: 0;
  padding: 0;
  height: 100%; 
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

main {
  flex: 1;
}

.footer {
  color: #fff;
  text-align: center;
  width: 100%;
  margin-top: 20px;
  background-color: #110c16;
}

.partie_haute {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.start {
  font-size: 1em;
  margin-inline: 100px;
}

.start .police_flix {
  color: #243971;
  font-size: 3em;
  margin: 0;
}

.end {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  margin-inline: 100px;
  text-align: start;
}

.end div ul {
  padding: 0;
}

.end div ul li {
  list-style: none;
}

.partie_basse {
  display: flex;
  justify-content: center;
  gap: 20px;
}


</style>
