const errorHandler = (err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500);
	if (!err.status) err.message = "Internal Server Error" // server error when not create by http-error
	res.json({
		status: err.status || 500,
		message: err.message
	})
}

module.exports = errorHandler;
