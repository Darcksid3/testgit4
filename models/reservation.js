const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Reservation = new Schema ({
    catwayNumber: { type: Number, trim: true, required: [true, `L'id est requis`]},
    clientName: { type: String, trim: true, required: [true, `Le nom du client est requis`]},
    boatName: { type: String, trim: true, required: [true, `Le nom du bateaurequis`]},
    startDate: { type: Date, trim: true, required: [true, `La date de début est requise`] },
    endDate: { type: Date, trim: true, required: [true, `La date de fin est requise`]}
});

module.exports = mongoose.model('Reservation', Reservation);