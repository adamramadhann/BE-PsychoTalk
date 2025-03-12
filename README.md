# Psychology Consultation App - Backend

This is the backend API for a Psychology Consultation application. The system allows users to book appointments with psychologists, participate in community forums, and receive notifications.

## Features

- **User Authentication System**
  - Registration and email verification
  - Login with JWT authentication
  - Password reset functionality

- **Profile Management**
  - User profile creation and updating
  - Profile image upload
  - Doctor category and bio

- **Booking System**
  - Schedule appointments with psychologists
  - Booking status management (pending, confirmed, completed, cancelled)
  - Availability checking

- **Forum System**
  - Create posts in different categories
  - Reply to posts
  - Pagination and filtering

- **Notification System**
  - Real-time notifications for bookings and replies
  - Mark notifications as read
  - Notification counts

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email sending

## Prerequisites

- Node.js (v14+)
- MySQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/psychology-consultation-app.git
cd psychology-consultation-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="mysql://username:password@localhost:3306/psychology_app"
JWT_SECRET="your-secret-key"
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"
FRONTEND_URL="http://localhost:3000"
PORT=5000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify` - Verify email
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors?category=CBT` - Get doctors by category

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking status

### Forum
- `POST /api/posts` - Create post
- `GET /api/posts` - Get all posts
- `GET /api/posts?category=Anxiety` - Get posts by category
- `GET /api/posts/:id` - Get post details
- `POST /api/posts/:id/replies` - Create reply

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/all/read` - Mark all notifications as read

## Testing

### Unit Testing
```bash
npm run test
```

### API Testing
You can test the API using Postman or any other API testing tool. A Postman collection is included in the `/docs` folder.

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error responses follow this format:
```json
{
  "message": "Error message"
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

The database schema is defined in the `prisma/schema.prisma` file and includes the following models:
- User
- PendingUser
- Profile
- Booking
- Post
- Reply
- Notification

## Deployment

For production deployment:
```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
