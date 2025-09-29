    //récupération du formulaire de recherche d'utilisateur
const formFindOneUser = document.getElementById('Form_find_one_users');
//mise en place de l'écoute
formFindOneUser.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire

    const email = document.getElementById('emailFind').value;
    const url = `/users/${email}`; // Crée l'URL avec l'email en tant que param
 
    //renvoie de l'adresse au bon format
    window.location.replace(url); // Redirige vers la nouvelle URL
});
