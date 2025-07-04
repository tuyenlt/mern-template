const morgan = require('morgan');
const chalk = require('chalk');

morgan.token('statusColor', (req, res) => {
	const status = res.statusCode;
	if (status >= 500) return chalk.red(status);
	if (status >= 400) return chalk.yellow(status);
	if (status >= 300) return chalk.cyan(status);
	return chalk.green(status);
});

const morganLogger = morgan((tokens, req, res) => {
	return [
		chalk.gray(tokens['remote-addr'](req, res)),
		chalk.blue(tokens.method(req, res)),
		chalk.green(tokens.url(req, res)),
		tokens.statusColor(req, res),
		chalk.magenta(tokens['response-time'](req, res) + ' ms'),
	].join(' ').concat(chalk.green(`\n ${JSON.stringify(req.body)}`));
})

module.exports = morganLogger