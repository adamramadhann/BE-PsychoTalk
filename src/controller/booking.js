const { request, response } = require("express");
const { default: db } = require("../conn");

class BookingHandler {
    async createdBooking(req = request, res = response) {
        try {
            const { doctorId, dateTime } = req.body;
            const userId = req.user.id;

            const doctor = await db.user.findFirst({
                where : {
                    id : parseInt(doctorId),
                    role : 'doctor', 
                }
            }) 
            
            const users = await db.user.findUnique({
                where : { id : req.user.id},
            })

            if(!doctor) {
                return res.status(400).json({
                    message : "doctor invalid"
                })
            }

            const existingBooking = await db.booking.findFirst({
                where : {
                    doctorId : parseInt(doctorId),
                    dateTime : {
                        gte : new Date(dateTime),
                        lte : new Date(new Date(dateTime).getTime() + 1 * 60 * 60 * 1000)
                    },
                    status: {
                        in: ['pending', 'confirmed']
                    }                    
                }
            });

            if(existingBooking) {
                return res.status(400).json({ message : 'time slot not available'})
            }

            const createBooking = await db.booking.create({
                data : {
                    userId : parseInt(userId),
                    doctorId : parseInt(doctorId),
                    dateTime : new Date(dateTime),
                    status : 'pending' 
                }
            });

            await db.notification.create({
                data : {
                    userId : parseInt(doctorId),
                    message : `you have a new booking request from email ${req.user.email}`
                }
            }) 

            await db.notification.create({
                data : {
                    userId : parseInt(userId),
                    message : `you boking requesy has been sent to the ${doctor.name}`,
                    bookingId : createBooking.id
                }
            })

            return res.status(201).json({
                message : 'boking created successfully',
                createBooking
            })
        } catch (error) {
            return res.status(500).json({ message : 'internal server error',error : error.message})
        }
    }

    async getUserBooking(req = request, res = response) {
        try {
            const { role } = req.user; 
            const userId = req.user.id;

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
                                bio  : true,
                                about : true,
                                gender : true,
                                categories : true,
                                avatar : true
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
                                bio  : true,
                                about : true,
                                gender : true,
                                categories : true,
                                avatar : true
                            }
                        }
                    }
                })
            } 

            return res.status(200).json({ 
                message: 'get user Booking succesfully ',
                bookings
              });
        } catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async updatedBokingStatus( req = request, res = response ) {
        const BOOKING_STATUSES = {
            PENDING: 'pending',
            CONFIRMED: 'confirmed',
            COMPLETED: 'completed',
            CANCELLED: 'cancelled',
          };

          const VALID_STATUSES = Object.values(BOOKING_STATUSES);
        try {
            const { id } = req.params;
            const { status } = req.body;
            const userId = req.user.id

            if (!VALID_STATUSES.includes(status)) {
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

            if(status === 'confirmed') {
                const userBook = await db.user.findUnique({
                    where : { id : boking.userId},
                    select : {statusBook : true}
                })

                if(userBook?.statusBook){
                    return res.status(400).json({ message: "User already has an active confirmed booking" });
                }

                await db.user.update({
                    where : { id : boking.userId },
                    data : { statusBook : true}
                })
            }

            const updateBooking = await db.booking.update({
                where : { id : parseInt(id)},
                data : { status }
            })

            if([BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.CANCELLED].includes(status)) {
                await db.user.update({
                    where : { id : boking.userId},
                    data : { statusBook : false}
                })
            }

            const updateUserBook = await db.booking.findFirst({
                where : {
                    userId: req.user.id,
                    status: BOOKING_STATUSES.CONFIRMED,
                    dateTime: {
                      lt: new Date(Date.now() - 24 * 60 * 60 * 1000) 
                    }
                }
            })

            if(updateUserBook) {
                await db.user.update({
                    where : { id : boking.userId},
                    data : { statusBook : false}
                })

                await db.booking.update({
                    where: { id: updateBooking.id },
                    data: { status: 'completed' }  
                  });
            }

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
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deletedBooking( req = request, res = response ) {
        try {
            const { id } = req.params
            const userId = req.user.id

            const booking = await db.booking.findUnique({
                where : { id : parseInt(id)}
            })

            if(!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            if (booking.userId !== userId && booking.doctorId !== userId) {
                return res.status(403).json({ message: 'Not authorized to delete this booking' });
            }

            await db.booking.delete({
                where : {
                    id : parseInt(id)
                }
            })
          
        return res.status(200).json({ message: 'Booking deleted successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    }

    async lovedCardDoctor( req = request, res = response ) {
        const loverId = parseInt(req.user.id)
        const lovedId = parseInt(req.params.id)

        if (isNaN(loverId) || isNaN(lovedId)) {
            return res.status(400).json({ message: "Invalid ID values" });
          }

        try {
            const doctor = await db.user.findUnique({
                where : { id : lovedId, role : "doctor"}
            })

            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found." });
              }

              const statusLoveDoc = doctor.loveStatus
u
              const currentStatus = await db.loveDoctor.update({
                where: { id : lovedId },
                data : { loveStatus : !statusLoveDoc }
              });

              return res.status(200).json({
                status: statusLoveDoc,  
                message: currentStatus.loveStatus,
            });
        
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new BookingHandler();