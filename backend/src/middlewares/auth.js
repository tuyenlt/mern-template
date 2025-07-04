const createError = require("http-errors");
const jwtService = require("../services/jwt.service");

const auth = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		if (!authHeader) {
			next(createError.Unauthorized("Authorization header is required"));
		}

		const token = authHeader.replace("Bearer ", "");
		if (!token) {
			next(createError.Unauthorized("Access token is required"));
		}
		const payload = await jwtService.verifyAccessToken(token);
		req.user = payload;
		next()
	} catch (error) {
		next(error);
	}
}

module.exports = auth;