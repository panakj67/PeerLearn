require('dotenv').config();
const cookieParser = require('cookie-parser')
const express = require('express')
const connectDB = require('./config/db')
const userRouter = require('./routes/userRoutes.js')
const noteRouter = require('./routes/noteRoutes.js')
const cors = require('cors')




const app = express()

connectDB()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  "https://peer-learn.vercel.app",
  "https://peer-learn-git-main-pankaj-kumars-projects-a2ff3a66.vercel.app",
  "https://peer-learn-hcaoc1416-pankaj-kumars-projects-a2ff3a66.vercel.app",
];


app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }, 
    credentials: true, 
}))

app.get('/', (req, res) => {
    res.send("API is working");
})
app.use('/api/user', userRouter)
app.use('/api/note', noteRouter)

app.listen(3000, () => {
    console.log("Server is running on PORT 3000");
})
