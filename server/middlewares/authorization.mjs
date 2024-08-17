import jwt from 'jsonwebtoken';
import User from '../models/UserModel.mjs';
import asyncHandler from '../middlewares/asyncHandler.mjs';
import ErrorResponse from '../utils/ErrorResponse.mjs';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Behörighet saknas', 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id);

    if (!req.user) {
        return next(new ErrorResponse('Behörighet saknas', 401));
    }

    next();
});


export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse('Åtkomst nekad', 403));
        }
        next();
    };
};
