
const catwayNumber = document.getElementById('catwayNumber').value;
const formModifyCatway = document.getElementById('Form-modify-catway');

formModifyCatway.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const url = e.target.action;

    try {
        const response = await fetch(url, {
            method:'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = '/catways?page=findAllCatway';
        } else {
            console.error("Échec de la mise à jour");
        }
    } catch (error) {
        console.error("Erreur réseau:", error);
    }
});

const formDeleteCatway = document.getElementById('Form-delete-catway');
formDeleteCatway.addEventListener('submit', async (e) => {
    console.log('test')
    e.preventDefault();
    const url = e.target.action;
    try {
        const response = await fetch(url, {
            method:'DELETE',
            headers:{
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            window.location.replace('/catways?page=findAllCatway');
        } else {
            const errorText = await response.text();
            console.error(`Erreur de suppression: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error("Erreur réseau ou script", error);
    }
});

