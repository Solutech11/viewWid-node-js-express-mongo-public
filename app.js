const express = require('express')
const app = express()
const port = process.env.PORT||3000


//Morgan
app.use(require('morgan')('dev'))

//cors
app.use(require('cors')())

//dotenv
require('dotenv').config()

//bodyparser
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extended:true,limit:'50mb'}))
app.use(bodyparser.json({extended:true,limit:'50mb'}))

//fileupload
app.use(require('express-fileupload')({useTempFiles:true}))

//cloudinary
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})

//session
app.use(require('express-session')({resave:true, secret:process.env.secret, saveUninitialized:true,cookie:{expires:2678400000}}))

//ejs
app.set('view engine','ejs')

//public
app.use(express.static('public'))


//db
require('mongoose').connect(process.env.mongolink).then(res=>{
    if (res) {
        console.log('db connected');
        app.listen(port, () => console.log(`app listening on port ${port}!`))

    } else {
        console.log('db not connected');
    }
})


//routes
app.use('/',require('./router/home'))//home

app.use('/register',require('./router/authorization/register'))//register

app.use('/login',require('./router/authorization/login'))//login

app.use('/add',require('./router/add'))//add

app.use('/v',require('./router/authorization/verification'))//reset and otp

app.use('/api',require('./router/all-api'))//add
