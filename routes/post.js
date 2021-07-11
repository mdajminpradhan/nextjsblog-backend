const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
	storage: multer.diskStorage({})
});

const { isSignedIn, isAuthenticated, isAdmin, getProfileById } = require('../controllers/user');

const {
	createPost,
	getPostById,
	updatePost,
	getPost,
	deletePost,
	getAllPost,
	getPostPicture,
	getAllPostId,
	getAllPostsByCategory
} = require('../controllers/post');

// profile param
router.param('profileId', getProfileById);

// // post parameter
router.param('postId', getPostById);

// // create post route
router.post('/post/create/:profileId', isSignedIn, isAuthenticated, isAdmin, upload.single('picture'), createPost);

// // update post
router.put(
	'/post/update/:postId/:profileId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	upload.single('picture'),
	updatePost
);

// getting a post
router.get('/post/:postId', getPost);

// get all post
router.post('/posts', getAllPost);

// get all post id
router.get('/postsid', getAllPostId);

// get all post by category id
router.post('/postsbycategory', getAllPostsByCategory);

// get post picture
router.post('/postpicture', getPostPicture);

// delete post
router.delete('/post/delete/:postId/:profileId', isSignedIn, isAuthenticated, isAdmin, deletePost);

module.exports = router;
