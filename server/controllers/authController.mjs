import User from '../models/UserModel.mjs';

export const register = async (req, res, next) => {
    const { name, email, password, role} = req.body;

    const user = await User.create({ name, email, password, role});

    createAndSendToken(user, 201, res)
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next ('E-post och/eller lössenord saknas', 400)
    }

    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErroorResponse('Felaktig inloggning', 401))
    }

    const isCorrect = await user.validatePassword(password);

    if (!isCorrect) {
        return next(new ErroorResponse('Felaktig inloggning', 401))
    }

    createAndSendToken(user, 200, res);
};

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

const createAndSendToken = (id, statusCode, res) => {
    const token = user.generateToken()

    res.status(statusCode).json({success:true, statusCode, token });
};