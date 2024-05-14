const dotenv = require('dotenv').config();

const secretToken = process.env.TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	//* If there is no token, return 401 Unauthorized
	if (token == null) return res.sendStatus(401);

	//* If the token is incorrect, return 403 Forbidden
	if (token !== secretToken) return res.sendStatus(403);

	next();
};

module.exports = authenticateToken;
