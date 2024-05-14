const express = require('express');
const router = express.Router();
const EggCounter = require('../models/eggCounterModel');
const moment = require('moment-timezone');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
	try {
		const eggCounter = await EggCounter.find();
		const formattedEggCounter = eggCounter.map((doc) => {
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
		res.status(200).json(formattedEggCounter);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error', stack: err.stack });
	}
});

router.post('/', authenticateToken, async (req, res) => {
	try {
		const { value } = req.body;
		if (!value) res.status(400).json({ message: 'Please provide a value' });

		const eggCounter = await EggCounter.create({ value });
		res.status(201).json(eggCounter);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error', stack: err.stack });
	}
});

module.exports = router;
