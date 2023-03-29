const Joi = require('joi');

const productSchema=Joi.object({
    title:Joi.string()
    .trim(true)
    .min(2)
    .max(60)
    .required(),
    description:Joi.string()
    .required(),
    thumbnail:Joi.string()
    .required(),
    price:Joi.number()
    .required()
    .integer(),
    category:Joi.string()
    .required(),
    stock:Joi.number()
    .default(1),
    ratings:Joi.array()
    .default([]),
    totalRating:Joi.number()
    .min(0)
    .max(5)
    .default(0)
}).unknown(true);

module.exports=productSchema
