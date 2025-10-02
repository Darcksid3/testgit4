const Joi = require('joi');

const catwaySchema = Joi.object({

    catwayNumber: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),

    catwayType: Joi.string()
        .valid('short', 'long')
        .required(),

    catwayState: Joi.string()
        .min(2)
        .regex(/^[a-zA-Zà-üÀ-Ü\s'-.,:!;()]*$/)
        .required(),

});

module.exports = catwaySchema;