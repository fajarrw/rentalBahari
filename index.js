const express = require("express");
require("dotenv").config();

const app = express();
const dbConfig = require('./dbConnect');
const carRoute = require('./routes/carRoute')
const userRoute = require('./routes/userRoute')
const assuranceRoute = require('./routes/assuranceRoute')
const adminRoute = require('./routes/adminRoute')
const rentRoute = require('./routes/rentRoute')

app.use(express.json());
app.use('/api/car', carRoute);
app.use('/api/users', userRoute);
app.use('/api/assurance', assuranceRoute)
app.use('/api/admin', adminRoute)
app.use('/api/rent', rentRoute)
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));