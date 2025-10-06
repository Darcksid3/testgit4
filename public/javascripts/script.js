
let isActive = false;
function afficheForm() {
  const form = document.getElementById('form_login')
  if (!isActive) {
    form.style.display = 'block';
    isActive = true;
  } else {
    form.style.display = 'none';
    isActive = false;
  } 
};

/**
 * Use to create an random password 
 * @param {String} champ_mdp
 * @returns 
 */

function randomMdpGen(champ_mdp) {
  const minuscule = "abcdefghijklmnopqrstuvwxyz";
  const majuscule = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const chiffre = "1234567890";
  const symbole = "&~#{([-|_\\^@)=+$]}*%!/:.;?,";
  const allChars = minuscule + majuscule + chiffre + symbole;

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&~#{(|\\\^@)=+$}%!/:.;?,])(.{10,})$/;
  
  let genMdp = '';
  const minLength = 10;
  
  while (!regex.test(genMdp)) {
    genMdp = ''; 
    for (let i = 0; i < minLength; i++) {
      genMdp += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
  }
  const resultat = document.getElementById(champ_mdp)
  resultat.value = genMdp
  
}

/**
 * Use to display value of input password 
 * @param {String} champ_mdp 
 * @returns 
 */
let affichePassword = false;
function afficheMdp(champ_mdp) {
  const passwordElement = document.getElementById(champ_mdp);
  if (!affichePassword) {
    passwordElement.type="text"
    affichePassword = true;
  } else {
    passwordElement.type="password"
    affichePassword = false;
  }
};



