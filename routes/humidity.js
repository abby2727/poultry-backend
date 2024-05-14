const express = require('express');
const router = express.Router();
const Humidity = require('../models/humidityModel');
const Subscription = require('../models/subscriptionModel');
const moment = require('moment-timezone');
const webpush = require('web-push');
const authenticateToken = require('../middleware/authMiddleware');

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

router.post('/', authenticateToken, async (req, res) => {
	try {
		const { value } = req.body;
		if (!value) res.status(400).json({ message: 'Please provide a value' });

		//* Send notification if humidity level is above 70
		if (value > 70) {
			console.log('Humidity level is above normal.');

			const dateAndTime = moment()
				.tz('Asia/Manila')
				.format('MMMM Do YYYY, h:mm a');
			const message = `The humidity level exceeds the normal range. Date and time of this occurrence: ${dateAndTime}.`;

			const subscriptions = await Subscription.find();
			const notifications = subscriptions.map(async (subscription) => {
				try {
					await webpush.sendNotification(subscription, message);
				} catch (err) {
					if (err.statusCode === 410 || err.statusCode === 404) {
						// The push subscription was not found or has expired.
						// Remove the subscription from the database.
						await Subscription.deleteOne({ _id: subscription._id });
					} else {
						console.error('Failed to send notification', err);
					}
				}
			});

			await Promise.all(notifications);
		}

		const humidity = await Humidity.create({ value });
		res.status(201).json(humidity);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error', stack: err.stack });
	}
});

module.exports = router;
