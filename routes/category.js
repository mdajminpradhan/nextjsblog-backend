const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin, getProfileById } = require('../controllers/user');

const {
	createCategory,
	getCategoryById,
	getAllCategory,
	updateCategory,
	deleteCategory,
	getCat
} = require('../controllers/category');

// profile param
router.param('profileId', getProfileById);

// category param
router.param('categoryId', getCategoryById);

// category create
router.post(
	'/category/create/:profileId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createCategory
);

// getting categories
router.get('/categories', getAllCategory);

// get category by id
router.get('/category/:categoryId', getCat);

// updating category
router.put('/category/update/:categoryId/:profileId', isSignedIn, isAuthenticated, isAdmin, updateCategory);

// deleting category
router.delete('/category/delete/:categoryId/:profileId', isSignedIn, isAuthenticated, isAdmin, deleteCategory);

module.exports = router;
