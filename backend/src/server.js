const http = require("http")
require("dotenv").config()
const app = require('./app')
const mongoDBConnect = require("./configs/db.config")

mongoDBConnect()

const server = http.createServer(app)

const SERVER_PORT = process.env.SERVER_PORT

server.listen(SERVER_PORT, '0.0.0.0', () => {
	console.log(`Server running on port ${SERVER_PORT}`)
})



