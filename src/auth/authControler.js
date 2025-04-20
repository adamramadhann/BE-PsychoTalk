import { request, response } from "express";
import db from "../conn";
import { passwordHash } from "./hashes";
import crypto from 'crypto';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


class  AuthController {
  // async registerGas(req = request, res = response) {
  //   const { name, email, password, role = "user", gender , bio = 'saya adalah pasien', categories = 'pasien', about = 'ini adalah pasien', loveStatus   } = req.body;

  //   if(!req.file) {
  //     return res.status(400).json({
  //       message : 'avatar tidak boleh kosong'
  //     })
  //   }

  //   let avatar;
  //   if(req.file) {
  //       avatar= `/uploads/${req.file.filename}`;
  //   }


  //   try {
  //     if (!email || !password || !name || !categories || !bio || !gender ) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Semua field harus diisi",
  //       });
  //     }


  //     if(role === "doctor" && !about) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "About wajib diisi oleh doctor",
  //       });
  //     }

  //     const maxWords = 60;
  //     const bioWord = bio.trim().split(/\s+/).length;

  //     if(bioWord > maxWords) {
  //       return res.status(500).json({message : `word more than ${maxWords} !`})
  //     }


  //     const maxWordsAbout = 100;
  //     const bioWordAbout = (about || '').trim().split(/\s+/).length;

  //     if(role === 'doctor' && bioWordAbout > maxWordsAbout) {
  //       return res.status(500).json({message : `word more than ${maxWordsAbout} !`})
  //     }
  
  //     const existingUser = await db.user.findUnique({ where: { email } });
  //     if (existingUser) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Email sudah terdaftar",
  //       });
  //     }
  
  //     const existingPendingUser = await db.pendingUser.findUnique({
  //       where: { email }
  //     });
  
  //     if (existingPendingUser) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Email sudah terdaftar dan sedang menunggu verifikasi",
  //       });
  //     }

  //     const hashedPassword = await passwordHash(password);
  //     const verificationToken = crypto.randomBytes(32).toString("hex");

  //     const lovedDoc = await db.loveDoctor.findUnique({
  //       where : { id : parseInt(req.user.id)}
  //     })
  
  //     const newUser = await db.user.create({
  //       data: {
  //         email,
  //         password: hashedPassword,
  //         name,
  //         role,
  //         gender,
  //         categories,
  //         bio,
  //         about,
  //         verificationToken,
  //         avatar,
  //         loveStatus : lovedDoc,
  //       }
  //     });

  //     const GAS_URL = `https://script.google.com/macros/s/AKfycbx8l766EFZWd-vmv0UKAO3eETNcWTc5QtSrqA4QugQDyZ5db577bq06s0RclQ_vGu-5/exec`;
  //     const payload = {
  //       type: 'verify',
  //       to: newUser.email,
  //       name: newUser.name,
  //       token: newUser.verificationToken
  //     }

  //     const response = await fetch(GAS_URL, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload)
  //     });

  //     if (!response.ok) {
  //       const responseText = await response.text();
  //       throw new Error(`GAS request failed with status ${response.status}`);
  //     }

  //     console.log("Payload yang dikirim ke GAS:", payload);

  //     const verificationLink = `http://localhost:8000/api/verify-email?verificationToken=${verificationToken}`;
  //     const emailContent = `
  //     <div style="font-family: Arial, sans-serif; background-color: #e0f2f1; padding: 20px; border: 2px solid #00796b;">
  //       <table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" 
  //         style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
  //         <tr>
  //           <td style="padding: 20px; text-align: center; background-color: #00796b; color: #ffffff; 
  //             border-top-left-radius: 8px; border-top-right-radius: 8px;">
  //             <h2>Verifikasi Email Anda</h2>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td style="padding: 20px; text-align: center; color: #333;">
  //             <p>Halo <strong>${name}</strong>,</p>
  //             <p>Terima kasih telah mendaftar. Klik tombol di bawah untuk verifikasi email Anda:</p>
  //             <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; 
  //               font-size: 16px; color: #ffffff; background-color: #00796b; text-decoration: none; 
  //               border-radius: 5px; margin-top: 10px;">Verifikasi Email</a>
  //             <p style="margin-top: 20px; font-size: 14px; color: #555;">Jika Anda tidak merasa mendaftar, 
  //               abaikan email ini.</p>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td style="text-align: center; padding: 10px; font-size: 12px; color: #aaa;">
  //             &copy; 2025 PsychoTalk. All rights reserved.
  //           </td>
  //         </tr>
  //       </table>
  //     </div>
  //   `;    
  
  //     try {
  //       await sendEmail(email, "Created Account", emailContent);
  //   } catch (error) {
  //     console.error(error.message)
  //     return res.status(500).json({
  //       message: 'Internal server error',
  //       error: error.message
  //     });
  //   }     
  
  //     return res.status(201).json({
  //       status: true,
  //       message: "Registrasi berhasil, silakan cek email Anda untuk verifikasi",
  //       newUser
  //     });
  
  //   } catch (error) {
  //     console.error(error.message)
  //     return res.status(500).json({
  //       message: 'Internal server error',
  //       error: error.message
  //     });
  //   }
  // };

