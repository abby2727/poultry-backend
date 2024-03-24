const express = require('express');
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnection');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

connectDb();

app.get('/', (req, res) => {
	res.send('Poultry Backend API');
});

// const humidityRouter = require('./routes/humidity');
// const temperatureRouter = require('./routes/temperature');
const ammoniaRouter = require('./routes/ammonia');

// app.use('/api/humidity', humidityRouter);
// app.use('/api/temperature', temperatureRouter);
app.use('/api/ammonia', ammoniaRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
