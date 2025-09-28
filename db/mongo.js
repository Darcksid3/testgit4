const mongoose = require('mongoose');
const C = require('../test/test');


exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        C.log('green', 'Connecté à la base de donnée !');
    } catch (error) {
        C.log('red', error);
        throw error;
    }
}