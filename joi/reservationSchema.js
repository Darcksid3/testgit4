const Joi = require('joi');

const reservationSchema = Joi.object({

    catwayNumber: Joi.number()
        .required(),


    clientName: Joi.string()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Zà-üÀ-Ü\s'-]*$/)
        .required(),

    boatName: Joi.string()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Zà-üÀ-Ü\s'-]*$/)
        .required(),
 
    startDate: Joi.date()
        .required(),
 
    endDate: Joi.date()
        .required(),
});

module.exports = reservationSchema;