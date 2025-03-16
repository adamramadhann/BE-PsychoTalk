import { request, response } from "express";
import db from "../conn";

class notification{
    async getNotifications(req = request, res = response) {
        try {
            const userId = parseInt(req.user.id);
            const { role } = req.user;
            const { page = 1, limit = 10 } = req.query;

            console.log(role)
    
            const skip = (Math.max(parseInt(page), 1) - 1) * Math.max(parseInt(limit), 10);
            const take = Math.max(parseInt(limit), 10);
    
            // Pisahkan filter berdasarkan role untuk menghindari notifikasi bercampur
            let filter = {};
            if (role === 'doctor') {
                filter = { doctorId: userId };
            } else {
                filter = { userId: userId };
            }
    
            // Query notifikasi berdasarkan filter
            const notifications = await db.notification.findMany({
                where: filter,
                orderBy: { createdAt: 'desc' },
                skip,
                take
            });
    
            // Hitung total jumlah notifikasi dan jumlah yang belum dibaca
            const totalNotifications = await db.notification.count({ where: filter });
            const unreadCount = await db.notification.count({ where: { ...filter, isRead: false } });
    
            return res.status(200).json({
                notifications,
                unreadCount,
                pagination: {
                    total: totalNotifications,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPage: Math.ceil(totalNotifications / limit)
                }
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async markAsRead(req = request, res = response) {
        try {
            const userId = req.user?.id;
            const whereRole = req.user?.role === 'doctor' 
            ? { doctorId: parseInt(userId) } 
            : { userId: parseInt(userId) };

            const { id } = req.params;

            if(id === 'all') {
                await db.notification.updateMany({
                    where : {
                        ...whereRole,
                        isRead: false
                    },
                    data: { isRead: true}
                })

                return res.status(200).json({
                    message : 'All notifications marked as read',
                })
            } else {
                const notification = await db.notification.findFirst({
                    where : {
                        id: parseInt(id),
                        ...whereRole
                    }
                })

                if (!notification) {
                    return res.status(404).json({ message: 'Notification not found' });
                }

                await db.notification.update({
                    where : { id: parseInt(id)},
                    data : { isRead: true}
                })

                return res.status(200).json({ message : "Notification marked as read"})
            }

        } catch (error) {
            console.error(error)
            res.status(500).json({message : 'internal server error'})
        }
    }
}

export default new notification