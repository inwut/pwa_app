const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    let statusCode = err.statusCode || 500;
    let message = err.message || 'An unknown error occurred.';
    res.status(statusCode).json({ error: message });
}

module.exports = globalErrorHandler;