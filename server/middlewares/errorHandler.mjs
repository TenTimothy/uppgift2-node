import ErrorResponse from "../utils/ErrorResponse.mjs";

export const errorHandler = (err, req, res, next) => {
    console.log(err);

    let error = { ...err };
    error.message = err.message;

    // Kontrollera för MongoDB duplikatnyckelfel
    if (err.code === 11000) {
        const message = `Resursen finns redan`;
        error = new ErrorResponse(message, 400);
    }

    // Kontrollera för Mongoose valideringsfel
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message).join(', ');
        error = new ErrorResponse(`Information saknas: ${message}`, 400);
    }

    // Standardiserat felmeddelande
    res.status(error.statusCode || 500).json({
        success: false,
        statusCode: error.statusCode || 500,
        error: error.message || 'Server Error'
    });
};
