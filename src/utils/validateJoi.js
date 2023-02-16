const logger = require('../config/logger');
const productSchema=require('../models/joiSchemas/joi')

const productValidation = async (req, res, next) => {
	const payload = req.body
	const {error} = productSchema.validate(payload);
	if (error) {
		logger.info(error)
		res.status(406)
        return res.json(`Error in Product Data : ${error}`);
	} else {
		next();
	}
};
module.exports = productValidation;