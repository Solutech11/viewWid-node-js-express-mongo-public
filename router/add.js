
const router = require('express').Router()
const images = require('../model/images');
const user = require('../model/user');
const cloudinary= require('cloudinary')
router.get('/',async(req,res)=>{
const sess= req.session;
try {
    const allImg = await images.find({})

    if (sess.user) {
        const chk= await user.findOne({Username:sess.user})
        if (chk) {
            res.render('add',{msg:''})
        } else {
            sess.destroy()
            res.status(404).render('404')
        }
    } else {
        res.status(404).render('404')
    }
} catch (error) {
    console.log(error);
}
})

router.post('/',async(req,res)=>{
    const sess= req.session;
    const collect = req.body;
    try {
    
        if (sess.user) {
            const chk= await user.findOne({Username:sess.user})
            if (chk) {
                if (chk.Verf=='true') {
                    if (collect.Name!=null) {
                        if ((collect.Name).length>0) {
                            const imagee= req.files.img
                            if (imagee.mimetype=='image/apng' || imagee.mimetype=='image/avif' ||imagee.mimetype=='image/gif' || imagee.mimetype=='image/jpeg' || imagee.mimetype=='image/png' || imagee.mimetype=='image/svg+xml' || imagee.mimetype=='image/webp') {
                                const upload=await cloudinary.v2.uploader.upload(imagee.tempFilePath,{resource_type:'image', folder:process.env.cloudFolderAll,use_filename:false,unique_filename:true})
                                const newImg = new images({Name:collect.Name, img:upload.secure_url,publicID:upload.public_id, userID:chk._id})
                                await newImg.save()
                                res.redirect('/')
                            } else {
                res.render('add',{msg:'Invalid file type'})
                                
                            }
                        } else {
                res.render('add',{msg:'fill the form'})
                            
                        }
                } else {
                    res.render('add',{msg:'fill the form'})
                    
                }
                
                } else {
            res.render('add',{msg:'verify your account'})
                    
                }
            } else {
                sess.destroy()
                res.status(404).render('404')
            }
        } else {
            res.status(404).render('404')
        }
    } catch (error) {
        console.log(error);
        res.render('add',{msg:'error occured '})

    }
    })
    
    

module.exports=router