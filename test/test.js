
const C = require('./test');

/**
mon console log mémo couleur
Black : "\x1b[30m" // Red : "\x1b[31m" // Green : "\x1b[32m" // Yellow : "\x1b[33m"
Blue : "\x1b[34m" // Magenta : "\x1b[35m" // Cyan : "\x1b[36m" // White : "\x1b[37m"xx
Gray : "\x1b[90m"xx

 * Use String for color, default color 'blue', the %s is the include text
 * @param {String} color 
 * @param {String} texte 
 * @returns 
 */
exports.log = (color, texte) => {
    switch (color) {
        case "red" :
        console.log (`\x1b[31m => %s\x1b[0m`, texte);
        break;
        case "green" :
        console.log (`\x1b[32m => %s\x1b[0m`, texte);
        break;
        case "yellow" :
        console.log (`\x1b[33m => %s\x1b[0m`, texte);
        break;
        case "magenta" :
        console.log (`\x1b[35m => %s\x1b[0m`, texte);
        break;
        case "cyan" : 
        console.log (`\x1b[36m => %s\x1b[0m`, texte);
        break;
        case "white" : 
        console.log (`\x1b[37m => %s\x1b[0m`, texte);
        break;
        case "grey" : 
        console.log (`\x1b[38m => %s\x1b[0m`, texte);
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
switch (section) {
    case 'users' :
        switch (page) {
        case '0' :
            C.log('magenta', 'pages de base'); 
        case 'findAllUsers' :
            C.log('green', 'findAllUsers');
            break;
        case 'findOneUser' :
            C.log('yellow', 'findOneUsers');
            break;
        case 'createUsers' :
            C.log('red', 'createUsers');
            break;
        case 'modifyUsers' :
            C.log('cyan', 'modifyUsers');
            break;
        default :
            C.log('variable page manquante');
        };
        break;
    case ('reservation') :
    switch (page) {
        case '0' :
            C.log('magenta', 'pages de base');
        case 'findAllReserv' :
            C.log('green', 'findAllReserv');
            break;
        case 'findForCatway' :
            C.log('grey', 'findForCatway');
            break;
        case 'findOneReserv' :
            C.log('yellow', 'findOneReserv');
            break;
        case 'createReserv' :
            C.log('red', 'createReserv');
            break;
        case 'modifyReserv' :
            C.log('cyan', 'modifyReserv');
            break;
        default :
            C.log('variable page manquante');
        };   
        break;
    case ('catway') :
        switch (page) {
        case '0' :
            C.log('magenta', 'pages de base') ; 
        case 'findAllCatway' :
            C.log('green', 'findAllCatway');
            break;
        case 'findOneCatway' :
            C.log('yellow', 'findOneCatway');
            break;
        case 'createCatway' :
            C.log('red', 'createCatway');
            break;
        case 'modifyCatway' :
            C.log('cyan', 'modifyCatway');
            break;
        default :
            C.log('variable page manquante');
        };   
        break;
    default :
        C.log('tableau de bord');
    };  
};



