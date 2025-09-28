

    //récupération des id disponible
    const selectElement = document.querySelector('select');
    const idArray = [1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    console.log(selectElement)
    for (let i = 0; i < idArray.length; i++) {
        
        const optionElement =  document.createElement('option');
        optionElement.innerText=idArray[i]
        optionElement.setAttribute('value', idArray[i])
        selectElement.appendChild(optionElement)
    };
    const formFindOneCatway = document.getElementById('Form_find_one_catway');
    //mise en place de l'écoute
    formFindOneCatway.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire

        const idFind = document.getElementById('idFind-select').value;
        const url = `/catways/${idFind}`; // Crée l'URL avec l'email en tant que param
    
        //renvoie de l'adresse au bon format
        window.location.replace(url); // Redirige vers la nouvelle URL
    });

