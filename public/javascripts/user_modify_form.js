
const userEmail = document.getElementById('email').value;
const formModifyUser = document.getElementById('Form-modify-user');

formModifyUser.addEventListener('submit', async (e) => {
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
            window.location.href = '/users?page=findAllUsers';
        } else {
            console.error("Échec de la mise à jour");
        }
    } catch (error) {
        const errorData = await response.json(); 
        const errorMessage = errorData.details || errorData.message || response.statusText;
            
        console.error("Échec de la mise à jour:", errorMessage);
            
        }
});

const formDeleteUser = document.getElementById('Form-delete-user');
formDeleteUser.addEventListener('submit', async (e) => {
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
            console.log(`Supression de l'utilisateur ${userEmail}`)
            window.location.replace('/users?page=findAllUsers');
        } else {
            const errorText = await response.text();
            console.error(`Erreur de suppression: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error("Erreur réseau ou script", error);
    }
});

