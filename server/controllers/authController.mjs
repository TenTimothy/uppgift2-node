import User from '../models/UserModel.mjs';
import ErrorResponse from '../utils/ErrorResponse.mjs';



// @dec Registrera en användare
// @route POST /api/v1/auth/register
// @access PUBLIC

export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({ name, email, password, role });

        createAndSendToken(user, 201, res); // Skicka in user-objektet här
    } catch (error) {
        if (error.code === 11000) { // Hantera duplikatnyckelfel
            return next(new ErrorResponse('E-postadressen är redan registrerad', 400));
        } else {
            return next(error);
        }
    }
};


// @dec Logga in en användare
// @route POST /api/v1/auth/login
// @access PUBLIC

export const login = async (req, res, next) => {
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
};

// @dec Returnera information om en inloggad användare
// @route POST /api/v1/auth/me
// @access PUBLIC


export const getMe = async (req, res, next) => {
    res.status(200).json({
        success:true,
        statusCode: 200,
    });
};


export const resetPassword = async (req, res, next) => {
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: 'Återställning av lösenord fungerar',
    });
};

const createAndSendToken = (user, statusCode, res) => {
    const token = user.generateToken(); // Använd rätt variabel 'user'

    res.status(statusCode).json({
        success: true,
        statusCode,
        token
    });
};

