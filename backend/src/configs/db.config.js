const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGO_URI

const options = {
	serverApi: {
		version: '1',
		strict: true,
		deprecationErrors: true
	}
}

const mongoDBConnect = async () => {
	try {
		mongoose.connect(MONGO_URI, options).then(() => {
			console.log("Connected to MongoDB")
		})
	} catch (error) {
		console.log("DB connection error:", error)
	}
}

module.exports = mongoDBConnect