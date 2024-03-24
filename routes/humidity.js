const express = require('express');
const router = express.Router();
const Humidity = require('../models/humidityModel');
const moment = require('moment-timezone');

router.get('/', async (req, res) => {
	try {
		const humidity = await Humidity.find();
		const formattedHumidity = humidity.map((doc) => {
			return {
				...doc._doc,
				createdAt: moment(doc.createdAt)
					.tz('Asia/Manila')
					.format('YYYY-MM-DD HH:mm:ss'),
				updatedAt: moment(doc.updatedAt)
					.tz('Asia/Manila')
					.format('YYYY-MM-DD HH:mm:ss')
			};
		});
		res.status(200).json(formattedHumidity);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error', stack: err.stack });
	}
});

router.post('/', async (req, res) => {
	try {
		const { value } = req.body;
		if (!value) res.status(400).json({ message: 'Please provide a value' });

		const humidity = await Humidity.create({ value });
		res.status(201).json(humidity);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error', stack: err.stack });
	}
});

module.exports = router;
