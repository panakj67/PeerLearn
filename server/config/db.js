import mongoose from 'mongoose'

const connectDB = () => mongoose.connect(`${process.env.MONGODB_URI}`)
.then(() => {
    console.log("Connected to DB.")
}).catch((error) => {
    console.log("Something went wrong", error)
})


export default connectDB