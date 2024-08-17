import User from '../models/UserModel.mjs';
import ErrorResponse from '../utils/ErrorResponse.mjs';
import asyncHandler from '../middlewares/asyncHandler.mjs';

// @desc Registrera en användare
// @route POST /api/v1/auth/register
// @access PUBLIC
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    console.log("User created successfully:", user);

    createAndSendToken(user, 201, res);
});

// @desc Logga in en användare
// @route POST /api/v1/auth/login
// @access PUBLIC
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('E-post och/eller lösenord saknas', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Felaktig inloggning', 401));
    }

    const isCorrect = await user.validatePassword(password);

    if (!isCorrect) {
        return next(new ErrorResponse('Felaktig inloggning', 401));
    }

    createAndSendToken(user, 200, res);
});

// @desc Returnera information om en inloggad användare
// @route POST /api/v1/auth/me
// @access PUBLIC
export const getMe = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        statusCode: 200,
    });
});

// @desc Återställ lösenord
// @route POST /api/v1/auth/resetpassword
// @access PUBLIC
export const resetPassword = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: 'Återställning av lösenord fungerar',
    });
});

const createAndSendToken = (user, statusCode, res) => {
    const token = user.generateToken();

    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    };

    res.status(statusCode).json({
        success: true,
        statusCode,
        token,
        user: userData  // Lägg till användardata i svaret
    });
};
