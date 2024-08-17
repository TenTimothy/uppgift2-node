import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TTL});
};

export const hashPassword = (password) => {
    const hash = bcrypt.hashSync(password, 10)
    return hash;
};