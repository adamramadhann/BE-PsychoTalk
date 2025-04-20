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

  // export const sendEmail = async (to, subject, html) => {
  //   try {
  //     const info = await transporter.sendMail({
  //       from: `"Admin Medica" <${process.env.EMAIL_USER}>`, 
  //       to,
  //       subject,
  //       html,
  //     });
  //     console.log("Email terkirim:", info.response);
  //   } catch (error) {
  //     console.error("Gagal mengirim email:", error.message);
  //   }
  // };

  export const verifyEmail = async (req = request, res = response) => {
    const { verificationToken } = req.query;
  
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
          gender: pendingUser.gender,
          bio: pendingUser.bio,
          about: pendingUser.role === 'user' ? 'ini adalah user' : pendingUser.about,
          categories: pendingUser.categories ? 'categories' : pendingUser.categories,
          isVerified: true,
          loveDoctorId : pendingUser.statusLove,
          avatar : pendingUser.avatar
        }
      });
  
      await db.pendingUser.delete({
        where: { id: pendingUser.id }
      });
  
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Verifikasi Email - PsychoTalk</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: #e0f2f1;
            }
            table {
              max-width: 600px;
              width: 100%;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            td {
              padding: 20px;
              text-align: center;
            }
            h2 {
              color: #ffffff;
            }
            .header {
              background-color: #00796b;
              color: #ffffff;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
            }
            .content {
              color: #333;
            }
            .button {
              display: inline-block;
              padding: 12px 20px;
              font-size: 16px;
              color: #ffffff;
              background-color: #00796b;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              font-size: 12px;
              color: #aaa;
              text-align: center;
              padding: 10px;
            }
            /* Mobile Responsiveness */
            @media only screen and (max-width: 600px) {
              body {
                background-color: #e0f2f1;
                padding: 0;
              }
              table {
                width: 100%;
                max-width: 100%;
                padding: 10px;
              }
              .header {
                font-size: 20px;
              }
              .content {
                font-size: 14px;
              }
              .button {
                padding: 10px 15px;
                font-size: 14px;
              }
              .footer {
                font-size: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div style="width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; 
            background-color: #e0f2f1; border: 2px solid #00796b;">
      
            <table align="center" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td class="header">
                  <h2>Verifikasi Berhasil</h2>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <p>Halo <strong>${newUser.name}</strong>,</p>
                  <p>Email Anda telah berhasil diverifikasi.</p>
                  <p style="margin-top: 10px;">Akun Anda sekarang aktif dan siap digunakan.</p>
                  <a href="https://your-frontend-app.com/login" class="button">Masuk ke Aplikasi</a>
                </td>
              </tr>
              <tr>
                <td class="footer">
                  &copy; 2025 PsychoTalk. All rights reserved.
                </td>
              </tr>
            </table>
          </div>
        </body>
        </html>
      `);
      

    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  };



  