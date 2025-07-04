const Redis = require('ioredis');

const valkeyHost = process.env.VALKEY_HOST || 'localhost';
const valkeyPort = parseInt(process.env.VALKEY_PORT || '6379', 10);

const client = new Redis({
	host: valkeyHost,
	port: valkeyPort,
});

client.on('connect', () => {
	console.log(`Connected to Valkey`);
});

client.on('error', (err) => {
	console.error('Error connecting to Valkey:', err);
});

module.exports = client;