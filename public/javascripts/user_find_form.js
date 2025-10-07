    
const formFindOneUser = document.getElementById('Form_find_one_users');

formFindOneUser.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const email = document.getElementById('emailFind').value;
    //const url = `/users/${email}`; 
    if (email) {
    const url = `/users/${email}?page=findOneUsers`;
    window.location.replace(url);
    }
    
    //window.location.replace(url); 
    
});
