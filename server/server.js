import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import express from 'express';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import noteRouter from './routes/noteRoutes.js';
import cors from 'cors';
import apiRouter from './routes/apiRoutes.js';




const app = express()

connectDB()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://peer-learn.vercel.app",
   "https://peer-learn-git-clean-version-pankaj-kumars-projects-a2ff3a66.vercel.app/",
  "https://peer-learn-git-main-pankaj-kumars-projects-a2ff3a66.vercel.app",
  "https://peer-learn-hcaoc1416-pankaj-kumars-projects-a2ff3a66.vercel.app",
];


app.use(cors({
    origin: '*',
    credentials: true, 
}))

app.get('/', (req, res) => {
    res.send("API is working");
})
app.use('/api/user', userRouter)
app.use('/api/note', noteRouter)
app.use('/api/chat', apiRouter)

app.listen(3000, () => {
    console.log("Server is running on PORT 3000");
})
