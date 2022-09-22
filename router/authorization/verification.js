
const router = require('express').Router()
const randtoken = require('rand-token').generator()
const bcrypt= require('bcrypt')
//nodemailer
const mailer = require('nodemailer')
const user = require('../../model/user')
const verif = require('../../model/verif')
const myemail = mailer.createTransport({
    service:process.env.service,
    host:process.env.host,
    port:465 ,
    auth: {
        user:process.env.email,
        pass: process.env.pass
    }
})


router.get('/otp',async(req,res)=>{
const sess= req.session;
try {
    
    if (sess.user) {
        const chk= await user.findOne({Username:sess.user})
        if (chk) {
            const otp = randtoken.generate(4,'0123456789'),
                reset =randtoken.generate(16,'abcdefghijklmnopqrstuvwxyz0123456789$');
            await verif.updateOne({userID:chk._id},{otp, resetcode:reset})
            const mailoption= {
                    from: `View Wid <${process.env.email}>`,
                    to: chk.Email,
                    subject: chk.Username +"Your OTP",
                    html:`
                    <body>
    <center><h3>Your OTP to your accout is</h3></center>
    <center><h1>${otp}</h1></center>
</body>`
            }
            await myemail.sendMail(mailoption)    

            res.render('verification/otp',{msg:''})
        } else {
            sess.destroy()
            res.status(404).render('404')
        }
    } else {
        res.status(404).render('404')
    }
} catch (error) {
    console.log(error);
    res.render('verification/otp',{msg:'error sending please refresh'})

}
})



router.post('/otp',async(req,res)=>{
    const sess= req.session;
    const otp =req.body.otp
    try {
        
        if (sess.user) {
            const chk= await user.findOne({Username:sess.user})
            if (chk) {
                const getuserotp = await verif.findOne({userID:chk._id})
                if (otp!=null) {
                    if (otp.length== 4) {
                        if (otp==getuserotp.otp) {
                            await user.updateOne({_id:chk._id},{Verf:'true'})
                            await verif.updateOne({userID:chk._id},{otp:randtoken.generate(4,'0123456789')})
                        res.redirect('/')
                        } else {
        res.render('verification/otp',{msg:'Incorrect OTP'})
                            
                        }
                        
                    } else {
        res.render('verification/otp',{msg:'otp not complete'})
                        
                    }
                } else {
        res.render('verification/otp',{msg:'fill the form'})
                    
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
        res.render('verification/otp',{msg:'error occured'})
    }
    })
    
    
router.get('/reset',(req,res)=>{
    res.render('verification/reset/indexput',{msg:''})
})

router.post('/reset',async(req,res)=>{
    const reset =req.body.email

    try {
        
        if (reset!=null) {
            if (reset.length>3) {
                const chkEmail= await user.findOne({Email:reset})
                if (chkEmail) {
                    const resetLink=randtoken.generate(20,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$')
                    await verif.updateOne({userID:chkEmail._id},{resetcode:resetLink})
                    const mailoption= {
                        from: `View Wid <${process.env.email}>`,
                        to: chkEmail.Email,
                        subject: chkEmail.Username +", your reset link",
                        html:`
                        
<body>
<center><h1>Reset your details through this link</h1></center>
<center><h3>Do not share the link to anyone</h3></center>
<br><br>
<center><a href="${process.env.website}/v/${resetLink}/${chkEmail._id}" style="background-color: rgb(55, 182, 241); color: white; border-radius: 10px; font-weight: bold;text-decoration: none;padding: 20px;">click me</a></center>
</body>`
                }
                await myemail.sendMail(mailoption)    
                res.render('success',{tlk:'Sent'})
            } else {
    res.render('verification/reset/indexput',{msg:'User not found'})
                    
                }
            } else {
    res.render('verification/reset/indexput',{msg:'fill the form'})
                
            }
        } else {
    res.render('verification/reset/indexput',{msg:'fill the form'})
            
        }
    } catch (error) {
        console.log(error);
    res.render('verification/reset/indexput',{msg:'error occured'})
        
    }
})

router.get('/:id/:uId',async(req,res)=>{
    const id = req.params.id;
    const id2 = req.params.uId;


    try {
        if (id.length==20 && id2.length==24) {
            const chkid = await user.findOne({_id:id2})
            if (chkid) {
                const chkres= await verif.findOne({userID:id2,resetcode:id})
                if (chkres) {
                    res.render('verification/reset/reset',{msg:'', userdet:chkid, id1:id,id2})
                } else {
            res.status(404).render('404')
                    
                }
            } else {
            res.status(404).render('404')
                
            }
        } else {
            res.status(404).render('404')
        }
    } catch (error) {
        console.log(error);
        // res.render('reset',{msg:''})
    }
})



router.post('/:id/:uId',async(req,res)=>{
    const id = req.params.id;
    const id2 = req.params.uId;
    const collect = req.body

    try {
        if (id.length==20 && id2.length==24) {
            const chkid = await user.findOne({_id:id2})
            if (chkid) {
                const chkres= await verif.findOne({userID:id2,resetcode:id})
                if (chkres) {
                    if (collect.Pass!=null && collect.about!=null) {
                        if ((collect.Pass).length>=4 && (collect.about).length>=6 ) {
                              await user.updateOne({_id:id2},{password:bcrypt.hashSync(collect.Pass,10), About:collect.about})
                              await verif.updateOne({userID:id2},{otp:randtoken.generate(4,'1234'),resetcode:randtoken.generate(16,'abcdefghijklmnopqrstuvwxyz0123456789$')})
                              const mailoption= {
                                from: `View Wid <${process.env.email}>`,
                                to: chkid.Email,
                                subject: chkid.Username +", Reset",
                                html:`
                                
        <body>
        <center><h1>Your Password and your about has been reset</h1></center>
        <center><h3>click to login</h3></center>
        <br><br>
        <center><a href="${process.env.website}" style="background-color: rgb(55, 182, 241); color: white; border-radius: 10px; font-weight: bold;text-decoration: none;padding: 20px;">click me</a></center>
        </body>`
                        }
                        await myemail.sendMail(mailoption)  
                        res.render('success',{tlk:'Reset'})
                        } else {
                    res.render('verification/reset/reset',{msg:'fill the form well', userdet:chkid, id1,id2})
                            
                        }
                    } else {
                    res.render('verification/reset/reset',{msg:'fill the form', userdet:chkid, id1,id2})
                        
                    }
                } else {
            res.status(404).render('404')
                    
                }
            } else {
            res.status(404).render('404')
                
            }
        } else {
            res.status(404).render('404')
        }
    } catch (error) {
        console.log(error);
        // res.render('reset',{msg:''})
    }
})


router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

module.exports=router