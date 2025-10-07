const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const bcrypt = require('bcrypt');

const connexionSchema = require('../joi/connexionSchema');
const Users = require ('../models/users');

exports.verifUsers = async (email,password) => {

    const temp = {
        email: email,
        password: password
    };

    //* valisation par joi du schéma
    const { error } = connexionSchema.validate(temp);
    if (error) {
        return null;
    };

    try {
        const user = await Users.findOne({ email: email })

        if (!user) {
            return null; // Utilisateur non trouvé
        } 

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return null; // Mot de passe invalide
        }
        delete user._doc.password;
            const expireIn = 2 * 24 * 60 * 60;
            const token = jwt.sign({
                user: user
            },
            SECRET_KEY,
            {
                expiresIn: expireIn
            });

        return { user , token }; 
        
    } catch (error) { 
        return null;
    }
};