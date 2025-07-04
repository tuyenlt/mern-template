const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model");
const createHttpError = require("http-errors");

const userService = {}

userService.create = async (userData) => {
	const user = await userModel.create(userData);
	return user;
}

userService.findByCredential = async (email, password) => {
	const user = await userModel.findOne({
		email: email
	})
	if (!user) {
		throw new Error("User not found");
	}
	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		throw new Error("Password not match");
	}
	return user;
}

userService.getJWTPayload = (user) => {
	return {
		_id: user._id,
		name: user.name,
		avatar_url: user.avatar_url,
		role: user.role
	}
}

userService.findByID = async (userId) => {
	const user = await userModel.findById(userId);
	if (!user) {
		throw createHttpError.NotFound("user not found");
	}
	return user;
}

userService.findByEmail = async (userEmail) => {
	const user = await userModel.findOne({ email: userEmail });
	return user;
}

module.exports = userService