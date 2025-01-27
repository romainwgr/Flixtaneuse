import { defineStore } from 'pinia';

export const useFilmStore = defineStore('filmStore', {
    persist: true, 

  state: () => ({
    films: [],
    actors:[],
    directors:[],
    selectedFilm: null, 
    errorMessage: '', 
    loading: false,


  }),
  actions: {
    async fetchFilms() {
      try {
          const response = await fetch('http://localhost:3000/api/films');
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
          }
          this.films = await response.json();
        
      } catch (error) {
        this.errorMessage = "Erreur lors de la récupération des films.";
        console.error(error);
      }
    },
    async fetchActorsFilms(){
        try {
            if (this.actors.length === 0) { // Évite les appels inutiles
                const response = await fetch("http://localhost:3000/api/actors/famous"); // Remplacez par l'URL de votre backend
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                this.actors = await response.json();
            }
        }catch (error) {
            this.errorMessage = "Erreur lors de la récupération des acteurs.";
            console.error(error);
        }  finally {
            this.loading = false; // Fin du chargement
        }
    },
    async fetchDirectorsFilms(){
        try {
            if (this.actors.length === 0) { // Évite les appels inutiles

            // Requête pour récupérer les réalisateurs et leurs films
            const response = await fetch("http://localhost:3000/api/directors/famous"); // Remplacez par l'URL de votre backend
      
            // Vérification de la réponse
            if (!response.ok) {
              throw new Error(`Erreur HTTP : ${response.status}`);
            }
      
            // Stocker les données des réalisateurs
            this.directors = await response.json();
        }
          }catch (error) {
            this.errorMessage = "Erreur lors de la récupération des réalisateurs.";
            console.error(error);
        }  finally {
            this.loading = false; // Fin du chargement
          }
    },
    clearSelectedFilm() {
      this.selectedFilm = null; // Réinitialise le film sélectionné
    },
  },
});
