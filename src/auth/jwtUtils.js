import jwt from 'jsonwebtoken'
import env from 'dotenv'
import { PrismaClient } from '@prisma/client'

env.config();
const db = new PrismaClient();
const JWT_SCREET = process.env.JWT_SCREET;

if(!JWT_SCREET) {
    console.error("❌ ERROR: JWT_SECRET tidak ditemukan! Pastikan ada di .env");
    process.exit(1)
}

export const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({ status: false, message: "Akses ditolak! Token tidak ditemukan" });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SCREET)
        req.user = verified;
        next()
    } catch (error) {
        return res.status(403).json({
            status : false,
            message : "token invalid"
        })
    }
}

export const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, JWT_SCREET, { expiresIn })
}

export const verifyToken = (token) => {

    if(!token) {
        throw new Error("Token tidak ditemukan")
    }

    try {
        return jwt.verify(token, JWT_SCREET)
    } catch (error) {
        throw new Error("Invalid token");
    }
}

export const authorizeRoles = (...roles) => {
    return ( req, res, next) => {
        console.log("User Role:", req.user.role); 
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Akses ditolak!" });
        }
        next()
    }
}