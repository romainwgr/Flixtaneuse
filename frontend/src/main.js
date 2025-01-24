import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import du routeur
import { jwtDecode } from "jwt-decode";
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'



// Vérification du token au démarrage
const token = localStorage.getItem("token");
if (token) {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
        console.log("Token expiré, suppression.");
        localStorage.removeItem("token");
    }
}
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

const app = createApp(App);

app.use(pinia);

app.use(router); // Utilisation du routeur dans l'application
app.mount('#app');
