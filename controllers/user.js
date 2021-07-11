const User = require('../models/user');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');

// get profile by id
exports.getProfileById = (req, res, next, id) => {
	User.findById(id).exec((error, user) => {
		if (error || !user) {
			return res.status(422).json({
				error: 'NO user found'
			});
		}

		req.profile = user;
		next();
	});
};

// create account
exports.createAccount = (req, res) => {

	console.log(req.body);

	// validation schema
	const schema = Joi.object({
		name: Joi.string().min(3).max(20).required().messages({
			'string.base': `"Name" should be a type of 'text'`,
			'string.empty': `"Name" cannot be an empty field`,
			'string.min': `"Name" should have a minimum length of {#limit}`,
			'string.max': `"Name" shouldn't be more than {#limit} characters`,
			'any.required': `"Name" is a required field`
		}),
		email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: [ 'com', 'net' ] } }),

		password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
	});

	// actual validation
	const { error, value } = schema.validate(req.body);

	// response
	if (error) {
		if (error.details[0].path == 'email') {
			return res.status(422).json({
				error: "Email address isn't valid"
			});
		} else if (error.details[0].path == 'password') {
			return res.status(422).json({
				error:
					'Password should be at least 8 character. It must have 1 uppercase, 1 lower case and 1 special character'
			});
		}
	} else {
		// extracting email from request
		const { email } = req.body;

		// checking email existence
		User.findOne({ email }, (error, dbuser) => {
			if (dbuser) {
				return res.status(422).json({
					error: 'Email already exist'
				});
			}

			// encrypting password
			var hash = bcrypt.hashSync(req.body.password, salt);

			let user = new User(req.body);

			// storing hashed password in db
			user.password = hash;

			// saving info to database
			user.save((error, user) => {
				if (error) {
					return res.status(422).json({
						error: 'Something went wrong',
						error
					});
				}

				user.password = undefined;
				user.createdAt = undefined;
				user.updatedAt = undefined;
				user.__v = undefined;
				res.json({ user: user });
			});
		});
	}
};

// login account
exports.loginAccount = (req, res) => {
	// extracting email from request
	const { email } = req.body;

	// checking email existence
	User.findOne({ email }, (error, user) => {
		if (!user) {
			return res.status(422).json({
				error: 'No account matched this email address'
			});
		}

		// comparging password
		const comparedPassword = bcrypt.compareSync(req.body.password, user.password);

		if (!comparedPassword) {
			return res.status(400).json({
				error: 'Password is incorrect'
			});
		} else {
			// assigning jsonwebtoken
			const token = jwt.sign({ _id: user._id }, process.env.SECRET);

			// setting token
			res.cookie('token', token, { expire: new Date() + 9999 });

			// sending response
			const { _id, email, role } = user;
			res.json({
				token: token,
				user: {
					_id,
					email,
					role
				}
			});
		}
	});
};

// signout route
exports.logoutAccount = (req, res) => {
	res.clearCookie('token');
	// res.json({
	// 	message: 'You have logged out sucessfully...'
	// });
};

// checking login status
exports.isSignedIn = expressJWT({
	secret: process.env.SECRET,
	userProperty: 'auth',
	algorithms: [ 'SHA1', 'RS256', 'HS256' ]
});

// checking authentication
exports.isAuthenticated = (req, res, next) => {
	let checker = req.profile && req.auth && req.profile._id == req.auth._id;

	if (!checker) {
		return res.status(422).json({
			error: 'Hey, You are not authorized to access this',
			profile: req.profile._id,
			auth: req.auth
		});
	}

	next();
};

// checking admin or not
exports.isAdmin = (req, res, next) => {
	if (!req.profile.role == 1) {
		return res.status(422).json({
			error: 'Hey, You are not an admin'
		});
	}

	next();
};
