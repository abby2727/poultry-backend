const mongoose = require('mongoose');

const ammoniaSchema = mongoose.Schema(
	{
		value: {
			type: Number,
			required: [true, 'Please add a value']
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Ammonia', ammoniaSchema);
