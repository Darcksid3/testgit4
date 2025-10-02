const Mongoose = require('mongoose');
const JOI = require('joi');
const bcrypt = require('bcrypt');

const connexionSchema = require('../joi/connexionSchema');
const Users = require ('../models/users');
const C = require('./test');

exports.verifUsers = async (email,password) => {

    const temp = {
        email: email,
        password: password
    };

    //* valisation par joi du schéma
    const { error } = connexionSchema.validate(temp);
    if (error) {
        C.log('red', `Schéma joi incorrect ${error.details[0].message}`);
        return null;
    };

    try {
        const user = await Users.findOne({ email: email })

        if (!user) {
            C.log('red', `Tentative de connexion : Utilisateur ${email} non trouvé.`);
            return null; // Utilisateur non trouvé
        } 

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            C.log('red', `Tentative de connexion : Mot de passe incorrect pour ${email}.`);
            return null; // Mot de passe invalide
        }
        
        C.log('green', `L'email : ${user.email} a été trouvé et validé.`);
        // On retourne l'utilisateur pour récupérer son nom, etc.
        return user; 
        
    } catch (error) { 
        // Erreur serveur/base de données
        C.log('red', `Erreur de recherche ou de comparaison : ${error}`);
        return null;
    }
};