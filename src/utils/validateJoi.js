const config=require('../config/index')
const productSchema=require('../models/joiSchemas/productSchema')
const userSchema=require('../models/joiSchemas/userSchema')

const productValidation = async (req, res, next) => {
	const payload = req.body
	const {error} = productSchema.validate(payload);
	if (error) {
		config.logger.info(error)
		res.status(406)
        return res.json(`Error in Product Data : ${error}`);
	} else {
		next();
	}
};

const userValidation= async (req, res, next) => {
	const payload = req.body
	const {error} = userSchema.validate(payload);
	if (error) {
		config.logger.info(error)
		res.status(406)
        return res.json(`Error in Product Data : ${error}`);
	} else {
		next();
	}
};

module.exports = {
	userValidation,
	productValidation,
}