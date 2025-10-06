 //mise en place des champ de dates personalisé
    // récupération des champs
    const pStartDateElement = document.getElementById('p-startDate')
    const pEndtDateElement = document.getElementById('p-endDate')
    
    //définition des minimales
    const dte = new Date();
    
    let minYear = new Intl.DateTimeFormat("fr-FR", {year:"numeric"})
    minYear = minYear.format(dte)
    
    let minMonth = new Intl.DateTimeFormat("fr-FR", {month:"numeric"})
    minMonth = minMonth.format(dte)
    if(minMonth < 10){ minMonth = '0' + minMonth } // si inferrieur a 10 ajoute un 0 pour etre au format
    
    let minDay = new Intl.DateTimeFormat("fr-FR", {day:"numeric"})
    minDay = minDay.format(dte)
    if(minDay < 10){ minDay = '0' + minDay } // si inferrieur a 10 ajoute un 0 pour etre au format
    
    let minDate = `${minYear}-${minMonth}-${minDay}`
    // injexion dans les champs
    pStartDateElement.innerHTML = `
        <label for="startDate">Date de début</label>
        <input type="date" name="startDate" id="startDate" min="${minDate}" value="${minDate}" required/>
        `
    pEndtDateElement.innerHTML= `
        <label for="endDate">Date de fin</label>
        <input type="date" name="endDate" id="endDate" min="${minDate}" value="${minDate}" required />
        `

const form = document.getElementById('Form-create-reservation'); 

const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');   
const typeRadios = document.querySelectorAll('input[name="catwayType"]');
const selectElement = document.getElementById('idFind-catway-select');

let availableCatways = { short: [], long: [] };

// Fonction utilitaire pour remplir le select
function populateSelect(numbersArray) {
    selectElement.options.length = 0; 
    
    if (numbersArray.length === 0) {
        const option = document.createElement('option');
        option.innerText = "Aucun catway disponible pour cette période";
        option.value = '';
        selectElement.appendChild(option);
        return;
    }

    numbersArray.forEach(number => {
        const option = document.createElement('option');
        option.innerText = `Catway ${number}`;
        option.value = number;
        selectElement.appendChild(option);
    });
}

// Fonction ASYNCHRONE pour appeler l'API et mettre à jour les disponibilités
async function updateAvailabilities() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    // Vérification simple que les deux dates sont sélectionnées
    if (!startDate || !endDate) {
        availableCatways = { short: [], long: [] }; 
        populateSelect([]); 
        return; 
    }
    
    const url = `/catways/disponibility?startDate=${startDate}&endDate=${endDate}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        availableCatways = data; 
        
        const currentType = document.querySelector('input[name="catwayType"]:checked').value;
        const listToDisplay = availableCatways[currentType] || [];
        populateSelect(listToDisplay);
        
    } catch (error) {
        console.error("Erreur de chargement des disponibilités:", error);
        alert("Erreur lors de la vérification des disponibilités.");
    }
}

startDateInput.addEventListener('change', updateAvailabilities);
endDateInput.addEventListener('change', updateAvailabilities);

typeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        
        // Si le type sélectionné est 'all', il faut combiner les deux listes short et long
        if (selectedType === 'all') {
            const allAvailable = [...availableCatways.short, ...availableCatways.long].sort((a, b) => a - b);
            populateSelect(allAvailable);
        } else {
            // Sinon, afficher la liste correspondante (short ou long)
            const listToDisplay = availableCatways[selectedType] || [];
            populateSelect(listToDisplay);
        }
    });
});

selectElement.addEventListener('change', () => {

    choice = selectElement.selectedIndex  
    let idCatway = selectElement.options[choice].value
    console.log(idCatway)
    form.setAttribute('action', `/catways/${idCatway}/reservations`)
    console.log(form)
})

document.addEventListener('DOMContentLoaded', () => {
    // Mettre 'all' par défaut si c'est le comportement attendu
    const allInput = document.getElementById('all');
    if (allInput) {
        allInput.checked = true;
    }
    updateAvailabilities();
});