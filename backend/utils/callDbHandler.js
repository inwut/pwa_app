const AppError = require('./appError');

const callDbHandler = async (fn, errorMessage = 'Database error occurred') => {
    try {
        return await fn();
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(errorMessage, 400);
        }
        if (err.name === 'SequelizeValidationError') {
            throw new AppError(err.errors.map(error => error.message).join(', '), 400);
        }
        throw new AppError(errorMessage, 500);
    }
}

module.exports = callDbHandler;