import nodemailer from "nodemailer"
import env from "dotenv"
import { request, response } from "express";
import db from "../conn";
env.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  export const sendEmail = async (to, subject, html) => {
    try {
      const info = await transporter.sendMail({
        from: `"Admin Medica" <${process.env.EMAIL_USER}>`, 
        to,
        subject,
        html,
      });
      console.log("Email terkirim:", info.response);
    } catch (error) {
      console.error("Gagal mengirim email:", error.message);
    }
  };
  
  

  export const verifyEmail = async (req = request, res = response) => {
    const { verificationToken } = req.query;
  
    // Pastikan verificationToken ada
    if (!verificationToken) {
      return res.status(400).json({
        status: false,
        message: "Token verifikasi tidak ditemukan",
      });
    }
  
    try {
      const pendingUser = await db.pendingUser.findUnique({
        where: { verificationToken: verificationToken }
      });
  
      if (!pendingUser) {
        return res.status(400).json({
          status: false,
          message: "Token verifikasi tidak valid",
        });
      }
  
      const newUser = await db.user.create({
        data: {
          email: pendingUser.email,
          name: pendingUser.name,
          password: pendingUser.password,
          role: pendingUser.role,
          verificationToken: pendingUser.verificationToken,
          isVerified: true
        }
      });
  
      await db.pendingUser.delete({
        where: { id: pendingUser.id }
      });
  
      return res.status(200).json({
        status: true,
        message: "Email berhasil diverifikasi. Akun Anda sekarang aktif.",
        newUser
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  };

  