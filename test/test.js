const C = require('./test');

exports.test = () => {
  return C.log('red','Hello World !')
}

// mon console log
// couleur
// Black : "\x1b[30m"
// Red : "\x1b[31m"
// Green : "\x1b[32m"
// Yellow : "\x1b[33m"
// Blue : "\x1b[34m"
// Magenta : "\x1b[35m"
// Cyan : "\x1b[36m"
// White : "\x1b[37m"
// Gray : "\x1b[90m"
/**
 * Use String for color, default color 'blue' 
 * @param {String} color 
 * @param {String} texte 
 * @returns 
 */
exports.log = (color, texte) => {
  switch (color) {
    case "green" :
    console.log (`\x1b[32m => %s\x1b[0m`, texte);
    break;
    case "yellow" :
    console.log (`\x1b[33m => %s\x1b[0m`, texte);
    break;
    case "red" :
    console.log (`\x1b[31m => %s\x1b[0m`, texte);
    break;
    case "magenta" :
    console.log (`\x1b[35m => %s\x1b[0m`, texte);
    break;
    default :
    console.log (`\x1b[34m => %s\x1b[0m`, texte);
  }
  
};

/**
 * Select partials to display' 
 * @param {String} section
 * @param {String} page
 * @returns 
 */
exports.page = (section, page) => {
  if (section === 'users') {
    switch (page) {
      case '0' :
        C.log('magenta', 'pages de base')  
      case 'findAllUsers' :
        C.log('green', 'findAllUsers');
        break;
      case 'findOneUser' :
        C.log('yellow', 'findOneUsers')
        break;
      case 'createUsers' :
        C.log('red', 'createUsers')
        break;
      default :
        C.log('default', 'variable page manquante')
    };
  };
  if (section === 'reservation') {
    switch (page) {
      case '0' :
        C.log('magenta', 'pages de base')  
      case 'findAllReserv' :
        C.log('green', 'findAllReserv');
        break;
      case 'findOneReserv' :
        C.log('yellow', 'findOneReserv')
        break;
      case 'createReserv' :
        C.log('red', 'createReserv')
        break;
      default :
        C.log('default', 'variable page manquante')
    };    
  };
  if (section === 'catway') {
    switch (page) {
      case '0' :
        C.log('magenta', 'pages de base')  
      case 'findAllCat' :
        C.log('green', 'findAllCat');
        break;
      case 'findOneCat' :
        C.log('yellow', 'findOneCat')
        break;
      case 'createCat' :
        C.log('red', 'createCat')
        break;
      default :
        C.log('default', 'variable page manquante')
    };    
  };  
};

/**
 * verify if email and password match' 
 * @param {String} email
 * @param {String} password
 * @returns 
 */
exports.verifUser = (email, password) => {
    const info = {
    email: 'test@test.com',
    password: '1234'
  };
    if ( email === info.email && password === info.password ) {
    return true
  } else {
    return false
  } 
 
};


