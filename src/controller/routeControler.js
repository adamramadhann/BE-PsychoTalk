import { Router } from "express";
import { authenticateToken } from "../auth/jwtUtils";
import userControler from "./profile"; 
import BookingHandler from './booking'
import formPost from "./formPost";
import notifications from "./notifications"; 
import { upload } from "../config/upload";

const routeControler = new Router()

routeControler.get('/profile', authenticateToken, userControler.getProfile);
routeControler.put('/profile', authenticateToken, upload.single('avatar'), userControler.updatedProfile);
routeControler.get('/getDoc', authenticateToken, userControler.getDoctor)
routeControler.get('/getDocProfile', authenticateToken, userControler.getDoctorAll)

// bookings
routeControler.post('/booking', authenticateToken, BookingHandler.createdBooking);
routeControler.patch('/booking/:id', authenticateToken, BookingHandler.updatedBokingStatus);
routeControler.get('/getBookingUser', authenticateToken, BookingHandler.getUserBooking)
routeControler.delete('/deletedBook/:id',authenticateToken, BookingHandler.deletedBooking)

// loved Card
routeControler.post('/loved/:id',authenticateToken, BookingHandler.lovedCardDoctor)

// forum controler
routeControler.post('/forumPost', authenticateToken, formPost.createdPost);
routeControler.patch('/forumPost/:id', authenticateToken, formPost.createdReply);
routeControler.get('/forumPost/:id', authenticateToken, formPost.getPostDetails);
routeControler.get('/getForumPost', authenticateToken, formPost.getPost);

// notification
routeControler.get('/notif', authenticateToken, notifications.getNotifications)
routeControler.post('/notif/:id', authenticateToken, notifications.markAsRead)
routeControler.delete('/deletedNotif/:id',authenticateToken, notifications.deletedNotification)




export default routeControler