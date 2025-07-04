const cookieOptions = {
	httpOnly: true, // Prevent JavaScript access
	secure: false,   // Use HTTPS (Set to false for local development)
	sameSite: false, // Prevent CSRF attacks
	maxAge: 7 * 24 * 60 * 60 * 1000
};

module.exports = cookieOptions;