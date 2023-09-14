const express = require("express");
require("dotenv").config();

const app = express();
const dbConfig = require('./dbConnect');
const carRoute = require('./routes/carRoute')
app.use('/api/car', carRoute);
const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`Server is running on port ${port}`));