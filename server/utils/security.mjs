import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
    const hash = bcrypt.hashSync(password, 10)
}