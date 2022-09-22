const mongoose = require('mongoose')

const Schema= mongoose.Schema

const image = new Schema({
    Name:{
        required:true,
        type:String,
    },
    img:{
        required:true,
        type:String,
    },
    publicID:{
        required:true,
        type:String,
    },
    userID:{
        required:true,
        type:String,
    }
})

module.exports = mongoose.model('image',image)