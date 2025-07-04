const express = require("express");
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const passport = require("passport");

const router = express.Router();

// authentication route
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);
router.delete("/logout", auth, userController.logout);
router.post("/", userController.register);

router.get("/oauth/google", passport.authenticate('google', {
	scope: ['profile', 'email'],
	accessType: 'offline',
	prompt: 'consent'
}));

router.get(
	"/oauth/google/callback",
	passport.authenticate('google', { session: false, failureRedirect: '/' }),
	userController.oauthLogin
)

// other route
router.get("/me", auth, userController.getMe);


module.exports = router;