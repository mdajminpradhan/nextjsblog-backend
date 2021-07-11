const Category = require('../models/category');
const Joi = require('joi');

// category param
exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((error, category) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not get any category'
			});
		}

		req.category = category;
		next();
	});
};

// create category
exports.createCategory = (req, res) => {
	console.log(req.file);

	// data validation
	const schema = Joi.object({
		title: Joi.string().min(3).max(15).required().messages({
			'string.base': `"Category" should be a type of 'text'`,
			'string.empty': `"Category" cannot be an empty field`,
			'string.min': `"Category" should have a minimum length of {#limit}`,
			'any.required': `"Category" is a required field`
		})
	});

	const { error, success } = schema.validate(req.body);

	if (error) {
		return res.status(422).json({
			error: error.details[0].message
		});
	}

	const category = new Category(req.body);

	category.save((error, category) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not create category',
				error
			});
		}

		// sending response
		res.json(category);
	});
};

// getting categories
exports.getAllCategory = (req, res) => {

	console.log('hey')

	// getting category from database
	Category.find().exec((error, categories) => {
		if (error) {
			return res.status(400).json({
				error: 'There are no categores'
			});
		}

		// sending response
		res.json(categories);
	});
};

// get category by id
exports.getCat = (req, res) => {
	return res.json(req.category);
};

// update category
exports.updateCategory = (req, res) => {
	console.log(req.body);

	// data validation

	const schema = Joi.object({
		title: Joi.string().min(3).max(15).required().messages({
			'string.base': `"Category" should be a type of 'text'`,
			'string.empty': `"Category" cannot be an empty field`,
			'string.min': `"Category" should have a minimum length of {#limit}`,
			'any.required': `"Category" is a required field`
		})
	});

	const { error, success } = schema.validate(req.body);

	if (error) {
		return res.status(422).json({
			error: error.details[0].message
		});
	}

	let category = req.category;

	// updating category in database
	category.title = req.body.title;

	category.save((error, category) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not create category',
				error
			});
		}

		// sending response
		res.json(category);
	});
};

// delete category
exports.deleteCategory = (req, res) => {
	// getting category from parameter
	const category = req.category;

	// deleting category from database
	category.remove((error, deletedCategory) => {
		if (error) {
			return res.status(400).json({
				error: 'Category could not be removed'
			});
		}

		// sending response
		res.json(deletedCategory);
	});
};
