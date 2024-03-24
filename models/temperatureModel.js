const mongoose = require('mongoose');

const temperatureSchema = mongoose.Schema(
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

module.exports = mongoose.model('Temperature', temperatureSchema);
