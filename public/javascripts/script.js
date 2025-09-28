// afficher/cacher le formulaire d connexion sur la page d'acueil

/**
 * Display or not the login form 
 */

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
  console.log('click :')
  let genMdp = '';
  //déclaration des valeurs possible
  const minuscule = "abcdefghijklmnopqrstuvwxyz".split("");
  const majuscule = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const chiffre = "1234567890".split("");
  const symbole = "&~#{([-|_\\^@)=+$]}*%!/:.;?,".split("");
  
  const size = 10;
  
  for (let i=0; i<size; i++) {
    //console.log(i)
    let rnd_min = minuscule[Math.floor(Math.random()*minuscule.length)];
    let rnd_maj = majuscule[Math.floor(Math.random()*majuscule.length)];
    let rnd_chi = chiffre[Math.floor(Math.random()*chiffre.length)];
    let rnd_sym = symbole[Math.floor(Math.random()*symbole.length)];
    const option = [rnd_min, rnd_maj, rnd_chi, rnd_sym]; 
    let rnd_opt = option[Math.floor(Math.random()*option.length)];
    //console.log(rnd_opt)
    
    genMdp += rnd_opt
  }
  console.log(`mdp gen => ${genMdp}`)
  const resultat = document.getElementById(champ_mdp)
  resultat.value = genMdp; 
};

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



