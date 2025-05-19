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



app.use(cors({
    origin: process.env.FRONTEND_URL,
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
