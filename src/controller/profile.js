import { request, response } from "express";
import db from "../conn";

class userControler {
    async getProfile (req = request, res = response) {
        try {
            const { id } = req.user;

            const user = await db.user.findUnique({
                where : { id : parseInt(id)},
                include : { profile : true}
            });

            if(!user) {
                return res.status(404).json({
                    message : 'user not found'
                })
            }

            const { password,  verificationToken, resetToken, ...userData} = user;

            return res.status(200).json({ status : true, message : 'success get profile', userData})
        } catch (error) {
            console.error(error.message)
        }
    }

    async updatedProfile(req = request, res = response) {
        try {
            const { id } = req.user;
            const { name, bio, category } = req.body;
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
            if(category) profileData.category = category;
            if(avatar) profileData.avatar = avatar;

            const profile = await db.profile.upsert({
                where : { userId : parseInt(id)},
                update : profileData,
                create : {
                    userId: parseInt(id),
                    bio : bio || '',
                    avatar : avatar || '',
                    category : category || null,
                    role : role || "user"
                }
            })

            return res.status(200).json({
                message : "profile updated successfully",
                profile
            })
        } catch (error) {
            console.error(error.message)
            res.status(500).json({ message : 'internal server error'})
        }
    }

    async getDoctor(req = request, res = response) {
        try {
            const { category } = req.query;

            const whereConditions = {
                role : 'doctor',
                isVerified : true
            }

            if(category) {
                whereConditions.profile = {
                    category
                }
            }

            const doctors = await db.user.findMany({
                where : whereConditions,
                include : {
                    profile : true
                }
            })

            return res.status(200).json(doctors);
        } catch (error) {
            console.error(error.message)
            res.status(500).json({ message : 'internal server error'})
        }
    }

    async getDoctorAll(req = request, res = response) {
        try {
            const doctor = await db.user.findMany({
                where : { role : 'doctor'}
            })
            
            return res.status(200).json({
                message : 'succesfully get profile doctor',
                doctor
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message : 'internal serveer error'})
        }
    }
}

export default new userControler()