const mongoose = require('mongoose');

mongoose.connect(
	process.env.MONGO_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		ssl: true
	}
)