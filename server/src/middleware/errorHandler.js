const { constants } = require('../constrants');


const errorHandler = ( err, req, res, next) => {
    const statusCode = err.statusCode ? res.statusCode : 500;
    switch (statusCode){
        case constants.VALIDATION_ERROR:
            res.json({
                title: 'Validation Failed',
                message: err.message,
                stack: err.stack,
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                title: 'Not Found',
                message: err.message,
                stack: err.stack,
            });
            break;
        case constants.UNAUTHORIZED:
            res.json({
                title: 'Unauthorized',
                message: err.message,
                stack: err.stack,
            });
            break;
        case constants.FORBIDDEN:
            res.json({
                title: 'Forbidden',
                message: err.message,
                stack: err.stack,
            });
            break;
        case constants.SERVER_ERROR:
            res.json({
                title: 'Internal Server Error',
                message: err.message,
                stack: err.stack,
            });
            break;
        default:
            console.log('No error, all good!');
            break;
    }
};

module.exports = errorHandler;