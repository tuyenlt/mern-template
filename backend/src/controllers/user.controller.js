const cookieOptions = require("../configs/cookie.config");
const jwtService = require("../services/jwt.service");
const userService = require("../services/user.service");
const createError = require("http-errors");

const userController = {}

userController.register = async (req, res, next) => {
	try {
		const user = await userService.create(req.body);
		res.json(user);
	} catch (error) {
		next(error);
	}
}

userController.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			next(createError.BadRequest("Username and password is required"));
		}
		const user = await userService.findByCredential(email, password);
		// generate accesstoken and refresh token
		const payload = userService.getJWTPayload(user);
		const accessToken = await jwtService.generateAccessToken(payload);
		const refreshToken = await jwtService.generateRefreshToken(payload, user._id);
		res.cookie("refreshToken", refreshToken, cookieOptions); // only set refresh token in http-only cookie
		res.json({
			accessToken,
			user
		});
	} catch (error) {
		next(error);
	}
}

userController.oauthLogin = async (req, res, next) => {
	try {
		if (!req.user) return next(createError.BadRequest());

		const payload = userService.getJWTPayload(req.user);
		const [accessToken, refreshToken] = await Promise.all([
			jwtService.generateAccessToken(payload),
			jwtService.generateRefreshToken(payload, req.user._id)
		]);

		res.cookie("refreshToken", refreshToken, cookieOptions);
		res.redirect(`http://localhost:5173/oauth-login-success?accessToken=${accessToken}`);
	} catch (error) {
		next(error);
	}
};


userController.getMe = async (req, res, next) => {
	try {
		const user = await userService.findByID(req.user._id);
		res.json(user);
	} catch (error) {
		next(error);
	}
}


userController.refreshToken = async (req, res, next) => {
	try {
		const refreshToken = req.cookies["refreshToken"];
		if (!refreshToken) {
			next(createError.Unauthorized("Refresh token is not set"));
		}
		const payload = await jwtService.verifyRefreshToken(refreshToken);
		const user = await userService.findByID(payload._id);
		if (!user) {
			next(createError.BadRequest());
		}
		const newPayload = userService.getJWTPayload(user);
		const newRefreshToken = await jwtService.generateRefreshToken(newPayload, user._id);
		const accessToken = await jwtService.generateAccessToken(newPayload);
		res.cookie("refreshToken", newRefreshToken, cookieOptions);
		res.json({ accessToken });
	} catch (error) {
		next(error);
	}
}

userController.logout = async (req, res, next) => {
	try {
		const userId = req.user._id;
		if (!userId) {
			next(createError.BadRequest());
		}
		await jwtService.removeUserRefreshToken(userId);
		res.json({ message: "Logout success" });
	} catch (error) {
		next(error);
	}
}

module.exports = userController;