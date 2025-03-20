import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import path from 'path';
import routeAuth from './auth/routeAuth.js'; 
import routeControler from './controller/routeControler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

// **Menjadikan folder uploads sebagai public**
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routeAuth);
app.use('/api', routeControler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`
        =================
        Server running on port ${PORT}
        =================
    `);
});
