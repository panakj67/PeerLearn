const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
    },

    college : {
        type : String,
        required : true,
        trim : true,
    },

    degree : {
        type : String,
        default : ''
    },

    branch : {
        type : String,
        required : true,
    },

    semester : {
        type : Number,
        required : true,
        min : 1,
        max : 8,
    },

    subject : {
        type : String,
        required :  true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    image : {
        type : String,
        required : true,
    },
    fileUrl : {
        type : String,
        required : true,
    },
    rating : {
        type : Number,
        default : 0,
        min: 0,
        max: 5,
    },
    views : {
        type : Number,
        default : 0,
    },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},{ timestamps : true })

const noteModel = mongoose.model("Note", noteSchema)
module.exports = noteModel