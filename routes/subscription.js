const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscriptionModel');
const webpush = require('web-push');
const dotenv = require('dotenv').config();

const vapidKeys = {
	publicKey: process.env.VAPID_PUBLIC_KEY,
	privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
	'mailto:abdulfahadgo566@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

router.post('/save-subscription', async (req, res) => {
	const subscription = new Subscription(req.body);
	await subscription.save();
	res.json({
		status: 'Success',
		message: 'Subscription saved successfully.'
	});
});

router.get('/send-notification', async (req, res) => {
	const subscriptions = await Subscription.find();
	const notifications = subscriptions.map((subscription) =>
		webpush.sendNotification(
			subscription,
			'A message from /send-notification endpoint.'
		)
	);

	await Promise.all(notifications);

	res.json({
		status: 'Success',
		message: 'Message sent to all push services',
		subscriptions: subscriptions
	});
});

module.exports = router;
