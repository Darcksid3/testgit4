const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Users = new Schema ({
    name: { type: String, trim: true, required: [true, 'Le nom est requis'] },
    email: { type: String, trim: true, required: [true, `L'email est requis`], unique: true, lowercase: true },
    password: { type: String, trim: true }
}, {
    // ajoute 2 champs au document createdAT et updatedAT
    timestamps: true
});

// Hash le mot de passe quand il est modifié

Users.pre('save', function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);

    next();

})

module.exports = mongoose.model('Users', Users);