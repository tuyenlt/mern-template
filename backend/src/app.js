const express = require("express")
const cookieParser = require("cookie-parser")
const morganLogger = require("./middlewares/morgan")
const errorHandler = require("./middlewares/errorHandler")
const cors = require("cors")

require("./configs/passport.config")
const routes = require("./routes")
const corsOptions = require("./configs/cors.config")
const passport = require("passport")

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(morganLogger)

app.get("/api", (req, res) => {
	res.send("E-Learing API endpoint")
})

app.use("/api", routes);

app.use(errorHandler);

module.exports = app