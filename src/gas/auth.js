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
