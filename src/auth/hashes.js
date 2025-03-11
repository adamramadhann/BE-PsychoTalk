import bcrypt from "bcryptjs";

export const generate_salt = () => {
    return bcrypt.genSaltSync(10)
}

export const passwordHash = ( password, salt) => {
    return bcrypt.hashSync(password, salt)
}

export const password_verify = ( password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
}