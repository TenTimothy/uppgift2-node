import crypto from 'crypto';
import User from '../models/UserModel.mjs';
import ErrorResponse from '../utils/ErrorResponse.mjs';
import asyncHandler from '../middlewares/asyncHandler.mjs';


export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    console.log("User created successfully:", user);

    createAndSendToken(user, 201, res);
});

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


export const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse('Användare med den e-postadressen finns inte', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `Du har begärt en återställning av ditt lösenord. Vänligen gör en PUT-begäran till: \n\n ${resetUrl}`;

    try {
        res.status(200).json({ success: true, statusCode: 200, data: 'Återställningslänk skickad till e-post' });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('E-post kunde inte skickas', 500));
    }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorResponse('Ogiltig eller utgången token', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();

    createAndSendToken(user, 200, res);
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
        user: userData  
    });
};
