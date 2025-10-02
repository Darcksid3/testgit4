const Joi = require('joi');

const modifyUsersSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Zà-üÀ-Ü\s'-]*$/)
        .optional(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: true } })
        .optional(),

    password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&~#{(|\\\^@)=+$}%!/:.;?,])(.{10,})$/)
        .optional(),

});

module.exports = modifyUsersSchema;