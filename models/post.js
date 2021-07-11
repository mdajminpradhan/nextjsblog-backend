const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		category: {
			type: [ObjectId],
			ref: 'Category'
		},
		date: {
			type: Date,
			default: Date.now(),
		},
		author: {
			type: ObjectId,
			ref: 'User',
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		tags: {
			type: [],
			required: true
		},
		picture: {
			type: String,
			required: true,
			trim: true
		},
		pictureid: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', productSchema);