  async register(req = request, res = response) {
    const { name, email, password, role = "user", gender , bio = 'saya adalah pasien', categories = 'pasien', about = 'ini adalah pasien', loveStatus = false   } = req.body;

    if(!req.file) {
      return res.status(400).json({
        message : 'avatar tidak boleh kosong'
      })
    }

    let avatar;
    if(req.file) {
        avatar= `/uploads/${req.file.filename}`;
    }


    try {
      if (!email || !password || !name || !categories || !bio || !gender ) {
        return res.status(400).json({
          status: false,
          message: "Semua field harus diisi",
        });
      }


      if(role === "doctor" && !about) {
        return res.status(400).json({
          status: false,
          message: "About wajib diisi oleh doctor",
        });
      }

      const maxWords = 60;
      const bioWord = bio.trim().split(/\s+/).length;

      if(bioWord > maxWords) {
        return res.status(500).json({message : `word more than ${maxWords} !`})
      }


      const maxWordsAbout = 100;
      const bioWordAbout = (about || '').trim().split(/\s+/).length;

      if(role === 'doctor' && bioWordAbout > maxWordsAbout) {
        return res.status(500).json({message : `word more than ${maxWordsAbout} !`})
      }
  
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email sudah terdaftar",
        });
      }
  
      const existingPendingUser = await db.pendingUser.findUnique({
        where: { email }
      });
  
      if (existingPendingUser) {
        return res.status(400).json({
          status: false,
          message: "Email sudah terdaftar dan sedang menunggu verifikasi",
        });
      }

      const hashedPassword = await passwordHash(password);
      const verificationToken = crypto.randomBytes(32).toString("hex");
  
      const newUser = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          gender,
          categories,
          bio,
          about,
          verificationToken,
          avatar,
          loveStatus,
        }
      });
  
      return res.status(201).json({
        status: true,
        message: "Registrasi berhasil, silakan cek email Anda untuk verifikasi",
        newUser
      });
  
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  };


  async login(req, res) {
    try {
      const { email, password } = req.body;
  
      if(!email || !password) {
        return res.status(401).json({
          message : "email dan password harus diisi"
        })
      }
  
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET tidak ditemukan di environment variables');
      }

      const user = await db.user.findUnique({where : { email }});
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User tidak ditemukan",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: "Password salah",
        });
      }
  
      const token = jwt.sign({id: user.id, email : user.email, role : user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({
        status: true,
        message: 'Login berhasil',
        token,
      });
      
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  };


  async requestResetPassword(req = request, res = response) {
    const { email } = req.body
    try {
      const user = await db.user.findUnique({
        where: { email }
      })
  
      if (!user) {
        return res.status(404).json({ status: false, message: "Email tidak ditemukan" });
      }
  
      const token = crypto.randomUUID();
      const expired = new Date(Date.now() + 100 * 60 * 30)
  
      await db.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpired: expired
        }
      })
  
      const GAS_URL = `https://script.google.com/macros/s/AKfycbwpnqKinlg4k3nHBcgw23ySIRRI8m-9kRV3aVhsMd1c7308jo0s3bPMcxJA3hKN5yoh/exec`;
      const payload = {
        type: 'reset',
        to: email,
        name: user.name,
        token: token
      }
  
      try {
        const response = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(`GAS request failed with status ${response.status}`);
        }
  
      } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error" });
      }
  
      return res.json({ status: true, message: "Link reset password telah dikirim ke email.", token: token });
    } catch (error) {
      return res.status(500).json({ status: false, message: "Terjadi kesalahan saat memproses permintaan" });
    }
  }


  async resetPassword(req = request, res = response) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      if (!token || !newPassword) {
        return res.status(400).json({ status: false, message: "Token dan password baru harus diisi" });
      }

      const user = await db.user.findFirst({
        where : {
          resetToken : token,
          resetTokenExpired : { gt : new Date()}
        }
      })

      if (!user) {
        return res.status(400).json({ status: false, message: "Token tidak valid atau telah kadaluarsa" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await db.user.update({
        where: { email: user.email },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpired: null
        }
      });      

      const linkLogin = `http://localhost:5173/`
      return res.status(200).send(`
        <div style="
          font-family: 'Arial', sans-serif;
          max-width: 600px;
          margin: 40px auto;
          padding: 35px;
          background: linear-gradient(145deg, #f5f7fa, #eef2f6);
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          text-align: center;
        ">
          <div style="margin-bottom: 30px;">
            <span style="
              font-size: 72px;
              color: #4CAF50;
              display: inline-block;
              margin-bottom: 15px;
            ">✅</span>
            <h2 style="
              color: #333;
              font-size: 28px;
              font-weight: 600;
              margin: 0 0 10px;
            ">Password Successfully Reset!</h2>
            <p style="
              color: #666;
              font-size: 16px;
              margin: 0;
            ">You can now log in with your new password</p>
          </div>
      
          <a href="/login" style="
            display: inline-block;
            margin: 25px 0;
            padding: 14px 40px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white !important;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
          " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 5px 8px rgba(0,0,0,0.2)'" 
           onmouseout="this.style.transform='none'; this.style.boxShadow='0 3px 6px rgba(0,0,0,0.1)'">
            Login Now
          </a>
      
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px;">
              Need help? <a href="/support" style="color: #4a90e2; text-decoration: none;">Contact Support</a>
            </p>
            <p style="color: #bbb; font-size: 12px; margin-top: 10px;">
              <a href=${linkLogin} style="color: inherit; text-decoration: none;">← Back to Home</a>
            </p>
          </div>
        </div>
      `);
    } catch (error) {
      return res.status(500).send("<p>Terjadi kesalahan, silakan coba lagi.</p>");
    }
  }


}

export default new AuthController();
