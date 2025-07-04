const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		validate(value) {
			if (!validator.matches(value, /^[\p{L}\d\s]+$/u)) {
				throw new Error("Your name must contain only letters, numbers, and spaces!");
			}
		}
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is not valid!")
			}
		}
	},
	phone_number: {
		type: String,
		validate(value) {
			if (value.length != 10) {
				throw new Error("Wrong phone number format")
			}
		}
	},
	password: {
		type: String,
		required: function () {
			return this.authType === "normal"
		},
		minlength: 8,
		trim: true
	},
	avatar_url: {
		type: String
	},
	authType: {
		type: String,
		enum: ["normal", "google"],
		default: "normal"
	}

}, {
	collection: "user",
	timestamps: true
})

userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
}

userSchema.pre('save', async function (next) {
	try {
		const user = this;
		if (user.isModified('password')) {
			const saltRounds = 10;
			user.password = await bcrypt.hash(user.password, saltRounds);
		}
		next();
	} catch (error) {
		next(error);
	}
})

const userModel = mongoose.model("user", userSchema)
module.exports = userModel