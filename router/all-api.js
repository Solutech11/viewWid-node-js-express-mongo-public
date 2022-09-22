
const router = require('express').Router()
const images = require('../model/images');


router.get('/',async(req,res)=>{
    try {
        const imagess= await images.find({})
        res.json({access:true,error:false, img:imagess})
    } catch (error) {
        console.log(error);
        res.json({access:true, error:true})
    }
})

module.exports=router