    //remplisage du select de numéro de catway dispo
    //créé un bouton radio pour sélectionner la taille du catway et crée une liste en fonction du radio choisit
    const all = [1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    const short = [1,2,3,4,6,7,8,11,12,13,14,16,17,18,19,21,22,23,24];
    const long = [5,9,10,15,20];
    
    const selectElement = document.querySelector('select')
    function selectOpt(array) {
        for (let i = 0; i < array.length; i++) {
        const optionElement =  document.createElement('option');
        optionElement.innerText=array[i]
        optionElement.setAttribute('value', array[i])
        selectElement.appendChild(optionElement)
        }
    };
    selectOpt(all)
    if (document.querySelector('input[name="catwayType"]')) {
        document.querySelectorAll('input[name="catwayType"]').forEach((elem) => {
            elem.addEventListener("change", function(event) {
            
            
            let item = event.target.value;
            console.log(item);
            if (item === 'short') {
                selectElement.options.length=0;
                selectOpt(short)
            
            } else if (item === 'long'){ 
                selectElement.options.length=0;
                selectOpt(long)
            } else {
                selectElement.options.length=0
                selectOpt(all)
            }
        });
    });
    };
    const formFindOneCatway = document.getElementById('Form_find_one_catway');
    //mise en place de l'écoute
    formFindOneCatway.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire

        const idFind = document.getElementById('idFind-catway-select').value;
        const url = `/catways/${idFind}`; // Crée l'URL avec l'email en tant que param
    
        //renvoie de l'adresse au bon format
        window.location.replace(url); // Redirige vers la nouvelle URL
    });