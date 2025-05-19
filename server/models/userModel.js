const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    degree : String,
    college : String,
    branch : String,
    semester : Number,
    points : {
        type : Number,
        default : 50
    },
    profileImg : {
        type : String,
        default : '',
    },
    uploads : {
        type :  [{
           type : mongoose.Schema.Types.ObjectId,
           ref : 'Note'
        }],
        default : []
    },
    downloads : {
        type :  [{
           type : mongoose.Schema.Types.ObjectId,
           ref : 'Note'
        }],
        default : []
    },
    bookmarks : {
        type :  [{
           type : mongoose.Schema.Types.ObjectId,
           ref : 'Note'
        }],
        default : []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;