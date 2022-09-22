const user = require('../../model/user');
const bcrypt= require('bcrypt');
const verif = require('../../model/verif');
const router = require('express').Router()
const randtoken = require('rand-token').generator()
router.get('/',async(req,res)=>{
const sess= req.session;
try {
    res.render('register', {msg:''})
    
} catch (error) {
    console.log(error);
    res.render('register', {msg:'error'})
}
})

router.post('/',async(req,res)=>{
    const sess= req.session;
    const collect = req.body
    try {
        if (collect.Username!=null && collect.email!=null && collect.about!=null && collect.ig!=null && collect.phone!=null && collect.Pass!=null) {
            if ((collect.Username).length>=3 && (collect.email).length>=5 && (collect.about).length>=6 && (collect.ig).length>=10 && (collect.phone).length>=4 && (collect.Pass).length>=4 ) {
                const chkuser= await user.findOne({Username:collect.Username});
                const chkemail= await user.findOne({Email:collect.email}),
                 chkIG= await user.findOne({InstagramLink:collect.ig}),
                 phn= await user.findOne({Phone:collect.phone});

                if (chkIG ||chkemail || chkuser || phn) {
    res.render('register', {msg:'user exist'})
                    
                } else {
                    const newUser= new user({
                        Username:collect.Username,
                        Email:collect.email,
                        About:collect.about,
                        InstagramLink:collect.ig,
                        Phone:collect.phone,
                        password:bcrypt.hashSync(collect.Pass,10),
                        Verf:'false'
                    })

                    const usersave =await newUser.save()

                    const newVerif = new verif({userID:usersave._id, resetcode:randtoken.generate(16,'abcdefghijklmnopqrstuvwxyz0123456789$'), otp:randtoken.generate(4,'1234567890')})
                    newVerif.save()
                    sess.user= collect.Username;

                    res.redirect('/v/otp')
                }



            } else {
    res.render('register', {msg:'fill the form'})
                
            }
        } else {
    res.render('register', {msg:'fill the form'})
            
        }
    } catch (error) {
        console.log(error);
        res.render('register', {msg:'error'})
    }
})

module.exports=router