const express = require('express');
const router = express.Router();

const {
	createAccount,
	loginAccount,
	getProfileById,
	logoutAccount
} = require('../controllers/user');

// get profile by id
router.param('profileId', getProfileById);

// create account
router.post('/createaccount', createAccount);

// login account
router.post('/loginaccount', loginAccount);

// logout account
router.get('/logoutaccount', logoutAccount);

module.exports = router;
