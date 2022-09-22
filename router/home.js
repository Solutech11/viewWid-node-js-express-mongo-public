
const router = require('express').Router()
const images = require('../model/images');
const user = require('../model/user');
const cloudinary= require('cloudinary')

router.get('/',async(req,res)=>{
const sess= req.session;
try {
    const allImgs = await images.find({}),
    allImg= allImgs.sort(()=>{return Math.random()-0.5})

    if (sess.user) {
        const chk= await user.findOne({Username:sess.user})
        if (chk) {
            res.render('home',{allImg,srch:'', session:true, _user:chk})
        } else {
            sess.destroy()
            res.render('home',{allImg,srch:'', session:false})
        }
    } else {
        res.render('home',{allImg,srch:'', session:false})
    }
} catch (error) {
    console.log(error);
}
})




router.get('/user',async(req,res)=>{
    const sess= req.session;
    try {
      
        if (sess.user) {
            const chk= await user.findOne({Username:sess.user})
            if (chk) {
                const allImgs = await images.find({userID:chk._id}),
                allImg= allImgs.reverse()
            
                res.render('userHomee',{allImg,srch:'', session:true, _user:chk})
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


router.get('/delete/:id',async(req,res)=>{
    const sess= req.session;
    const id = req.params.id;
    try {
      
        if (sess.user) {
            const chk= await user.findOne({Username:sess.user})
            if (chk) {
                if (id.length==24) {
                    const getimg= await images.findOne({_id:id,userID:chk._id})
                    if (getimg) {
                        await cloudinary.v2.uploader.destroy(getimg.publicID)
                        await images.deleteOne({_id:id, userID:chk._id})
                        res.render('success',{tlk:'deleted Image'})

                    } else {
                res.status(404).render('404')
                        
                    }
                    
                } else {
                res.status(404).render('404')
                    
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
    }
})


router.post('/search',async(req,res)=>{
    const sess= req.session;
    const search =req.body.searchs
    try {
        const allImgs = await images.find({})
        const allImg = allImgs.filter(i=>{
            return (i.Name).includes(search)
        })
        if (sess.user) {
            const chk= await user.findOne({Username:sess.user})
            if (chk) {
                res.render('home',{allImg,srch:search, session:true, _user:chk})
            } else {
                sess.destroy()
                res.render('home',{allImg,srch:search, session:false})
            }
        } else {
            res.render('home',{allImg,srch:search, session:false})
        }
    } catch (error) {
        console.log(error);
    }
    })
    
    



router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

module.exports=router