import { request, response } from "express";
import db from "../conn";

class notification{
    async getNotifications(req = request, res = response){
        try {
            const userId = req.user.id;
            const { page = 1, limit = 10} = req.query;
            const pageNum = parseInt(page)
            const limitNum = parseInt(limit)
            const skip = ( pageNum - 1) * limitNum;

            const [notification, total] = await Promise.all([
                db.notification.findMany({
                    where : { userId: parseInt(userId)},
                    include: {
                        booking: true
                    },
                    orderBy: { createdAt : 'desc'},
                    skip,
                    take: limitNum
                }),
                db.notification.count({
                    where: {userId: parseInt(userId)}
                })
            ])

            const unreadCount = await db.notification.count({
                where : {
                    userId: parseInt(userId),
                    isRead: false
                }
            })
            const totalPage = Math.ceil(total / limitNum );

            return res.status(200).json({
                notification,
                unreadCount,
                pagination: {
                    total,
                    page: pageNum,
                    limit : limitNum,
                    totalPage
                }
            })

        } catch (error) {
            console.error(error)
            res.status(500).json({message : 'internal server error'})
        }
    }

    async markAsRead(req = request, res = response) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            if(id === 'all') {
                await db.notification.updateMany({
                    where : {
                        userId : parseInt(userId),
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
                        userId: parseInt(userId)
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