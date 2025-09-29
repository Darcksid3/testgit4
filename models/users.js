const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Package pour la création de tokens
const crypto = require('crypto');

const Users = new Schema({
    name: { type: String, trim: true, required: [true, 'Le nom est requis'] },
    email: { type: String, trim: true, required: [true, `L'email est requis`], unique: true, lowercase: true },
    password: { type: String, trim: true },
    /*
    // Champ pour vérifier l'état de l'email
    isVerified: { type: Boolean, default: false },
    // Champ pour stocker le token de vérification
    emailVerificationToken: String,
    // Champ pour la date d'expiration du token
    emailVerificationTokenExpires: Date
    */
}, {
    timestamps: true
});

// Middleware pour hacher le mot de passe avant la sauvegarde
Users.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});
/*
// Middleware pour générer le token de vérification avant la sauvegarde
Users.pre('save', function(next) {
    if (this.isNew) { // S'exécute uniquement lors de la création d'un nouvel utilisateur
        this.emailVerificationToken = crypto.randomBytes(20).toString('hex');
        // Le token expire dans 24 heures
        this.emailVerificationTokenExpires = Date.now() + 24 * 3600 * 1000;
    }
    next();
});
*/
module.exports = mongoose.model('Users', Users);