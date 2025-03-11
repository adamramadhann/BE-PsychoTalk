import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import routeAuth from './auth/routeAuth.js'; 

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({
    limit : '100mb'
}))
app.use(express.urlencoded({
    extended : true
}))

app.use('/api', routeAuth )

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`
        =================
        run server ${PORT}
        ================
        `)
})