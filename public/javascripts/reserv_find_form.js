
    //récupération des id disponible
    const selectElement = document.querySelector('select');
    const idArray = [1,2,4,5,6,9,10,13];
    console.log(selectElement)
    for (let i = 0; i < idArray.length; i++) {
        
        const optionElement =  document.createElement('option');
        optionElement.innerText=idArray[i]
        optionElement.setAttribute('value', idArray[i])
        selectElement.appendChild(optionElement)
    };
    const formFindOneReservation = document.getElementById('Form_find_one_reservation');
    //mise en place de l'écoute
    formFindOneReservation.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire

        const idFind = document.getElementById('idFind-reserv-select').value;
        const url = `/reservation/${idFind}`; // Crée l'URL avec l'email en tant que param
    
        //renvoie de l'adresse au bon format
        window.location.replace(url); // Redirige vers la nouvelle URL
    });