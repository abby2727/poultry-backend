const mongoose = require('mongoose');

const eggCounterSchema = mongoose.Schema(
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

module.exports = mongoose.model('EggCounter', eggCounterSchema);
