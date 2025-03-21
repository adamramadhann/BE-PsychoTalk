import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import routeAuth from './auth/routeAuth.js'; 
import routeControler from './controller/routeControler.js';
import path from "path";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({
    limit : '100mb'
}))
app.use(express.urlencoded({
    extended : true
}))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', routeAuth )
app.use('/api', routeControler )


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`
        =================
        run server ${PORT}
        ================
        `)
})