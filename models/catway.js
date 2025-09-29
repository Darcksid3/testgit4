const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Catways = new Schema ({
    catwayNumber: { type: Number, trim: true, required: [true, `L'id est requis`], unique: true },
    catwayType: { type: String, trim: true, required: [true, `Le type est requis`]},
    catwayState: { type: String, trim: true, required: [true, `Le state est requis`] }
});

module.exports = mongoose.model('Catways', Catways);