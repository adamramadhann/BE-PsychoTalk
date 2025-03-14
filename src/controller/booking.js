const { request, response } = require("express");
const { default: db } = require("../conn");

class BookingHandler {
    async createdBooking(req = request, res = response) {
        try {
            const { doctorId, dateTime } = req.body;
            const userId = req.user.id;
    
            const doctor = await db.user.findFirst({
                where: {
                    id: parseInt(doctorId),
                    role: 'doctor',
                    isVerified: true
                }
            });
    
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
    
            const existingBooking = await db.booking.findFirst({
                where: {
                    doctorId: parseInt(doctorId),
                    dateTime: new Date(dateTime),
                    status: { in: ['pending', 'confirmed'] }
                }
            });
    
            if (existingBooking) {
                return res.status(400).json({ message: 'Time slot not available' });
            }
    
            const createBooking = await db.booking.create({
                data: {
                    userId: parseInt(userId),
                    doctorId: parseInt(doctorId),
                    dateTime: new Date(dateTime),
                    status: 'pending'
                }
            });
    
            await db.notification.create({
                data: {
                    doctorId: parseInt(doctorId),
                    message: `You have a new booking request from ${req.user.name}`,
                    bookingId: createBooking.id
                }
            }, console.log(' ini untuk dokter'));
    
            await db.notification.create({
                data: {
                    userId: parseInt(userId),
                    message: 'Your booking request has been sent to the doctor',
                    bookingId: createBooking.id
                }
            }, console.log('ini untuk user'));
    
            return res.status(201).json({
                message: 'Booking created successfully',
                createBooking
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserBooking(req = request, res = response) {
        try {
            const userId = req.user.id;
            const { role } = req.user;

            let bookings;

            if(role === 'doctor') {
                bookings = await db.booking.findMany({
                    where : { doctorId: parseInt(userId)},
                    include : {
                        user : {
                            select : {
                                id: true,
                                name: true,
                                email: true,
                                profile: true
                            }
                        }
                    },
                    orderBy : {
                        dateTime : 'asc'
                    }
                })
            } else { 
                bookings = await db.booking.findMany({
                    where : { userId: parseInt(userId)},
                    include: {
                        doctor : {
                            select : {
                                id: true,
                                name: true,
                                email: true,
                                profile: true
                            }
                        }
                    },
                    orderBy : {
                        dateTime : 'asc' 
                    }
                })
            }

            return res.status(200).json({ 
                message: 'get user Booking succesfully ',
                bookings
              });
        } catch (error) {
            console.error('Error updating booking status:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async updatedBokingStatus( req = request, res = response ) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const userId = req.user.id

            if(!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            const boking = await db.booking.findUnique({
                where : { id: parseInt(id)},
                include: {
                    user: true,
                    doctor: true
                }
            })

            if(!boking) {
                return res.status(404).json({ message : "boking not found"})
            }

            if( boking.doctorId !== parseInt(userId)) {
                return res.status(403).json({ message : 'not authorized to updated this booking'})
            }

            const updateBooking = await db.booking.update({
                where : { id : parseInt(id)},
                data : { status }
            })

            await db.notification.create({
                data : {
                    doctorId: boking.doctorId, 
                    message: `Booking status has been updated to ${status}`,
                    bookingId: boking.id
                }
            });            

            let message = '';
            switch (status) {
                case 'confirmed' :
                    message = 'your booking has been confirmed';
                    break;
                case 'completed' : 
                    message = 'your consultation has been marked as completed'
                    break;
                case 'cancelled' : 
                    message = 'your booking has been cancelled by the doctor';
                    break;
                default : 
                message = `your booking status has been updated to ${status}`
            }

            await db.notification.create({
                data : {
                    userId : boking.userId,
                    message,
                    bookingId: boking.id
                }
            })

            return res.status(200).json({ 
                message: 'Booking status updated successfully',
                booking: updateBooking 
              });
            } catch (error) {
                console.error('Error updating booking status:', error);
                return res.status(500).json({ message: 'Server error' });
            }
    }
}

export default new BookingHandler();