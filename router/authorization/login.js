const user = require('../../model/user');
const bcrypt= require('bcrypt')
const router = require('express').Router()

router.get('/',async(req,res)=>{
const sess= req.session;
try {
    res.render('login', {msg:''})
    
} catch (error) {
    console.log(error);
    res.render('login', {msg:'error'})
}
})

router.post('/',async(req,res)=>{
    const sess= req.session;
    const collect = req.body
    try {
        if (collect.email!=null && collect.Pass!=null) {
            if ((collect.email).length>=5 && (collect.Pass).length>=4 ) {
                const chkLogin= await user.findOne({Email:collect.email})
                 

                if (chkLogin) {
                    const pass= bcrypt.compareSync(collect.Pass, chkLogin.password)
                    if (pass== true) {
                        sess.user= chkLogin.Username
                        if (chkLogin.Verf=='true') {
                        res.redirect('/')
                            
                        } else {
                        res.redirect('/v/otp')
                            
                        }
                    } else {
    res.render('login', {msg:'Incorrect password'})
                        
                    }
                    
                } else {
    res.render('login', {msg:'user doesnt exist'})
                    
                }



            } else {
    res.render('login', {msg:'fill the form'})
                
            }
        } else {
    res.render('login', {msg:'fill the form'})
            
        }
    } catch (error) {
        console.log(error);
        res.render('login', {msg:'error'})
    }
})

module.exports=router