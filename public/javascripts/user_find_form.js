    
const formFindOneUser = document.getElementById('Form_find_one_users');

formFindOneUser.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const email = document.getElementById('emailFind').value;
    const url = `/users/${email}`; 
 
    
    window.location.replace(url); 
});
