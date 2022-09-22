const mongoose = require('mongoose')

const Schema= mongoose.Schema

const verif = new Schema({
    userID:{
        required:true,
        type:String,
        unique:true
    },
    resetcode:{
        required:true,
        type:String,
    },
    otp:{
        required:true,
        type:String,
    },
    
})

module.exports = mongoose.model('Verification',verif)