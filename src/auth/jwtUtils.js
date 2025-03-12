import jwt from 'jsonwebtoken'
import env from 'dotenv'
import { PrismaClient } from '@prisma/client'

env.config();
const db = new PrismaClient();
const JWT_SCREET = process.env.JWT_SECRET;

if(!JWT_SCREET) {
    console.error("❌ ERROR: JWT_SECRET tidak ditemukan! Pastikan ada di .env");
    process.exit(1)
}

export const authenticateToken = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        return res.status(401).json({ status: false, message: "Akses ditolak! Token tidak ditemukan" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SCREET)

        const user = await db.user.findUnique({
            where: { id: decoded.id }
        });


        if (!user) {
            return res.status(401).json({ status: false, message: "User tidak ditemukan" });
        }

        if (!decoded.id) {
            return res.status(403).json({ status: false, message: "Token tidak valid (ID tidak ditemukan)" });
        } 

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        

        next()
    } catch (error) {
        return res.status(403).json({
            status : false,
            message : "token valid no"
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