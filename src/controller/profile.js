import { request, response } from "express";
import db from "../conn";

class userControler {
    
    async getProfile (req = request, res = response) {
        try {
            const { id } = req.user;

            const user = await db.user.findUnique({
                where : { id : parseInt(id)},
            });

            if(!user) {
                return res.status(404).json({
                    message : 'user not found'
                })
            }

            const { password,  verificationToken, resetToken, ...userData} = user;

            return res.status(200).json({ status : true, message : 'success get profile', userData})
        } catch (error) {
            return res.status(500).json({ status : false, message : 'intrnal server error'}, error.message)
        }
    }


    async updatedProfile(req = request, res = response) {
        try {
            const { id } = req.user;
            const { name, bio, categories, gender, about } = req.body;
            const role = req.user.role

            let avatar;
            if(req.file) {
                avatar= `/uploads/${req.file.filename}`;
            }

            const updateData = {};
            if(name) updateData.name = name;

            await db.user.update({
                where : { id : parseInt(id)},
                data : updateData
            })

            const profileData = {};
            if(bio) profileData.bio = bio;
            if(categories) profileData.categories = categories;
            if(avatar) profileData.avatar = avatar;
            if(gender) profileData.gender = gender;
            if(about) profileData.about = about;

            await db.user.update({
                where: { id: parseInt(id) },
                data: {
                  name,
                  bio,
                  gender,
                  about,
                  avatar,
                  categories,
                  role,
                },
              });
              

            const updatedUser = await db.user.findUnique({
                where : { id : parseInt(id)}
            })

            return res.status(200).json({
                message: "Profile updated successfully",
                user: {
                  id: updatedUser.id,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  bio : updatedUser.bio,
                  about : updatedUser.about,
                  categories : updatedUser.categories,
                  gender : updatedUser.gender
                }
              });
              
        } catch (error) {
            console.error(error.message)
            res.status(500).json({ message : 'internal server error'})
        }
    }

    async getDoctor(req = request, res = response) {
        try {
            const { categories } = req.query;
            const userId = parseInt(req.user.id);
            console.log(userId)
    
            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }
    
            const whereConditions = {
                role: 'doctor',
                isVerified: true,
            };
    
            if (categories) {
                whereConditions.categories = categories; 
            }   
            
            const doctors = await db.user.findMany({
                where : {
                    role : 'doctor'
                }
            });

            console.log(doctors)
    
            const formattedDoctors = doctors.map(doctor => ({
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                categories: doctor.categories,
                about: doctor.about,
                bio: doctor.bio,
                role: doctor.role,
                gender: doctor.gender,
                loveStatus: doctor.loveStatus,
                avatar: doctor.avatar
            }));
             
    
            return res.status(200).json({
                status: true,
                doctors: formattedDoctors
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getDoctorAll(req = request, res = response) {
        try {

            const doctor = await db.user.findMany({
                where : { role : 'doctor'}
            })
            
            return res.status(200).json({
                message : 'succesfully get profile doctor',
                doctor,
                
            })
        } catch (error) {
            console.error(error.message)
            res.status(500).json({ message : 'internal serveer error'})
        }
    }
}

export default new userControler()