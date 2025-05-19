const mongoose = require('mongoose')

const connectDB = () => mongoose.connect(`${process.env.MONGODB_URI}`)
.then(() => {
    console.log("Connected to DB.")
}).catch((error) => {
    console.log("Something went wrong", error)
})


module.exports = connectDB;