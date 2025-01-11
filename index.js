const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();
const dbConfig = require('./dbConnect');
const carRoute = require('./routes/carRoute');
const userRoute = require('./routes/userRoute');
const assuranceRoute = require('./routes/assuranceRoute');
const adminRoute = require('./routes/adminRoute');
const rentRoute = require('./routes/rentRoute');
const authRoute = require('./routes/auth');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // n minute
    max: 100 // limit each IP to n requests per windowMs
});

// Configure CORS to allow requests from http://localhost:3000
const corsOptions = {
    origin: '*',
    credentials: true, // Allow cookies to be sent
};

app.use(mongoSanitize());
app.use(limiter);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/api/car', carRoute);
app.use('/api/users', userRoute);
app.use('/api/assurance', assuranceRoute);
app.use('/api/admin', adminRoute);
app.use('/api/rent', rentRoute);
app.use('/api/auth', authRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));