// controllers/notificationController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: parseInt(userId) },
        include: {
          booking: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.notification.count({
        where: { userId: parseInt(userId) }
      })
    ]);
    
    const unreadCount = await prisma.notification.count({
      where: { 
        userId: parseInt(userId),
        isRead: false
      }
    });
    
    const totalPages = Math.ceil(total / limitNum);
    
    return res.status(200).json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { id } = req.params;
    
    if (id === 'all') {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: { 
          userId: parseInt(userId),
          isRead: false
        },
        data: { isRead: true }
      });
      
      return res.status(200).json({ message: 'All notifications marked as read' });
    } else {
      // Mark specific notification as read
      const notification = await prisma.notification.findFirst({
        where: { 
          id: parseInt(id),
          userId: parseInt(userId)
        }
      });
      
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      await prisma.notification.update({
        where: { id: parseInt(id) },
        data: { isRead: true }
      });
      
      return res.status(200).json({ message: 'Notification marked as read' });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};