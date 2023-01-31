const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile',{
            title: "User Profile",
            profile_user: user
        });
    });
    
}

module.exports.update = async function(req,res){

    if(req.user.id == req.params.id)

    try {

        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req,res, function(err){
            if(err){ console.log('****MULTER ERROR', err)}

            user.name = req.body.name;
            user.email = req.body.email;

            if(req.file){

                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname , '..' , user.avatar));
                }

                //this is saving the path of the uploaded file in the avatar field of the user
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
        });
        
    } catch (err) {
        req.flash('error',err);
        return res.redirect('back');
    }

}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title: "Vartalaap | SIGN UP"
    });
}

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: "Vartalaap | SIGN IN"
    });
}

module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error','Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            req.flash('error','Error in finding user for signing up');
            return;
        }
        if(!user){
            User.create(req.body, function(err,user){
                if(err){
                    req.flash('error','Error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        }
        else{
            req.flash('success','You have signed up, login to continue');
            res.redirect('back');
        }
    })
}

//sign in and create a session for the user
module.exports.createSession=function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','Logged Out Successfully');

    return res.redirect("/");
      
}