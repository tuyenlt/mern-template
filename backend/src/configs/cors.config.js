const allowedOrigins = [
	'http://localhost:5173',
	'http://127.0.0.1:5173',
	'https://yourdomain.com',
	'https://staging.yourdomain.com'
];

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
};

module.exports = corsOptions