// 1. Références DOM
const selectElement = document.getElementById('idFind-catway-select');
const formFindOneCatway = document.getElementById('Form_find_one_catway');
// Récupérer le type sélectionné par défaut (qui est 'all')
const initialType = document.querySelector('input[name="catwayType"]:checked').value;


// Fonction ASYNCHRONE pour appeler l'API et remplir la liste
async function fetchAndPopulate(catwayType) {
    // Vider les options actuelles
    selectElement.options.length = 0;
    
    // Construction de l'URL de l'API (ex: /catways/numbers/long)
    const url = `/catways/numbers/${catwayType}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Le serveur renvoie un tableau de numéros [1, 2, 5, 9, ...]
        const numbersArray = await response.json(); 

        // Remplir la liste déroulante avec les numéros reçus
        if (numbersArray.length === 0) {
            const optionElement = document.createElement('option');
            optionElement.innerText = `Aucun catway de type "${catwayType}" disponible`;
            optionElement.setAttribute('value', '');
            selectElement.appendChild(optionElement);
            return;
        }
        
        numbersArray.forEach(number => {
            const optionElement = document.createElement('option');
            optionElement.innerText = number;
            optionElement.setAttribute('value', number);
            selectElement.appendChild(optionElement);
        });
        
    } catch (error) {
        console.error("Erreur lors du chargement des numéros de catway:", error);
        const optionElement = document.createElement('option');
        optionElement.innerText = "Erreur de chargement des données";
        optionElement.setAttribute('value', '');
        selectElement.appendChild(optionElement);
    }
}


// --- 3. Événements ---

// A. Appel initial au chargement de la page (pour remplir la liste 'all')
document.addEventListener('DOMContentLoaded', () => {
    fetchAndPopulate(initialType);
});


// B. Écouteur pour le changement de bouton radio (type de catway)
document.querySelectorAll('input[name="catwayType"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        let item = event.target.value;
        console.log(`Type de catway sélectionné: ${item}`);
        fetchAndPopulate(item); // Recharge la liste avec le nouveau type
    });
});


// C. Logique de soumission du formulaire (méthode de redirection inchangée)
formFindOneCatway.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const idFind = document.getElementById('idFind-catway-select').value;
    
    if (idFind) {
        const url = `/catways/${idFind}?page=findOneCatway`; 
        window.location.replace(url); 
    } else {
        alert("Veuillez sélectionner un numéro de catway.");
    }
});