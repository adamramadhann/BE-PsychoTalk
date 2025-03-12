import { Router } from "express";
import { authenticateToken } from "../auth/jwtUtils";
import userControler from "./profile";
import { upload } from "../config/upload";
import BookingHandler from './booking'
import formPost from "./formPost";
import notifications from "./notifications";

const routeControler = new Router()

routeControler.get('/profile', authenticateToken, userControler.getProfile);
routeControler.put('/profile', authenticateToken, upload.single('avatar'), userControler.updatedProfile);
routeControler.get('/getDoc', authenticateToken, userControler.getDoctor)
routeControler.get('/getDocProfile', authenticateToken, userControler.getDoctorAll)

// bookings
routeControler.post('/booking', authenticateToken, BookingHandler.createdBooking);
routeControler.patch('/booking/:id', authenticateToken, BookingHandler.updatedBokingStatus);
routeControler.get('/getBookingUser', authenticateToken, BookingHandler.getUserBooking)

// forum controler
routeControler.post('/forumPost', authenticateToken, formPost.createdPost);
routeControler.patch('/forumPost/:id', authenticateToken, formPost.createdReply);
routeControler.get('/forumPost/:id', authenticateToken, formPost.getPostDetails);
routeControler.get('/getForumPost', authenticateToken, formPost.getPost);

// notification
routeControler.get('/notif', authenticateToken, notifications.getNotifications)
routeControler.post('/notif/:id', authenticateToken, notifications.markAsRead)


export default routeControler