const express = require("express");
const cors = require('cors')
require("dotenv").config();

const app = express();
const dbConfig = require('./dbConnect');
const carRoute = require('./routes/carRoute')
const userRoute = require('./routes/userRoute')
const assuranceRoute = require('./routes/assuranceRoute')
const adminRoute = require('./routes/adminRoute')
const rentRoute = require('./routes/rentRoute')
const authRoute = require('./routes/auth')

app.use(cors());
app.use(express.json());
app.use('/api/car', carRoute);
app.use('/api/users', userRoute);
app.use('/api/assurance', assuranceRoute)
app.use('/api/admin', adminRoute)
app.use('/api/rent', rentRoute)
app.use('/api/auth', authRoute)
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));