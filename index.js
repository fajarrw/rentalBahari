const express = require("express");
require("dotenv").config();

const app = express();
const dbConfig = require('./dbConnect');
const carRoute = require('./routes/carRoute')
const userRoute = require('./routes/userRoute')
const assuranceRoute = require('./routes/assuranceRoute')
const adminRoute = require('./routes/adminRoute')

app.use(express.json());
app.use('/api/car', carRoute);
app.use('/api/users', userRoute);
app.use('/api/assurance', assuranceRoute)
app.use('/api/admin', adminRoute)
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));