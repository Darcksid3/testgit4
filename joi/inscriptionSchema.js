const Joi = require('joi');

const inscriptionSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Zà-üÀ-Ü\s'-]*$/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .required(),

  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&~#{(|\\\^@)=+$}%!/:.;?,])(.{10,})$/)
    .required(),

  repeat_password: Joi.ref('password')
});

module.exports = inscriptionSchema;