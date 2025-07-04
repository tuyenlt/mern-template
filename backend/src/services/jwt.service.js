const jwt = require("jsonwebtoken");
const valkeyClient = require("../configs/valkey.config");
const createError = require('http-errors');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = Number(process.env.ACCESS_TOKEN_EXPIRES_IN);
const REFRESH_TOKEN_EXPIRES_IN = Number(process.env.REFRESH_TOKEN_EXPIRES_IN);

const jwtService = {};

jwtService.generateAccessToken = (payload) => {
	return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

jwtService.verifyAccessToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) return reject(createError.Unauthorized("Access token expired or invalid"));
			resolve(decoded);
		});
	});
};

jwtService.generateRefreshToken = async (payload, key) => {
	const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

	await valkeyClient.set(
		`refresh:${key}`,
		refreshToken,
		'EX',
		Number(REFRESH_TOKEN_EXPIRES_IN)
	);

	return refreshToken;
};

jwtService.verifyRefreshToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
			if (err) return reject(createError.Unauthorized("Invalid refresh token"));

			try {
				const storedToken = await valkeyClient.get(`refresh:${decoded._id}`);
				if (!storedToken) {
					return reject(createError.Unauthorized("No stored refresh token"));
				}
				if (token !== storedToken) {
					return reject(createError.Unauthorized("Refresh token mismatch"));
				}
				resolve(decoded);
			} catch (err) {
				reject(err);
			}
		});
	});
};

jwtService.removeUserRefreshToken = async (userId) => {
	await valkeyClient.del(`refresh:${userId}`);
}

module.exports = jwtService;
