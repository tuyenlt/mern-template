const passport = require('passport');
const userService = require('../services/user.service');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const API_ENDPOINT = process.env.API_ENDPOINT

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${API_ENDPOINT}/api/user/oauth/google/callback`,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				console.log(`AccessToken:${accessToken}`);
				console.log(`RefreshToken:${refreshToken}`);
				console.log(`name`, profile.displayName);
				const userEmail = profile.emails[0].value;
				const existingUser = await userService.findByEmail(userEmail);
				if (existingUser) {
					done(null, existingUser);
				}
				const newUser = await userService.create({
					name: profile.displayName,
					email: profile.emails[0].value,
					authType: 'google',
					avatar_url: profile.photos[0].value
				})
				done(null, newUser);
			} catch (error) {
				done(error, null);
			}
		}
	)
);
