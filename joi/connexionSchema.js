const Joi = require('joi');

const connexionSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .required(),

  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&~#{(|\\\^@)=+$}%!/:.;?,])(.{10,})$/)
    .required(),

  repeat_password: Joi.ref('password')
});

module.exports = connexionSchema;