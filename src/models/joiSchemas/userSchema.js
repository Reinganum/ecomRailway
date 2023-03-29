const Joi = require('joi');

const userSchema=Joi.object({
    firstname:Joi.string()
    .trim(true)
    .min(3)
    .max(20)
    .required(),
    lastname:Joi.string()
    .min(3)
    .max(20)
    .required(),
    avatar:Joi.string()
    .default('/user.jpg'),
    mobile:Joi.number()
    .required()
    .integer(),
    password:Joi.string()
    .required(),
    email:Joi.string()
    .required(),
    cart:Joi.array()
    .default([]),
    role:Joi.string()
    .default("user"),
    isBlocked:Joi.boolean()
    .default(false),
    adress:Joi.string(),
    wishlist:Joi.array()
    .default([])
}).unknown(true);

module.exports=userSchema