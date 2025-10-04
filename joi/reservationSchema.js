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
        .regex(/^[0-9a-zA-Zà-üÀ-Ü\s'-]*$/)
        .required(),

    startDate: Joi.alternatives().try(
        Joi.date().iso(),
        Joi.string()
    ).required(),

    endDate: Joi.alternatives().try(
        Joi.date().iso(),
        Joi.string()
    ).required(),
});

module.exports = reservationSchema;