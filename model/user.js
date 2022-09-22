const mongoose = require('mongoose')

const Schema= mongoose.Schema

const user = new Schema({
    Username:{
        required:true,
        type:String,
        unique:true
    },
    Email:{
        required:true,
        type:String,
        unique:true

    },
    About:{
        required:true,
        type:String,
    },
    InstagramLink:{
        required:true,
        type:String,
        unique:true

    },
    Phone:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        required:true,
        type:String
    },
    Verf:{
        required:true,
        type:String,
        default:false
    }
})

module.exports = mongoose.model('user',user)