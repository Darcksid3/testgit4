const Joi = require('joi');

const catwaySchema = Joi.object({

    catwayNumber: Joi.string()
        .regex(/^[0-9]*$/)
        .required(),

    catwayType: Joi.string()
        .required(),

    catwayState: Joi.string()
        .min(2)
        .regex(/^[a-zA-Zà-üÀ-Ü\s'-.,:!;()]*$/)
        .required(),
  
});

module.exports = catwaySchema;